import { spawn } from 'child_process';
import { getParameter } from './configService.js';
import { v4 } from 'uuid';
import fs from 'fs';
import { formatInlineDates, formatSeriesString } from '../utils/utils.js';
import path from 'path';
import historyService from './historyService.js';

const downloads = {};

const episodeRegex = /([0-9]+:)[^a-zA-Z]([^,]+),[^a-zA-Z]([^,]+),[^a-zA-Z]([^,]+)(?:$|\n)/;
const progressRegex = /([\d.]+)% of ~?([\d.]+ [A-Z]+) @[ ]+([\d.]+ [A-Za-z]+\/s) ETA: ([\d:]+).*$/;
const filenameRegex = /INFO: Downloading (?:[a-z]+): '([^']+) \(([0-9a-z]+)\) \[[a-z]+\]'/;

const iplayerService = {
    getQueue: () => {
        return Object.values(downloads);
    },

    download: async (id) => {
        const uuid = v4();
        const fullExec = getParameter("GET_IPLAYER_EXEC");
        const downloadDir = getParameter("DOWNLOAD_DIR");
        const completeDir = getParameter("COMPLETE_DIR");
        const args = fullExec.match(/(?:[^\s"]+|"[^"]*")+/g);

        const exec = args.shift();
        const allArgs = [...args, '--output', `${downloadDir}/${uuid}`, '--overwrite', '--log-progress', `--pid=${id}`]
        console.log(allArgs);

        const downloadProcess = spawn(exec, allArgs);

        const download = {
            id,
            progress: 0,
            size: 0,
            sizeLeft: 1000,
            speed: 0,
            eta: "",
            start: new Date()
        }

        downloads[uuid] = download;

        downloadProcess.stdout.on('data', (data) => {
            console.log(data.toString());
            const lines = data.toString().split("\n");
            const filenameLine = lines.find((l) => filenameRegex.exec(l));
            if (filenameLine) {
                const filenameMatch = filenameRegex.exec(filenameLine);
                let filename = `${filenameMatch[1].replaceAll(" ", "_").replaceAll("/", "-")}_${filenameMatch[2]}_original.mp4`;
                filename = formatInlineDates(filename);
                filename = formatSeriesString(filename);
                downloads[uuid].filename = filename;
            }
            const progressLines = lines.filter((l) => progressRegex.exec(l));
            if (progressLines.length > 0) {
                const progressLine = progressLines.pop();
                const match = progressRegex.exec(progressLine);
                const [_, progress, size, speed, eta] = match;
                downloads[uuid].progress = parseFloat(progress);
                downloads[uuid].size = parseFloat(size);
                downloads[uuid].speed = parseFloat(speed);
                downloads[uuid].eta = eta;

                const percentFactor = (100 - parseFloat(progress)) / 100;
                const sizeLeft = downloads[uuid].size * percentFactor;
                downloads[uuid].sizeLeft = sizeLeft;
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
            delete (downloads[uuid]);
        });
    },

    search: (term) => {
        return new Promise((resolve, reject) => {
            const results = [];
            const fullExec = getParameter("GET_IPLAYER_EXEC");
            const args = fullExec.match(/(?:[^\s"]+|"[^"]*")+/g);

            const exec = args.shift();
            const allArgs = [...args, `"${term}"`]
            console.log(allArgs);

            const searchProcess = spawn(exec, allArgs, { shell: true });

            searchProcess.stdout.on('data', (data) => {
                const lines = data.toString().split("\n");
                for (const line of lines) {
                    const match = episodeRegex.exec(line);
                    if (match) {
                        const [_, number, show, channel, id] = match;
                        results.push({ number, show, channel, id });
                    }
                }
            });

            searchProcess.stderr.on('data', (data) => {
                console.log(data.toString().trim());
            });

            searchProcess.on('close', (code) => {
                //console.log(stdout);
                if (code === 0) {
                    resolve(results);
                } else {
                    reject(new Error(`Process exited with code ${code}`));
                }
            });
        });

    }
}

export default iplayerService;