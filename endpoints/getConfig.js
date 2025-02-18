import { getParameter } from "../service/configService.js";

const config_skeleton = {
    "config": {
        "misc": {
            "download_dir": "/mnt/media/nzb/incomplete",
            "complete_dir": "/mnt/media/nzb/complete",
        },
        "categories": [
            {
                "name": "*",
                "order": 0,
                "pp": "3",
                "script": "None",
                "dir": "",
                "newzbin": "",
                "priority": 0
            },
            {
                "name": "iplayer",
                "order": 1,
                "pp": "",
                "script": "Default",
                "dir": "",
                "newzbin": "",
                "priority": -100
            }
        ],
        "servers": []
    }
}

export default (req, res) => {
    const config = {
        config : {
            ...config_skeleton.config,
            misc : {
                download_dir: getParameter("DOWNLOAD_DIR"),
                complete_dir: getParameter("COMPLETE_DIR")
            }
        }
    }
    config
    res.json(config);
}
