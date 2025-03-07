import { Parser } from "xml2js";
import { Request, Response } from "express";
import queueService from "../../service/queueService";
import { NZBMetaEntry } from "../../types/responses/newznab/NZBFileResponse";
import { VideoType } from "../../types/IPlayerSearchResult";

const parser = new Parser();

interface AddFileRequest {
    files : Express.Multer.File[]
}

interface NZBDetails {
    pid : string,
    nzbName : string,
    type : VideoType
}

export default async (req : Request, res : Response) => {
    try {
        const { files } = req as any as AddFileRequest;
        const pids : string[] = [];
        for (const file of files){
            const xmlString = file.buffer.toString('utf-8');
            const {pid, nzbName, type} = await getDetails(xmlString);
            queueService.addToQueue(pid, nzbName, type);
            pids.push(pid);
        }

        res.status(200).json({
            status: true,
            nzo_ids: pids
        });
    } catch (error : any) {
        res.status(500).json({
            status: false,
            error: error.message
        });
    }
}

async function getDetails(xml : string) : Promise<NZBDetails> {
    return new Promise((resolve, reject) => {
        parser.parseString(xml, (err, result) => {
            if (err) {
                return reject(err);
            } else if (!result?.nzb?.head?.[0]?.title?.[0]){
                return reject(new Error("Invalid iPlayarr NZB File");
	    }
            const nzbName : NZBMetaEntry = result.nzb.head[0].meta.find(({$} : any) => $.type === 'nzbName');
            const type : NZBMetaEntry = result.nzb.head[0].meta.find(({$} : any) => $.type === 'type');
            const details : NZBDetails = {
                "pid" : result.nzb.head[0].title[0],
                "nzbName" : nzbName?.$?._,
                "type" : (type?.$?._) as VideoType
            }
            resolve(details);
        });
    });
}
