import { IplayarrParameter } from "../types/IplayarrParameters";
import { CreateDownloadClientForm } from "../types/requests/form/CreateDownloadClientForm";
import arrService, { ArrConfig } from "./arrService";
import { getParameter } from "./configService";

const radarrService = {
    getConfig: async (): Promise<ArrConfig> => {
        const API_KEY = await getParameter(IplayarrParameter.RADARR_API_KEY) as string;
        const HOST = await getParameter(IplayarrParameter.RADARR_HOST) as string;
        const RADARR_DOWNLOAD_CLIENT_ID = await getParameter(IplayarrParameter.RADARR_DOWNLOAD_CLIENT_ID);

        return { API_KEY, HOST, DOWNLOAD_CLIENT_ID: RADARR_DOWNLOAD_CLIENT_ID ? parseInt(RADARR_DOWNLOAD_CLIENT_ID) : undefined }
    },

    createUpdateDownloadClient: async (form: CreateDownloadClientForm): Promise<void> => {
        const config: ArrConfig = await radarrService.getConfig();
        await arrService.createUpdateDownloadClient(form, config, IplayarrParameter.RADARR_DOWNLOAD_CLIENT_ID);
    }
}

export default radarrService;