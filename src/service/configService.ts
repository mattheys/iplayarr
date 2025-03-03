import storage from 'node-persist';
import dotenv from 'dotenv'
import { IplayarrParameter } from "../types/IplayarrParameters";

dotenv.config();

let isStorageInitialized : boolean = false;

interface ConfigMap {
    [key: string] : string
}

async function getConfigMap() : Promise<ConfigMap> {
    if (!isStorageInitialized) {
        await storage.init();
        isStorageInitialized = true;
    }
    return (await storage.getItem("config")) || {};
}

export const getParameter = async (parameter: IplayarrParameter): Promise<string | undefined> => {
    const configMap = await getConfigMap();
    return configMap[parameter.toString()] || process.env[parameter.toString()];
}

export const setParameter = async (parameter: IplayarrParameter, value : string) : Promise<void> => {
    const configMap = await getConfigMap();
    configMap[parameter] = value;
    await storage.setItem('config', configMap);
}

// Function to reset storage initialization (for tests)
export const resetConfigService = () => {
    isStorageInitialized = false;
};