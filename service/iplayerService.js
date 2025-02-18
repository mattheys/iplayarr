import { spawn } from 'child_process';
import { getParameter } from './configService.js';
import { v4 } from 'uuid';

const downloads = {};
const finished = [];

const episodeRegex = /([0-9]+:)[^a-zA-Z]([^,]+),[^a-zA-Z]([^,]+),[^a-zA-Z]([^,]+)(?:$|\n)/;
const progressRegex = /([\d.]+)% of ~?([\d.]+ [A-Z]+) @[ ]+([\d.]+ [A-Za-z]+\/s) ETA: ([\d:]+).*$/;

const iplayerService = {
    getQueue: () => {
        return Object.values(downloads);
    },

    getComplete: () => {
        return finished;
    },

    download: (id) => {
        const filenameRegex = new RegExp(`([^,]+), ([^,]+), ${id}`);

        const uuid = v4();
        const fullExec = getParameter("GET_IPLAYER_EXEC");
        const downloadDir = getParameter("DOWNLOAD_DIR");
        const args = fullExec.match(/(?:[^\s"]+|"[^"]*")+/g);

        const exec = args.shift();
        const allArgs = [...args, '--output', downloadDir, '--log-progress', `--pid=${id}`]
        console.log(allArgs);

        const downloadProcess = spawn(exec, allArgs);

        const download = {
            id,
            progress : 0,
            size: 0,
            sizeLeft : 1000,
            speed: 0,
            eta: ""
        }

        downloads[uuid] = download;

        downloadProcess.stdout.on('data', (data) => {
            const lines = data.toString().split("\n");
            const filenameLine = lines.find((l) => filenameRegex.exec(l));
            if (filenameLine){
                const filenameMatch = filenameRegex.exec(filenameLine);
                downloads[uuid].filename = filenameMatch[1];
            }
            const progressLines = lines.filter((l) => progressRegex.exec(l));
            if (progressLines.length > 0){
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

        downloadProcess.on('close', () => {
            finished.push(downloads[uuid]);
            delete(downloads[uuid]);
        });
    },

    search: (term) => {
        return new Promise((resolve, reject) => {
            const results = [];
            const fullExec = getParameter("GET_IPLAYER_EXEC");
            const args = fullExec.match(/(?:[^\s"]+|"[^"]*")+/g);

            const exec = args.shift();
            const allArgs = [...args, term]
            console.log(allArgs);

            const searchProcess = spawn(exec, allArgs);

            searchProcess.stdout.on('data', (data) => {
                const lines = data.toString().split("\n");
                for (const line of lines){
                    const match = episodeRegex.exec(line);
                    if (match){
                        const [_, number, show, channel, id] = match;
                        results.push({number, show, channel, id});
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