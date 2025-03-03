import arrService, { ArrConfig } from "./service/arrService";
import { IplayarrParameter } from "./types/IplayarrParameters";
import { CreateDownloadClientForm } from "./types/requests/form/CreateDownloadClientForm";


const form : CreateDownloadClientForm = {
    name: "iplayarr",
    host: "192.168.1.19",
    port: 4404,
    useSSL: false,
    apiKey: "1234"
}

const config : ArrConfig = {
    API_KEY: "9a76802452c34594a97947f40c55ad55",
    HOST: "http://192.168.1.19:7878",
    DOWNLOAD_CLIENT_ID: undefined
}
arrService.createUpdateDownloadClient(form, config, IplayarrParameter.RADARR_DOWNLOAD_CLIENT_ID);