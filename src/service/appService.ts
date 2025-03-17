import storage from 'node-persist';
import { v4 } from 'uuid';

import { App } from '../types/App';
import { appCategories, AppFeature, appFeatures } from '../types/AppType';
import { IplayarrParameter } from '../types/IplayarrParameters';
import { CreateDownloadClientForm } from '../types/requests/form/CreateDownloadClientForm';
import { CreateIndexerForm } from '../types/requests/form/CreateIndexerForm';
import arrService, { ArrConfig } from './arrService';
import configService from './configService';

let isStorageInitialized : boolean = false;

const storageOptions : any = {};
if (process.env.STORAGE_LOCATION){
    storageOptions.dir = process.env.STORAGE_LOCATION;
}

const appService = {
    initStorage : async () : Promise<void> => {
        if (!isStorageInitialized) {
            await storage.init(storageOptions);
            isStorageInitialized = true;
        }
    },
    
    getAllApps : async () : Promise<App[]> => {
        await appService.initStorage();
        return (await storage.getItem('apps')) || [];
    },

    getApp : async (id : string) : Promise<App | undefined> => {
        const allApps : App[] = await appService.getAllApps();
        return allApps.find(({id : app_id}) => app_id == id);
    },

    removeApp : async (id : string) : Promise<boolean> => {
        let allApps : App[] = await appService.getAllApps();
        allApps = allApps.filter(({id : app_id}) => app_id != id);
        await storage.setItem('apps', allApps);
        return true;
    },

    updateApp : async (form : Partial<App>) : Promise<App | undefined> => {
        if (form.id){
            let app : App | undefined = await appService.getApp(form.id);
            if (app){
                app = {
                    ...app,
                    ...form
                }
                await appService.removeApp(form.id);
                await appService.addApp(app);
                return app;
            }
        }
        return;
    },

    addApp : async (form : App) : Promise<App | undefined> => {
        const id = v4();
        form.id = id;
        const allApps : App[] = await appService.getAllApps();
        allApps.push(form);
        await storage.setItem('apps', allApps);
        return form;
    },

    createUpdateIntegrations : async (input : App) : Promise<App> => {
        let form = input;
        const features : AppFeature[] = appFeatures[form.type];

        const arrConfig : ArrConfig = {
            HOST : form.url,
            API_KEY : form.api_key,
            DOWNLOAD_CLIENT_ID : form.download_client?.id || undefined,
            INDEXER_ID : form.indexer?.id || undefined
        }

        for (const feature of features){
            try {
                form = await createUpdateFeature[feature](form, arrConfig);
            } catch (err){
                throw err;
            }
        }

        await appService.updateApp(form);
        return form;
    }
}

const createUpdateFeature : Record<AppFeature, (form : App, arrConfig : ArrConfig) => Promise<App>> = {
    [AppFeature.DOWNLOAD_CLIENT]: async (form: App, arrConfig: ArrConfig): Promise<App> => {
        const API_KEY: string = await configService.getParameter(IplayarrParameter.API_KEY) as string;

        if (form.download_client?.name) {
            const createDownloadClientForm: CreateDownloadClientForm = {
                name: form.download_client.name,
                host: form.iplayarr.host as string,
                port: form.iplayarr.port as number,
                useSSL: form.iplayarr.useSSL,
                apiKey: API_KEY,
            };


            try {
                const id = await arrService.createUpdateDownloadClient(createDownloadClientForm, arrConfig);
                form.download_client.id = id;
            } catch (err: any) {
                throw {
                    message: err.message,
                    type: 'download_client', // Add the type
                };
            }
        }
        return form;
    },
    [AppFeature.INDEXER]: async (form: App, arrConfig: ArrConfig): Promise<App> => {
        const API_KEY: string = await configService.getParameter(IplayarrParameter.API_KEY) as string;

        if (form.download_client?.id && form.indexer?.name) {
            const createIndexerForm: CreateIndexerForm = {
                name: form.indexer.name,
                downloadClientId: form.download_client.id,
                url: `http${form.iplayarr.useSSL ? 's' : ''}://${form.iplayarr.host}:${form.iplayarr.port}`,
                apiKey: API_KEY,
                categories: appCategories[form.type],
                priority: form.indexer.priority
            };

            try {
                const id = await arrService.createUpdateIndexer(createIndexerForm, arrConfig);
                form.indexer.id = id;
            } catch (err: any) {
                throw {
                    message: err.message,
                    type: 'indexer', // Add the type
                };
            }
        }
        return form;
    },
    [AppFeature.PROWLARR_DOWNLOAD_CLIENT]: async (form: App, arrConfig: ArrConfig): Promise<App> => {
        const API_KEY: string = await configService.getParameter(IplayarrParameter.API_KEY) as string;

        if (form.download_client?.name) {
            const createDownloadClientForm: CreateDownloadClientForm = {
                name: form.download_client.name,
                host: form.iplayarr.host as string,
                port: form.iplayarr.port as number,
                useSSL: form.iplayarr.useSSL,
                apiKey: API_KEY,
            };


            try {
                const id = await arrService.createUpdateDownloadClient(createDownloadClientForm, arrConfig, true);
                form.download_client.id = id;
            } catch (err: any) {
                throw {
                    message: err.message,
                    type: 'download_client', // Add the type
                };
            }
        }
        return form;
    },
    [AppFeature.PROWLARR_INDEXER]: async (form: App, arrConfig: ArrConfig): Promise<App> => {
        const API_KEY: string = await configService.getParameter(IplayarrParameter.API_KEY) as string;

        if (form.download_client?.id && form.indexer?.name) {
            const createIndexerForm: CreateIndexerForm = {
                name: form.indexer.name,
                downloadClientId: form.download_client.id,
                url: `http${form.iplayarr.useSSL ? 's' : ''}://${form.iplayarr.host}:${form.iplayarr.port}`,
                apiKey: API_KEY,
                categories: appCategories[form.type],
                priority: form.indexer.priority
            };

            try {
                const id = await arrService.createUpdateProwlarrIndexer(createIndexerForm, arrConfig);
                form.indexer.id = id;
            } catch (err: any) {
                throw {
                    message: err.message,
                    type: 'indexer', // Add the type
                };
            }
        }
        return form;
    }
}

export default appService;