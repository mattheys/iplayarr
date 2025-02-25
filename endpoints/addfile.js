import { Parser } from "xml2js";
import iplayerService from "../service/iplayerService.js";

const parser = new Parser();

export default async (req, res) => {
    try {
        const { files } = req;
        const pids = [];
        for (const file of files){
            const xmlString = file.buffer.toString('utf-8');
            const pid = await getPID(xmlString);
            await iplayerService.download(pid);
            pids.push(pid);
        }

        res.status(200).json({
            status: true,
            nzo_ids: pids
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message
        });
    }
}

async function getPID(xml) {
    return new Promise((resolve, reject) => {
        parser.parseString(xml, (err, result) => {
            if (err || !result?.nzb?.head?.[0]?.title?.[0]) {
                return reject(err);
            }
            resolve(result.nzb.head[0].title[0]);
        });
    });
}