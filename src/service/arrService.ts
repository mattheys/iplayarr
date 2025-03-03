import axios, { AxiosInstance } from "axios";
import { IplayarrParameter } from "../types/IplayarrParameters";
import { CreateDownloadClientForm } from "../types/requests/form/CreateDownloadClientForm";
import { ArrCreateDownloadClientRequest, createDownloadClientRequestSkeleton, CreateDownloadClientRequestField } from "../types/requests/sonarr/CreateDownloadClientRequest";
import { setParameter } from "./configService";

export interface ArrConfig {
    API_KEY : string,
    HOST : string,
    DOWNLOAD_CLIENT_ID : number | undefined
}

const arrService = {
    createUpdateDownloadClient : async(form : CreateDownloadClientForm, config : ArrConfig, download_id_key : IplayarrParameter) : Promise<void> => {
        const {API_KEY, HOST, DOWNLOAD_CLIENT_ID} = config;
        let updateMethod : keyof AxiosInstance = 'post';

        const createDownloadClientRequest : ArrCreateDownloadClientRequest = {
            ...createDownloadClientRequestSkeleton,
            name : form.name,
            fields : [
                ...createDownloadClientRequestSkeleton.fields as CreateDownloadClientRequestField[],
                {
                    "order": 0,
                    "name": "host",
                    "label": "Host",
                    "value": form.host,
                    "type": "textbox",
                    "advanced": false,
                    "privacy": "normal",
                    "isFloat": false
                },
                {
                    "order": 1,
                    "name": "port",
                    "label": "Port",
                    "value": form.port,
                    "type": "textbox",
                    "advanced": false,
                    "privacy": "normal",
                    "isFloat": false
                },
                {
                    "order": 2,
                    "name": "useSsl",
                    "label": "Use SSL",
                    "helpText": "Use secure connection when connection to Sabnzbd",
                    "value": form.useSSL,
                    "type": "checkbox",
                    "advanced": false,
                    "privacy": "normal",
                    "isFloat": false
                },
                {
                    "order": 4,
                    "name": "apiKey",
                    "label": "API Key",
                    "value": form.apiKey,
                    "type": "textbox",
                    "advanced": false,
                    "privacy": "apiKey",
                    "isFloat": false
                }
            ]
        } as ArrCreateDownloadClientRequest

        if (form.urlBase){
            createDownloadClientRequest.fields.push({
                "order": 3,
                "name": "urlBase",
                "label": "URL Base",
                "helpText": "Adds a prefix to the Sabnzbd url, such as http://[host]:[port]/[urlBase]/api",
                "type": "textbox",
                "advanced": true,
                "privacy": "normal",
                "isFloat": false,
                "value" : form.urlBase
            })
        }

        //Find an existing one
        if (DOWNLOAD_CLIENT_ID){
            const stillExists = await arrService.downloadClientExists(DOWNLOAD_CLIENT_ID, config);
            if (stillExists){
                updateMethod = 'put',
                createDownloadClientRequest.id = DOWNLOAD_CLIENT_ID
            }
        }

        const url : string = `${HOST}/api/v3/downloadclient?apikey=${API_KEY}`;
        const {data : {id}} = await axios[updateMethod](url, createDownloadClientRequest, {
            headers: {
                'X-Api-Key': API_KEY
            }
        });

        setParameter(download_id_key, id);
    },
    
    downloadClientExists : async(id : number,  config : ArrConfig) : Promise<boolean> => {
        const {API_KEY, HOST} = config;
        const url : string = `${HOST}/api/v3/downloadclient/${id}?apikey=${API_KEY}`;

        try {
            const response = await axios.get(url, {
                headers: {
                    'X-Api-Key': API_KEY
                }
            });
            return response.status === 200;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return false;
            }
            throw error; // Re-throw other errors
        }
    }
}

export default arrService;