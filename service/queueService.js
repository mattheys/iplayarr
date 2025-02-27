import { getParameter } from "./configService.js";
import iplayerService from "./iplayerService.js";

const queue = [];

const activeLimit = getParameter("ACTIVE_LIMIT") || 3;

const DOWNLOADING = "Downloading";
const IDLE = "Idle";

const queueService = {
    addToQueue: (pid) => {
        const queueEntry = {
            pid,
            status: IDLE,
            process: null,
            details: {}
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

            queue.push(next);

            activeQueue = queue.filter(({ status }) => status == DOWNLOADING);
            idleQueue = queue.filter(({status}) => status == IDLE);
        }
    },

    updateQueue: (pid, details) => {
        const index = queue.findIndex(({pid: id}) => id == pid);
        if (index > -1){
            queue[index].details = details;
        }
    },

    removeFromQueue: (pid) => {
        const index = queue.findIndex(({pid: id}) => id == pid);
        if (index > -1){
            queue.splice(index, 1);
            queueService.moveQueue();
        }
    }
}

export default queueService;