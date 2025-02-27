import { spawn } from 'child_process';
import { getParameter } from './configService.js';
import { v4 } from 'uuid';
import fs from 'fs';
import { createNZBName, legacyCreateNZBName } from '../utils/utils.js';
import path from 'path';
import historyService from './historyService.js';
import socketService from './socketService.js';
import loggingService from './loggingService.js';
import sonarrService from './sonarrService.js';
import NodeCache from 'node-cache';
import queueService from './queueService.js';

const downloads = {};
const timestampFile = 'iplayarr_timestamp';

const episodeRegex = /([0-9]+:)[^a-zA-Z]([^,]+),[^a-zA-Z]([^,]+),[^a-zA-Z]([^,]+)(?:$|\n)/;
const progressRegex = /([\d.]+)% of ~?([\d.]+ [A-Z]+) @[ ]+([\d.]+ [A-Za-z]+\/s) ETA: ([\d:]+).*$/;
const filenameRegex = /INFO: Downloading (?:[a-z]+): '([^']+) \(([0-9a-z]+)\) \[[a-z]+\]'/;

const filenameCache = new NodeCache({ stdTTL: 60 * 60 * 24, checkperiod: 60 * 60 });
const searchCache = new NodeCache({stdTTL: 300, checkpreiod: 60});

