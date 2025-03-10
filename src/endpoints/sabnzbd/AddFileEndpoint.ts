import { Parser } from "xml2js";
import { Request, Response } from "express";
import queueService from "../../service/queueService";
import { NZBMetaEntry } from "../../types/responses/newznab/NZBFileResponse";
import { VideoType } from "../../types/IPlayerSearchResult";
import sabzbdService from "../../service/sabnzbdService";
import axios from "axios";
import FormData from "form-data";

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
        //If we get an error, assume it's a real NZB and forward
        const validSAB = await sabzbdService.test();
        if (validSAB){
            const url = await sabzbdService.getAddFileUrl();

            const formData = new FormData();
            const { files } = req as any as AddFileRequest;
            if (files) {
                files.forEach((file) => {
                    formData.append("files", file.buffer, {
                        filename: file.originalname,
                        contentType: file.mimetype,
                    });
                });
            }

            Object.keys(req.body).forEach((key) => {
                formData.append(key, req.body[key]);
            });

            const response = await axios.post(url, formData, {
                headers: {
                    ...formData.getHeaders()
                }
            });

            res.status(response.status).send(response.data);
            return;
        }
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
                return reject(new Error("Invalid iPlayarr NZB File"));
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
