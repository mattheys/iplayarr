import { Request, Response, Router } from 'express';

import arrService from '../../service/arrService';
import configService from '../../service/configService';
import radarrService from '../../service/radarrService';
import sonarrService from '../../service/sonarrService';
import { IplayarrParameter } from '../../types/IplayarrParameters';
import { CreateDownloadClientForm } from '../../types/requests/form/CreateDownloadClientForm';
import { CreateIndexerForm } from '../../types/requests/form/CreateIndexerForm';
import { ApiError,ApiResponse } from '../../types/responses/ApiResponse';
import { DownloadClientResponse } from '../../types/responses/arr/DownloadClientResponse';
import { IndexerResponse } from '../../types/responses/arr/IndexerResponse';
import { SonarrConfigResponse } from '../../types/responses/frontend/SonarrConfigResponse';

const router = Router();

router.get('/:service', async (req : Request, res : Response) =>{
    const service : string = req.params.service;

    const [url, api_key] = await Promise.all([
        configService.getParameter(getParameter(service, 'HOST')),
        configService.getParameter(getParameter(service, 'API_KEY')),
    ]) as string[]
    const download_client : DownloadClientResponse | undefined = url ? await getService(service).getDownloadClient() : undefined;
    const indexer : IndexerResponse | undefined = url ? await getService(service).getIndexer() : undefined;
    const arrConfig : SonarrConfigResponse = {
        url,
        api_key,
        download_client : download_client || {},
        indexer : indexer || {}
    }
    res.json(arrConfig);
});

router.put('/:service', async (req : Request, res : Response) => {
    const serviceName : string = req.params.service;
    const service : any = getService(serviceName);

    const response : SonarrConfigResponse = req.body as any as SonarrConfigResponse;
    await configService.setParameter(getParameter(serviceName, 'API_KEY'), response.api_key);
    await configService.setParameter(getParameter(serviceName, 'HOST'), response.url);
    const iplayarr_api_key = await configService.getParameter(IplayarrParameter.API_KEY);
    let downloadClientId;
    try {
        const downloadClientForm : CreateDownloadClientForm = {
            name: response.download_client.name as string,
            host: response.download_client.host as string,
            port: response.download_client.port as number,
            useSSL: false,
            apiKey: iplayarr_api_key as string
        };
        downloadClientId = await service.createUpdateDownloadClient(downloadClientForm);
    } catch (err : any){
        const apiResponse : ApiResponse = {
            error : ApiError.INTERNAL_ERROR,
            message : `Unable to create ${serviceName.toUpperCase()} download client, error: ${err.message}`
        }
        res.status(500).json(apiResponse);
        return
    }
    try {
        const indexerForm : CreateIndexerForm = {
            name: response.indexer.name as string,
            downloadClientId, 
            url: response.indexer.url as string,
            apiKey: iplayarr_api_key as string,
            categories: service.categories
        }
        await service.createUpdateIndexer(indexerForm);
    } catch (err : any){
        const apiResponse : ApiResponse = {
            error : ApiError.INTERNAL_ERROR,
            message : `Unable to create ${serviceName.toUpperCase()} indexer, error: ${err.message}`
        }
        res.status(500).json(apiResponse);
        return
    }
    res.json(req.body);
});

router.delete('/:service/download_client', (req : Request, res : Response) => {
    const serviceName : string = req.params.service;

    configService.removeParameter(getParameter(serviceName, 'DOWNLOAD_CLIENT_ID'));
    res.json(true)
});

router.delete('/:service/indexer', (req : Request, res : Response) => {
    const serviceName : string = req.params.service;

    configService.removeParameter(getParameter(serviceName, 'INDEXER_ID'));
    res.json(true)
});

router.post('/test', async (req : Request, res : Response) => {
    const {API_KEY, HOST} = req.body;
    const result : string | boolean = await arrService.testConnection({API_KEY, HOST});
    if (result == true){
        res.json(true);
    } else {
        res.status(500).json({error: ApiError.INTERNAL_ERROR, message : result} as ApiResponse)
    }
});

function getParameter(service : string, suffix : string) : IplayarrParameter {
    return `${service.toUpperCase()}_${suffix}` as IplayarrParameter;
}

function getService(service : string) {
    if (service.toLowerCase() == 'radarr'){
        return radarrService;
    } else {
        return sonarrService;
    }
}

export default router;