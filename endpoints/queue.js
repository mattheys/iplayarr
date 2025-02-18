import iplayerService from "../service/iplayerService.js";

const queue_skeleton = {
    // "status": "Downloading",
    "speedlimit": "9",
    "speedlimit_abs": "4718592.0",
    "paused": false,
    // "noofslots_total": 1,
    // "noofslots": 1,
    "limit": 10,
    "start": 0,
    "slots": [
        {
            "status": "Downloading",
            "index": 0,
            "password": "",
            "avg_age": "2895d",
            "script": "None",
            "direct_unpack": "10/30",
            "mb": "1277.65",
            "mbleft": "1271.59",
            "mbmissing": "0.0",
            "size": "1.2 GB",
            "sizeleft": "1.2 GB",
            "filename": "TV.Show.S04E11.720p.HDTV.x264",
            "labels": [],
            "priority": "Normal",
            "cat": "iplayer",
            "timeleft": "0:16:44",
            "percentage": "0",
            "nzo_id": "SABnzbd_nzo_p86tgx",
            "unpackopts": "3"
        }
    ],
    "diskspace1": "161.16",
    "diskspace2": "161.16",
    "diskspacetotal1": "465.21",
    "diskspacetotal2": "465.21",
    "diskspace1_norm": "161.2 G",
    "diskspace2_norm": "161.2 G",
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
    const iplayerQueue = iplayerService.getQueue();
    const iplayerComplete = iplayerService.getComplete();
    const queueObj = {
        queue : {
            ...queue_skeleton,
            status : iplayerQueue.length > 0 ? 'Downloading' : "Idle",
            noofslots_total : iplayerQueue.length,
            noofslots : iplayerQueue.length,
            finish: iplayerComplete.length,
            slots : iplayerQueue.map((slot) => ({
                "status": "Downloading",
                "index": 0,
                "password": "",
                "avg_age": "2895d",
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