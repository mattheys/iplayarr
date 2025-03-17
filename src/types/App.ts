import { AppType } from './AppType';

export interface App {
    id : string
    type : AppType,
    name : string,
    url : string,
    api_key : string,
    iplayarr : {
        host : string,
        port : number,
        useSSL : boolean
    }
    download_client? : {
        id: number,
        name?: string,
        host?: string,
        api_key?: string,
        port?: number
    },
    indexer? : {
        id : number,
        name?: string,
        url?: string,
        api_key?: string,
        priority : number
    }
}