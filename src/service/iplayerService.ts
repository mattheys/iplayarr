import { ChildProcess, spawn } from "child_process";
import sonarrService from "./sonarrService";
import NodeCache from "node-cache";
import { getParameter } from "./configService";
import { IplayarrParameter } from "../types/IplayarrParameters";
import loggingService from "./loggingService";
import { IPlayerSearchResult } from "../types/IPlayerSearchResult";
import { createNZBName, legacyCreateNZBName } from "../utils/Utils";
import { v4 } from "uuid";
import fs from 'fs';
import queueService from "./queueService";
import socketService from "./socketService";
import { DownloadDetails } from "../types/DownloadDetails";
import path from "path";
import historyService from "./historyService";
import { QueueEntry } from "../types/QueueEntry";

const episodeRegex = /([0-9]+:)[^a-zA-Z]([^,]+),[^a-zA-Z]([^,]+),[^a-zA-Z]([^,]+)(?:$|\n)/;
const progressRegex = /([\d.]+)% of ~?([\d.]+ [A-Z]+) @[ ]+([\d.]+ [A-Za-z]+\/s) ETA: ([\d:]+).*$/;
const searchCache : NodeCache = new NodeCache({stdTTL: 300, checkperiod: 60});

const iplayerService = {
    download : async (pid : string) : Promise<ChildProcess> => {
        const uuid : string = v4();
        const downloadDir = await getParameter(IplayarrParameter.DOWNLOAD_DIR) as string;
        const completeDir = await getParameter(IplayarrParameter.COMPLETE_DIR) as string;

        const [exec, args] = await getIPlayerExec();
        fs.mkdirSync(`${downloadDir}/${uuid}`);
        fs.writeFileSync(`${downloadDir}/${uuid}/iplayarr_timestamp`, '');
        const allArgs = [...args, '--output', `${downloadDir}/${uuid}`, '--overwrite', '--force', '--log-progress', `--pid=${pid}`];

        loggingService.debug(`Executing get_iplayer with args: ${allArgs.join(" ")}`);
        const downloadProcess = spawn(exec as string, allArgs);

        downloadProcess.stdout.on('data', (data) => {
            if (queueService.getFromQueue(pid)){
                socketService.emit('log', {id : pid, message : data.toString(), timestamp : new Date()});
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

    filmSearch : async (term : string) : Promise<IPlayerSearchResult[]> => {
        //If we've searched before
        let results : IPlayerSearchResult[] | undefined = searchCache.get(term);
        if (!results){
            results = await searchIPlayer(term);
            searchCache.set(term, results);
        }

        return results;
    },

    tvSearch : async (term : string, season : number, episode : number) : Promise<IPlayerSearchResult[]> => {
        //If we've provided an episode, find the name from sonarr
        const episodeName : string | undefined = episode ? (await sonarrService.getEpisodeTitle(term, season, episode)) : undefined;

        //If we've searched before
        let results : IPlayerSearchResult[] | undefined = searchCache.get(term);
        if (!results){
            results = await searchIPlayer(term);
            searchCache.set(term, results);
        }

        //Find the correct season and show
        results = results.filter(({title}) => {
            if (season && !title.includes(`Series ${season}`) && !title.includes(`Season ${season}`)) {
                return false;
            }
            if (episode) {
                const episodeFoundByNumber : boolean = title.includes(`Episode ${episode}`);
                const episodeFoundByName : boolean = episodeName != undefined && title.includes(episodeName);
                if (!episodeFoundByNumber && !episodeFoundByName) {
                    return false;
                }
            }
            return true;
        });

        return results;
    }
}

async function searchIPlayer(term : string) : Promise<IPlayerSearchResult[]> {
    return new Promise(async (resolve, reject) => {
        const results : IPlayerSearchResult[] = []
        const [exec, args] = await getIPlayerExec();
        const allArgs = [...args, `"${term}"`];

        loggingService.debug(`Executing get_iplayer with args: ${allArgs.join(" ")}`);
        const searchProcess = spawn(exec as string, allArgs, { shell: true });

        searchProcess.stdout.on('data', (data) => {
            loggingService.debug(data.toString().trim());
            const lines = data.toString().split("\n");
            for (const line of lines) {
                const match = episodeRegex.exec(line);
                if (match) {
                    let [_, number, title, channel, pid] = match;
                    title = title.replace(/ - -$/g, '');
                    results.push({ 
                        number : parseInt(number), title, channel, pid, request : {term, line} });
                }
            }
        });

        searchProcess.stderr.on('data', (data) => {
            loggingService.error(data.toString().trim());
        });

        searchProcess.on('close', async (code) => {
            if (code === 0) {
                for (let result of results){
                    const nzbName : string | undefined = term != "*" ? (await createNZBName(term, result.request.line || legacyCreateNZBName(result.title))) : legacyCreateNZBName(result.title);
                    result.nzbName =  nzbName;
                }
                resolve(results);
            } else {
                reject(new Error(`Process exited with code ${code}`));
            }
        });
    })
}

async function getIPlayerExec() : Promise<(string | RegExpMatchArray)[]> {
    const fullExec : string = await getParameter(IplayarrParameter.GET_IPLAYER_EXEC) as string;
    const args : RegExpMatchArray = fullExec.match(/(?:[^\s"]+|"[^"]*")+/g) as RegExpMatchArray;

    const exec : string = args.shift() as string;

    return [exec, args];
}

export default iplayerService;