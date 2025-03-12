import { Request, Response, Router } from 'express';

import episodeCacheService from '../../service/episodeCacheService';
import { EpisodeCacheDefinition } from '../../types/responses/EpisodeCacheTypes';

const router = Router();

router.get('/', async (_, res : Response) => {
    const cachedSeries : EpisodeCacheDefinition[] = await episodeCacheService.getCachedSeries();
    res.json(cachedSeries);
});

router.post('/', async (req : Request, res : Response) => {
    const {name, url} = req.body;
    await episodeCacheService.addCachedSeries(url, name);
    const cachedSeries : EpisodeCacheDefinition[] = await episodeCacheService.getCachedSeries();
    res.json(cachedSeries);
});

router.delete('/', async (req : Request, res : Response) => {
    const {id} = req.body;
    await episodeCacheService.removeCachedSeries(id);
    const cachedSeries : EpisodeCacheDefinition[] = await episodeCacheService.getCachedSeries();
    res.json(cachedSeries);
});

router.post('/refresh', async (req : Request, res : Response) => {
    const def : EpisodeCacheDefinition = req.body;
    episodeCacheService.recacheSeries(def);
    res.json({status : true});
});

export default router;