import { ChildProcess, spawn } from "child_process";
import sonarrService from "./sonarrService";
import NodeCache from "node-cache";
import { getParameter } from "./configService";
import { IplayarrParameter } from "../types/IplayarrParameters";
import loggingService from "./loggingService";
import { IPlayerSearchResult, VideoType } from "../types/IPlayerSearchResult";
import { createNZBName } from "../utils/Utils";
import { v4 } from "uuid";
import fs from 'fs';
import queueService from "./queueService";
import socketService from "./socketService";
import { DownloadDetails } from "../types/DownloadDetails";
import path from "path";
import historyService from "./historyService";
import { QueueEntry } from "../types/QueueEntry";
import synonymService from "./synonymService";
import { Synonym } from "../types/Synonym";
import { LogLine, LogLineLevel } from "../types/LogLine";

const progressRegex = /([\d.]+)% of ~?([\d.]+ [A-Z]+) @[ ]+([\d.]+ [A-Za-z]+\/s) ETA: ([\d:]+).*$/;

const seriesRegex : RegExp = /: (?:Series|Season) (\d+)/
const listFormat : string = "RESULT|:|<pid>|:|<name>|:|<seriesnum>|:|<episodenum>|:|<index>|:|<channel>"

const searchCache : NodeCache = new NodeCache({stdTTL: 300, checkperiod: 60});

const timestampFile = 'iplayarr_timestamp';

