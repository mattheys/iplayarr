import { getParameter } from "../service/configService.js";
import historyService from "../service/historyService.js";
import iplayerService from "../service/iplayerService.js";
import queueService from "../service/queueService.js";
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

export default async (req, res) => {
    const {name, value} = req.query;
    if (name && name == 'delete') {
        iplayerService.cancel(value);
    }
    const { available, total } = { available: 107374182400, total: 107374182400}
    const queue = queueService.getQueue();
    const downloading = queue.find(({status}) => status == 'Downloading')
    const iplayerComplete = await historyService.getHistory();
    const queueObj = {
        queue : {
            diskspace1: formatBytes(available, false),
            diskspacetotal1: formatBytes(total, false),
            diskspace1_norm: formatBytes(available, true),
            ...queue_skeleton,
            status : downloading ? 'Downloading' : "Idle",
            noofslots_total : queue.length,
            noofslots : queue.length,
            finish: iplayerComplete.length,
            slots : queue.map((slot) => ({
                "status": slot.status == 'Downloading' ? "Downloading" : "Queued",
                "index": 0,
                "password": "",
                "avg_age": "0d",
                "script": "None",
                "direct_unpack": "10/30",
                "mb": slot.details?.size || "0",
                "mbleft": slot.details?.sizeLeft || "100",
                "filename": slot.nzbName,
                "labels": [],
                "priority": "Normal",
                "cat": "iplayer",
                "timeleft": slot.details?.eta || "00:00:00",
                "percentage": slot.details?.progress || "0",
                "nzo_id": slot.pid,
                "unpackopts": "3",
            }))
        }
    }
    res.json(queueObj);
}