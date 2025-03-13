import { Request, Response, Router } from 'express';

import synonymService from '../../service/synonymService';
import { Synonym } from '../../types/Synonym';

const router = Router();

router.get('/', async (_, res : Response) => {
    const synonyms = await synonymService.getAllSynonyms();
    res.json(synonyms);
});

router.post('/', async (req : Request, res : Response) => {
    const synonym : Synonym = req.body as any as Synonym;
    await synonymService.addSynonym(synonym);
    const synonyms = await synonymService.getAllSynonyms();
    res.json(synonyms);
});

router.put('/', async (req : Request, res : Response) => {
    const synonym : Synonym = req.body as any as Synonym;
    await synonymService.updateSynonym(synonym);
    const synonyms = await synonymService.getAllSynonyms();
    res.json(synonyms);
});

router.delete('/', async (req : Request, res : Response) => {
    const {id} = req.body;
    await synonymService.removeSynonym(id);
    const synonyms = await synonymService.getAllSynonyms();
    res.json(synonyms);
});

export default router;