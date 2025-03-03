import { IplayarrParameter } from "../types/IplayarrParameters";
import { CreateDownloadClientForm } from "../types/requests/form/CreateDownloadClientForm";
import { SonarrEpisodeResponse, SonarrSeriesResponse } from "../types/responses/sonarr/SonarrSeriesResponse";
import arrService, { ArrConfig } from "./arrService";
import { getParameter } from "./configService";
import axios, { AxiosResponse } from "axios";

const sonarrService = {
    getConfig : async () : Promise<ArrConfig> => {
        const API_KEY = await getParameter(IplayarrParameter.SONARR_API_KEY) as string;
        const HOST = await getParameter(IplayarrParameter.SONARR_HOST) as string;
        const SONARR_DOWNLOAD_CLIENT_ID = await getParameter(IplayarrParameter.SONARR_DOWNLOAD_CLIENT_ID);

        return {API_KEY, HOST, DOWNLOAD_CLIENT_ID : SONARR_DOWNLOAD_CLIENT_ID ? parseInt(SONARR_DOWNLOAD_CLIENT_ID) : undefined}
    },

    findSeries : async (name : string) : Promise<SonarrSeriesResponse | undefined> => {
        const {API_KEY, HOST} = await sonarrService.getConfig();

        if (API_KEY && HOST){
            const url : string = `${HOST}/api/v3/series/lookup?term=${name}`;
            const {data} = await axios.get(url, {
                headers: {
                    'X-Api-Key': API_KEY
                }
            });  
            if (data.length > 0){
                const {id, seasons, title} = data[0];
                return {id, seasons, title};
            }
        }
        return;
    },

    getEpisodeTitle : async(name : string, season : number, episode : number) : Promise<string | undefined> => {
        const {API_KEY, HOST} = await sonarrService.getConfig();

        const series : SonarrSeriesResponse | undefined = await sonarrService.findSeries(name);
        if (series){
            const url : string = `${HOST}/api/v3/episode?seriesId=${series.id}&seasonNumber=${season}&episodeIds=${episode}&apikey=${API_KEY}`;
            const {data} : AxiosResponse<SonarrEpisodeResponse[]> = await axios.get(url, {
                headers: {
                    'X-Api-Key': API_KEY
                }
            });  

            const validEpisodes : SonarrEpisodeResponse[] = data.filter(({episodeNumber}) => episodeNumber == episode);
            if (validEpisodes.length > 0){
                return validEpisodes[0].title;
            }
        }
        return;
    },

    getEpisodeFromTitle : async(name : string, season : number, title : string) : Promise<number | undefined> => {
        const {API_KEY, HOST} = await sonarrService.getConfig();

        const series: SonarrSeriesResponse | undefined = await sonarrService.findSeries(name);
        if (series){
            const url : string = `${HOST}/api/v3/episode?seriesId=${series.id}&seasonNumber=${season}&apikey=${API_KEY}`;
            const {data} : AxiosResponse<SonarrEpisodeResponse[]> = await axios.get(url, {
                headers: {
                    'X-Api-Key': API_KEY
                }
            });  

            const found = data.filter((episode) => title.includes(episode.title));
            if (found.length > 0){
                return found[0].episodeNumber;
            }
        }
        return;
    },

    createUpdateDownloadClient : async(form : CreateDownloadClientForm) : Promise<void> => {
        const config : ArrConfig = await sonarrService.getConfig();
        await arrService.createUpdateDownloadClient(form, config, IplayarrParameter.SONARR_DOWNLOAD_CLIENT_ID);
    }
}

export default sonarrService;