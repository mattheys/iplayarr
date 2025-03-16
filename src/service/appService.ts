import storage from 'node-persist';
import { v4 } from 'uuid';

import { App } from '../types/App';

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

    updateApp : async (form : Partial<App>) : Promise<boolean> => {
        if (form.id){
            let app : App | undefined = await appService.getApp(form.id);
            if (app){
                app = {
                    ...app,
                    ...form
                }
                await appService.removeApp(form.id);
                await appService.addApp(app);
                return true;
            }
        }
        return false;
    },

    addApp : async (form : App) : Promise<boolean> => {
        const id = v4();
        form.id = id;
        const allApps : App[] = await appService.getAllApps();
        allApps.push(form);
        await storage.setItem('apps', allApps);
        return true;
    }
}

export default appService;