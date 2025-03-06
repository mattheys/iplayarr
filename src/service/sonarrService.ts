import { FilenameTemplateContext } from "../types/FilenameTemplateContext";
import { IplayarrParameter } from "../types/IplayarrParameters";
import { CreateDownloadClientForm } from "../types/requests/form/CreateDownloadClientForm";
import { CreateIndexerForm } from "../types/requests/form/CreateIndexerForm";
import { DownloadClientResponse } from "../types/responses/arr/DownloadClientResponse";
import { IndexerResponse } from "../types/responses/arr/IndexerResponse";
import { SonarrEpisodeResponse, SonarrSeriesResponse } from "../types/responses/sonarr/SonarrSeriesResponse";
import arrService, { ArrConfig } from "./arrService";
import { getParameter } from "./configService";
import axios, { AxiosResponse } from "axios";
import Handlebars from "handlebars";

const findSeriesRegex : RegExp = /(?:Season|Series) (\d+)/
const findEpisodeRegex : RegExp = /(?:Episode) (\d+)/

const sonarrService = {
    getConfig : async () : Promise<ArrConfig> => {
        const API_KEY = await getParameter(IplayarrParameter.SONARR_API_KEY) as string;
        const HOST = await getParameter(IplayarrParameter.SONARR_HOST) as string;
        const SONARR_DOWNLOAD_CLIENT_ID = await getParameter(IplayarrParameter.SONARR_DOWNLOAD_CLIENT_ID);
        const SONARR_INDEXER_ID = await getParameter(IplayarrParameter.SONARR_INDEXER_ID);

        return {
            API_KEY,
            HOST,
            DOWNLOAD_CLIENT_ID : SONARR_DOWNLOAD_CLIENT_ID ? parseInt(SONARR_DOWNLOAD_CLIENT_ID) : undefined,
            INDEXER_ID : SONARR_INDEXER_ID ? parseInt(SONARR_INDEXER_ID) : undefined
        }
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
            const monitored = data.filter(({path} : any) => path);
            if (monitored.length > 0){
                const {id, seasons, title} = monitored[0];
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

    getDownloadClient : async() : Promise<DownloadClientResponse | undefined> => {
        const client_id = await getParameter(IplayarrParameter.SONARR_DOWNLOAD_CLIENT_ID);
        if (client_id){
            const config : ArrConfig = await sonarrService.getConfig();
            return await arrService.getDownloadClient(parseInt(client_id), config);
        } else {
            return;
        }
    },

    createUpdateDownloadClient : async (form : CreateDownloadClientForm) : Promise<number> => {
        try {
            const config : ArrConfig = await sonarrService.getConfig();
            const id = await arrService.createUpdateDownloadClient(form, config, IplayarrParameter.SONARR_DOWNLOAD_CLIENT_ID);
            return id;
        } catch (err){
            throw err;
        }
    },

    getIndexer : async() : Promise<IndexerResponse | undefined> => {
        const client_id = await getParameter(IplayarrParameter.SONARR_INDEXER_ID);
        if (client_id){
            const config : ArrConfig = await sonarrService.getConfig();
            return await arrService.getIndexer(parseInt(client_id), config);
        } else {
            return;
        }
    },

    createUpdateIndexer : async (form : CreateIndexerForm) : Promise<number> => {
        try {
            const config : ArrConfig = await sonarrService.getConfig();
            const id = await arrService.createUpdateIndexer(form, config, IplayarrParameter.SONARR_INDEXER_ID);
            return id;
        } catch (err){
            throw err;
        }
    },

    /* This method is for the search feature, it looks to find the series and episode etc from sonarr based on a line from get_iplayer */
    reverseSearch : async(term : string, result : string) : Promise<string> => {
        const {API_KEY, HOST} = await sonarrService.getConfig();
        if (API_KEY && HOST){
            //See if we can find the series, without that there's no point
            const seriesMatch : RegExpExecArray | null = findSeriesRegex.exec(result);
            if (seriesMatch){
                const seriesNumber : number = parseInt(seriesMatch[1]);

                const allSeries : SonarrSeriesResponse[] = await sonarrService.getAllSeries();
                const matchingSeries: SonarrSeriesResponse | undefined = allSeries
                    .sort((a, b) => b.title.length - a.title.length)
                    .find(({ title }) => result.toLowerCase().includes(title.toLowerCase()));
                if (matchingSeries){
                    let episodeNumber : number | undefined = undefined;
                    const episodeMatch : RegExpExecArray | null = findEpisodeRegex.exec(result);
                    if (episodeMatch) {
                        episodeNumber = parseInt(episodeMatch[1])
                    } else {
                        episodeNumber = await sonarrService.getEpisodeFromTitle(matchingSeries.title, seriesNumber, result);
                    }
                    if (episodeNumber){
                        const tvFilenameTemplate : string = (await getParameter(IplayarrParameter.TV_FILENAME_TEMPLATE)) as string;
                        const context : FilenameTemplateContext = {
                            title : matchingSeries.title.replaceAll(" ", "."),
                            season : seriesNumber.toString().padStart(2, '0'),
                            episode : episodeNumber.toString().padStart(2, '0')
                        }
                        return  Handlebars.compile(tvFilenameTemplate)(context);
                    }
                }
            }
        }
        const movieFilenameTemplate : string = (await getParameter(IplayarrParameter.MOVIE_FILENAME_TEMPLATE)) as string;
        const compiledTemplate = Handlebars.compile(movieFilenameTemplate);
        const context : FilenameTemplateContext = {
            title : term.split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join('.')
        }
        return compiledTemplate(context)
    },

    getAllSeries : async() : Promise<SonarrSeriesResponse[]> => {
        const {API_KEY, HOST} = await sonarrService.getConfig();

        const url : string = `${HOST}/api/v3/series?apikey=${API_KEY}`;
        const {data} : AxiosResponse<SonarrSeriesResponse[]> = await axios.get(url, {
            headers: {
                'X-Api-Key': API_KEY
            }
        });
        
        return data;
    } 
}

export default sonarrService;