import { Request, Response } from 'express';

import queueService from '../../service/queueService';
import { VideoType } from '../../types/IPlayerSearchResult';

export default async (req : Request, res : Response) => {
    const {pid, name, type} = req.query as any;

    queueService.addToQueue(pid, name, type as VideoType);

    res.json(true);
}