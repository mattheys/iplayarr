import { getParameter } from "../service/configService.js";
import iplayerService from "../service/iplayerService.js";
import { formatBytes } from "../utils/utils.js";
import historyService from "../service/historyService.js";

const history_skeleton = {
    "noofslots": 220,
    "ppslots": 1,
    "day_size": "1.9 G",
    "week_size": "30.4 G",
    "month_size": "167.3 G",
    "total_size": "678.1 G",
    "last_history_update": 1469210913,
}

export default async (req, res) => {
    const {name, value} = req.query;
    if (name && name == 'delete') {
        historyService.removeHistory(value);
        res.json({status:true});
        return
    }
    const iplayerComplete = await historyService.getHistory();
    const completeDir = getParameter("COMPLETE_DIR")


    const history = {
        history: {
            ...history_skeleton,
            slots : iplayerComplete.map((complete) => ({
                "action_line": "",
                "duplicate_key": complete.id,
                "meta": null,
                "fail_message": "",
                "loaded": false,
                "size": formatBytes(complete.size),
                "category": "iplayer",
                "pp": "D",
                "retry": 0,
                "script": "None",
                "nzb_name": `${complete.filename}.nzb`,
                "download_time": 64,
                "storage": `${completeDir}/${complete.filename}`,
                "has_rating": false,
                "status": "Completed",
                "script_line": "",
                "completed": complete.size,
                "nzo_id": complete.id,
                "downloaded": complete.size,
                "report": "",
                "password": "",
                "path": `${completeDir}/${complete.filename}`,
                "postproc_time": 40,
                "name": complete.filename,
                "url": `${complete.filename}.nzb`,
                "md5sum": "d2c16aeecbc1b1921d04422850e93013",
                "archive": false,
                "bytes": complete.size,
                "url_info": "",
                "stage_log": []
            }
        ))
        }
    }
    res.json(history);
}
