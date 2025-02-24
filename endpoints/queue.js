import { getParameter } from "../service/configService.js";
import historyService from "../service/historyService.js";
import iplayerService from "../service/iplayerService.js";
import { formatBytes, formatTimeShort } from "../utils/utils.js";

const queue_skeleton = {
    "speedlimit": "9",
    "speedlimit_abs": "4718592.0",
    "paused": false,
    "limit": 10,
    "start": 0,
    "have_warnings": "0",
    "pause_int": "0",
    "left_quota": "0 ",
    "version": "3.x.x",
    "cache_art": "16",
    "cache_size": "6 MB",
    "finishaction": null,
    "paused_all": false,
    "quota": "0 ",
    "have_quota": false,
}

export default async (_, res) => {
    const downloadDir = getParameter("DOWNLOAD_DIR");
    const { available, total } = { available: 107374182400, total: 107374182400}
    const iplayerQueue = iplayerService.getQueue();
    const iplayerComplete = await historyService.getHistory();
    const queueObj = {
        queue : {
            diskspace1: formatBytes(available, false),
            diskspacetotal1: formatBytes(total, false),
            diskspace1_norm: formatBytes(available, true),
            ...queue_skeleton,
            status : iplayerQueue.length > 0 ? 'Downloading' : "Idle",
            noofslots_total : iplayerQueue.length,
            noofslots : iplayerQueue.length,
            finish: iplayerComplete.length,
            slots : iplayerQueue.map((slot) => ({
                "status": "Downloading",
                "index": 0,
                "password": "",
                "avg_age": "0d",
                "script": "None",
                "direct_unpack": "10/30",
                "mb": slot.size,
                "mbleft": slot.sizeLeft,
                "filename": slot.filename,
                "labels": [],
                "priority": "Normal",
                "cat": "iplayer",
                "timeleft": slot.eta,
                "percentage": "0",
                "nzo_id": slot.id,
                "unpackopts": "3",
            }))
        }
    }
    res.json(queueObj);
}