const iplayerService = {
    getQueue: () => {
        return Object.values(downloads);
    },

    refreshCache: () => {
        const downloadDir = getParameter("DOWNLOAD_DIR");
        const fullExec = getParameter("GET_IPLAYER_EXEC");
        const args = fullExec.match(/(?:[^\s"]+|"[^"]*")+/g);

        const exec = args.shift();

        //Refresh the cache
        loggingService.debug(`Executing get_iplayer with args: ${args.join(" ")} --cache-rebuild`);
        spawn(exec, [...args, '--cache-rebuild'], { shell: true });
        
        //Delete failed jobs
        const threeHoursAgo = Date.now() - 3 * 60 * 60 * 1000;
        fs.readdir(downloadDir, { withFileTypes: true }, (err, entries) => {
            if (err) {
                console.error('Error reading directory:', err);
                return;
            }
    
            entries.forEach(entry => {
                if (!entry.isDirectory()) return;
    
                const dirPath = path.join(downloadDir, entry.name);
                const filePath = path.join(dirPath, timestampFile);
    
                fs.stat(filePath, (err, stats) => {
                    if (err) {
                        // Ignore missing files
                        if (err.code !== 'ENOENT') console.error(`Error checking ${filePath}:`, err);
                        return;
                    }
    
                    if (stats.mtimeMs < threeHoursAgo) {
                        fs.rm(dirPath, { recursive: true, force: true }, (err) => {
                            if (err) {
                                loggingService.error(`Error deleting ${dirPath}:`, err);
                            } else {
                                loggingService.log(`Deleted old directory: ${dirPath}`);
                            }
                        });
                    }
                });
            });
        });
    },

    cancel: async (id) => {
        queueService.cancelItem(id);


        const download = Object.values(downloads).find((d) => d.id === id)
        if (download){
            const {uuid} = download;
            delete downloads[uuid];

            const downloadDir = getParameter("DOWNLOAD_DIR");
            const uuidPath = path.join(downloadDir, uuid);

            try{
                fs.rmSync(uuidPath, { recursive: true, force: true });
            } catch (err) {
            loggingService.error(`Error deleting ${uuidPath}:`, err);
            }
        }
    },

    download: async (id) => {
        const uuid = v4();
        const fullExec = getParameter("GET_IPLAYER_EXEC");
        const downloadDir = getParameter("DOWNLOAD_DIR");
        const completeDir = getParameter("COMPLETE_DIR");
        const args = fullExec.match(/(?:[^\s"]+|"[^"]*")+/g);

        const exec = args.shift();
        fs.mkdirSync(`${downloadDir}/${uuid}`);
        fs.writeFileSync(`${downloadDir}/${uuid}/iplayarr_timestamp`, '');
        const allArgs = [...args, '--output', `${downloadDir}/${uuid}`, '--overwrite', '--force', '--log-progress', `--pid=${id}`];

        loggingService.debug(`Executing get_iplayer with args: ${allArgs.join(" ")}`);
        const downloadProcess = spawn(exec, allArgs);

        const download = {
            uuid,
            id,
            progress: 0,
            size: 0,
            sizeLeft: 1000,
            speed: 0,
            eta: "",
            start: new Date()
        };

        downloads[uuid] = download;

        downloadProcess.stdout.on('data', (data) => {
            if (downloads[uuid]){
                socketService.emit('log', {id, message : data.toString(), timestamp : new Date()});
                console.log(data.toString());
                const lines = data.toString().split("\n");
                const filenameLine = lines.find((l) => filenameRegex.exec(l));
                if (filenameLine) {
                    const filenameMatch = filenameRegex.exec(filenameLine);
                    let filename = `${filenameMatch[1]} ${filenameMatch[2]}`;
                    const cachedFilename = filenameCache.get(id);
                    filename = (cachedFilename || legacyCreateNZBName(filename)) + ".mp4";
                    downloads[uuid].filename = filename;
                }
                const progressLines = lines.filter((l) => progressRegex.exec(l));
                if (progressLines.length > 0) {
                    const progressLine = progressLines.pop();
                    const match = progressRegex.exec(progressLine);
                    const [_, progress, size, speed, eta] = match;
                    const percentFactor = (100 - parseFloat(progress)) / 100;
                    const sizeLeft =  parseFloat(size) * percentFactor;

                    downloads[uuid] = {
                        ...downloads[uuid],
                        progress: parseFloat(progress),
                        size: parseFloat(size),
                        speed: parseFloat(speed),
                        eta,
                        sizeLeft
                    }
                }

                queueService.updateQueue(id, downloads[uuid]);
            }
        });

        downloadProcess.on('close', async (code) => {
            if (code === 0) {
                try {
                    const uuidPath = path.join(downloadDir, uuid);
                    const files = fs.readdirSync(uuidPath);
                    const mp4File = files.find(file => file.endsWith(".mp4"));

                    if (mp4File) {
                        const oldPath = path.join(uuidPath, mp4File);
                        const newPath = path.join(completeDir, downloads[uuid].filename);

                        fs.renameSync(oldPath, newPath);
                    }

                    // Delete the uuid directory after moving the file
                    fs.rmSync(uuidPath, { recursive: true, force: true });

                    await historyService.addHistory(downloads[uuid]);
                } catch (err) {
                    console.error(err);
                }
            }
            delete downloads[uuid];
            queueService.removeFromQueue(id);
        });

        return downloadProcess;
    },

    search: async (term, season, episode) => {

        //Get the episode name from Sonarr
        const episodeName = episode && term != '*' ? await sonarrService.getEpisodeTitle(term, season, episode) : undefined;
        
        //Check if we've searched this show before
        let results = searchCache.get(term);
        if (!results){
            results = await searchIPlayer(term);
            searchCache.set(term, results);
        }

        //Find the correct season and show
        results = results.filter(({show}) => {
            if (season && !show.includes(`Series ${season}`) && !show.includes(`Season ${season}`)) {
                return false;
            }
            if (episode) {
                const episodeFoundByNumber = show.includes(`Episode ${episode}`);
                const episodeFoundByName = episodeName && show.includes(episodeName);
                if (!episodeFoundByNumber && !episodeFoundByName) {
                    return false;;
                }
            }
            return true;
        });

        //Create an NZB Name for this result
        for (let result of results){
            const nzbName = term != "*" ? (await createNZBName(result.nzbData.term, result.nzbData.line || legacyCreateNZBName(result.show))) : legacyCreateNZBName(result.show);
            filenameCache.set(result.id, nzbName);
            result.nzbName = nzbName;
        }
        return results;
    }
};

async function searchIPlayer(term){
    return new Promise((resolve, reject) => {
        const results = [];
        const fullExec = getParameter("GET_IPLAYER_EXEC");
        const args = fullExec.match(/(?:[^\s"]+|"[^"]*")+/g);

        const exec = args.shift();
        const allArgs = [...args, `"${term}"`];

        loggingService.debug(`Executing get_iplayer with args: ${allArgs.join(" ")}`);
        const searchProcess = spawn(exec, allArgs, { shell: true });    

        searchProcess.stdout.on('data', (data) => {
            loggingService.debug(data.toString().trim());
            const lines = data.toString().split("\n");
            for (const line of lines) {
                const match = episodeRegex.exec(line);
                if (match) {
                    const [_, number, show, channel, id] = match;
                    results.push({ number, show, channel, id, nzbData : {term, line} });
                }
            }
        });

        searchProcess.stderr.on('data', (data) => {
            loggingService.error(data.toString().trim());
        });

        searchProcess.on('close', async (code) => {
            if (code === 0) {
                resolve(results);
            } else {
                reject(new Error(`Process exited with code ${code}`));
            }
        });
    })
}

export default iplayerService;
