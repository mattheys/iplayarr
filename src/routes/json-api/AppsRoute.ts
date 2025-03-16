import { Request, Response,Router } from 'express';

import appService from '../../service/appService';
import { App } from '../../types/App';
import { appFeatures } from '../../types/AppType';
import { ApiError, ApiResponse } from '../../types/responses/ApiResponse';
import { AppFormValidator } from '../../validators/AppFormValidator';

const router = Router();

router.get('/', async (_, res : Response) => {
    const allApps : App[] = await appService.getAllApps();
    res.json(allApps);
});

router.post('/', async (req : Request, res : Response) => {
    const appFormValidator : AppFormValidator = new AppFormValidator();
    const form : App = req.body as any as App;
    const validationResult = await appFormValidator.validate(form);
    if (Object.keys(validationResult).length == 0){
        await appService.addApp(form);
        res.json(form);
    } else {
        const apiResponse : ApiResponse = {
            error : ApiError.INVALID_INPUT,
            invalid_fields : validationResult
        }
        res.status(400).json(apiResponse);
        return;
    }
});

router.delete('/', async (req : Request, res : Response) => {
    const {id} = req.body;
    await appService.removeApp(id);
    res.json(true);
});

router.get('/types', async (_, res :Response) => {
    res.json(appFeatures);
});

export default router;