const iplayerService = {
    download : async (pid : string) : Promise<ChildProcess> => {
        const uuid : string = v4();
        const downloadDir = await getParameter(IplayarrParameter.DOWNLOAD_DIR) as string;
        const completeDir = await getParameter(IplayarrParameter.COMPLETE_DIR) as string;

        const [exec, args] = await getIPlayerExec();
        fs.mkdirSync(`${downloadDir}/${uuid}`);
        fs.writeFileSync(`${downloadDir}/${uuid}/${timestampFile}`, '');
        const allArgs = [...args, '--output', `${downloadDir}/${uuid}`, '--overwrite', '--force', '--log-progress', `--pid=${pid}`];

        loggingService.debug(`Executing get_iplayer with args: ${allArgs.join(" ")}`);
        const downloadProcess = spawn(exec as string, allArgs);

        downloadProcess.stdout.on('data', (data) => {
            if (queueService.getFromQueue(pid)){
                const logLine : LogLine = {level : LogLineLevel.INFO, id : pid, message : data.toString(), timestamp : new Date()}
                socketService.emit('log', logLine);
                console.log(data.toString());
                const lines : string[] = data.toString().split("\n");
                const progressLines : string[] = lines.filter((l) => progressRegex.exec(l));
                if (progressLines.length > 0){
                    const progressLine : string = progressLines.pop() as string;
                    const match = progressRegex.exec(progressLine);
                    if (match){
                        const [_, progress, size, speed, eta] = match;
                        const percentFactor = (100 - parseFloat(progress)) / 100;
                        const sizeLeft = parseFloat(size) * percentFactor;

                        const deltaDetails : Partial<DownloadDetails> = {
                            uuid,
                            progress : parseFloat(progress),
                            size : parseFloat(size),
                            speed : parseFloat(speed),
                            eta,
                            sizeLeft
                        }

                        queueService.updateQueue(pid, deltaDetails);
                    }
                }
            }
        });

        downloadProcess.on('close', async (code) => {
            if (code === 0) {
                const queueItem : QueueEntry | undefined = queueService.getFromQueue(pid);
                if (queueItem){
                    try {
                        const uuidPath = path.join(downloadDir, uuid);
                        const files = fs.readdirSync(uuidPath);
                        const mp4File = files.find(file => file.endsWith(".mp4"));

                        if (mp4File) {
                            const oldPath = path.join(uuidPath, mp4File);
                            const newPath = path.join(completeDir, `${queueItem?.nzbName}.mp4`);

                            fs.renameSync(oldPath, newPath);
                        }

                        // Delete the uuid directory after moving the file
                        fs.rmSync(uuidPath, { recursive: true, force: true });

                        await historyService.addHistory(queueItem);
                    } catch (err) {
                        console.error(err);
                    }
                }
            }
            queueService.removeFromQueue(pid);
        });

        return downloadProcess;
    },

    search : async (inputTerm : string, season? : number, episode? : number) : Promise<IPlayerSearchResult[]> => {
        //Sanitize the term, BBC don't put years on their movies
        const term = !season ? removeLastFourDigitNumber(inputTerm) : inputTerm;

        const synonym = await synonymService.getSynonym(inputTerm);
        const searchTerm = synonym ? synonym.target : term;

        //Check the cache
        let results : IPlayerSearchResult[] | undefined = searchCache.get(searchTerm);
        if (!results){
            results = await searchIPlayer(searchTerm, synonym);
            searchCache.set(searchTerm, results);
        }

        if (season && episode){
            return results.filter((result) => result.series == season && result.episode == episode);
        } else {
            return results;
        }
    },

    refreshCache: async () => {
        const downloadDir = await getParameter(IplayarrParameter.DOWNLOAD_DIR) as string;
        const [exec, args] = await getIPlayerExec();

        //Refresh the cache
        loggingService.debug(`Executing get_iplayer with args: ${[...args].join(" ")} --cache-rebuild`);
        const refreshService = spawn(exec as string, [...args, '--cache-rebuild'], { shell: true });

        refreshService.stdout.on('data', (data) => {
            loggingService.log(data.toString());
        });

        refreshService.stderr.on('data', (data) => {
            loggingService.error(data.toString());
        });
        
        //Delete failed jobs
        const threeHoursAgo : number = Date.now() - 3 * 60 * 60 * 1000;
        fs.readdir(downloadDir, { withFileTypes: true }, (err, entries) => {
            if (err) {
                console.error('Error reading directory:', err);
                return;
            }
    
            entries.forEach(entry => {
                if (!entry.isDirectory()) return;
    
                const dirPath : string = path.join(downloadDir, entry.name);
                const filePath : string = path.join(dirPath, timestampFile);
    
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
}

async function searchIPlayer(term : string, synonym? : Synonym) : Promise<IPlayerSearchResult[]> {
    return new Promise(async (resolve, reject) => {
        const results : IPlayerSearchResult[] = []
        const [exec, args] = await getIPlayerExec();
        const exemptionArgs : string[] = [];
        if (synonym && synonym.exemptions){
            const exemptions = synonym.exemptions.split(",");
            for (const exemption of exemptions){
                exemptionArgs.push('--exclude');
                exemptionArgs.push(`"${exemption}"`);
            }
        }
        const allArgs = [...args, "--listformat", `"${listFormat}"`, ...exemptionArgs, `"${term}"`];

        loggingService.debug(`Executing get_iplayer with args: ${allArgs.join(" ")}`);
        const searchProcess = spawn(exec as string, allArgs, { shell: true });

        searchProcess.stdout.on('data', (data) => {
            loggingService.log(data.toString().trim());
            const lines : string[] = data.toString().split('\n');
            for (const line of lines){
                if (line.startsWith("RESULT|:|")){
                    let [_, pid, rawTitle, seriesStr, episodeStr, number, channel] = line.split("|:|");
                    const episode : number | undefined = (episodeStr == "" ? undefined : parseInt(episodeStr));
                    const [title, series] = (seriesStr == "" ? [rawTitle, undefined] : extractSeriesNumber(rawTitle, seriesStr))
                    const type : VideoType = episode && series ? VideoType.TV : VideoType.MOVIE;
                    results.push({
                        pid,
                        title,
                        channel,
                        number: parseInt(number),
                        request: {term, line},
                        episode,
                        series,
                        type
                    });
                }
            }
        });

        searchProcess.stderr.on('data', (data) => {
            loggingService.error(data.toString().trim());
        });

        searchProcess.on('close', async (code) => {
            if (code === 0) {
                for (let result of results){
                    const nzbName = await createNZBName(result.type, {
                        title: result.title.replaceAll(" ", "."),
                        season: result.series ? result.series.toString().padStart(2, '0') : undefined,
                        episode: result.episode ? result.episode.toString().padStart(2, '0') : undefined,
                    });
                    result.nzbName = nzbName;
                }
                resolve(results);
            } else {
                reject(new Error(`Process exited with code ${code}`));
            }
        });
    });
}

function extractSeriesNumber(title : string, series : string) : any[]{
    const match = seriesRegex.exec(title);
    if (match){
        return [title.replace(seriesRegex, ''), parseInt(match[1])];
    } else {
        return [title, parseInt(series)];
    }
}

async function getIPlayerExec() : Promise<(string | RegExpMatchArray)[]> {
    const fullExec : string = await getParameter(IplayarrParameter.GET_IPLAYER_EXEC) as string;
    const args : RegExpMatchArray = fullExec.match(/(?:[^\s"]+|"[^"]*")+/g) as RegExpMatchArray;

    const exec : string = args.shift() as string;

    return [exec, args];
}

function removeLastFourDigitNumber(str : string) {
    return str.replace(/\d{4}(?!.*\d{4})/, '').trim();
}

export default iplayerService;
