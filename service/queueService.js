import { getParameter } from "./configService.js";
import iplayerService from "./iplayerService.js";
import { spawn } from 'child_process';
import socketService from "./socketService.js";


let queue = [];

const activeLimit = getParameter("ACTIVE_LIMIT") || 3;

const DOWNLOADING = "Downloading";
const IDLE = "Idle";

const queueService = {
    addToQueue: (pid, nzbName) => {
        const queueEntry = {
            pid,
            status: IDLE,
            process: null,
            details: {},
            nzbName
        }
        queue.push(queueEntry);
        queueService.moveQueue();
    },

    moveQueue: async () => {
        let activeQueue = queue.filter(({ status }) => status == DOWNLOADING);
        let idleQueue = queue.filter(({status}) => status == IDLE);
        while(activeQueue.length < activeLimit && idleQueue.length > 0){
            const next = idleQueue.shift();

            const downloadProcess = await iplayerService.download(next.pid);
            next.status = DOWNLOADING;
            next.process = downloadProcess;

            activeQueue.push(next);

            queue = [...activeQueue, ...idleQueue];
            activeQueue = queue.filter(({ status }) => status == DOWNLOADING);
            idleQueue = queue.filter(({status}) => status == IDLE);
        }
        socketService.emit('queue', queue);
    },

    updateQueue: (pid, details) => {
        const index = queue.findIndex(({pid: id}) => id == pid);
        if (index > -1){
            queue[index].details = details;
        }
        socketService.emit('queue', queue);
    },

    removeFromQueue: (pid) => {
        queue = queue.filter(({pid: id}) => id != pid);
        queueService.moveQueue();
    },

    cancelItem: (pid) => {
        for (const queueItem of queue){
            if (queueItem.process && queueItem.pid == pid){
                spawn('kill', ['-9', queueItem.process.pid]);
            }
        }
        queueService.removeFromQueue(pid);
    },

    getQueue: () => {
        return queue;
    }
}

export default queueService;