import axios from "axios";
import { getParameter } from "./configService";
import { IplayarrParameter } from "../types/IplayarrParameters";

const sabzbdService = {
    test : async () : Promise<boolean> => {
        const SABNZBD_URL = await getParameter(IplayarrParameter.SABNZBD_URL);
        const SABNSBD_API_KEY = await getParameter(IplayarrParameter.SABNZBD_API_KEY);
        if (SABNZBD_URL && SABNSBD_API_KEY){
            const result = await sabzbdService.testConnection(SABNZBD_URL, SABNSBD_API_KEY);
            if (result == true) {
                return true;
            }
        } 
        return false;
    },

    getAddFileUrl : async () : Promise<string> => {
        const SABNZBD_URL = await getParameter(IplayarrParameter.SABNZBD_URL) as string;
        const SABNSBD_API_KEY = await getParameter(IplayarrParameter.SABNZBD_API_KEY) as string;

        return `${SABNZBD_URL}/api?mode=addfile&apikey=${SABNSBD_API_KEY}`;
    },

    testConnection : async(sabnzbdUrl : string, apikey : string) : Promise<string | boolean> => {
        const url : string = `${sabnzbdUrl}/api?mode=queue&apikey=${apikey}`;

        try {
            const response = await axios.get(url);
            if (response.status == 200) return true;
            return false;
        } catch (error) {
            if (axios.isAxiosError(error)){
                return error.message;
            }
            return false;
        }
    }
}

export default sabzbdService;