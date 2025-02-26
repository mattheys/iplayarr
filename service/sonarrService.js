import axios from "axios";
import { getParameter } from "./configService.js";

const sonarrService = {
    findSeries : async (name) => {
        const SONARR_API_KEY = getParameter("SONARR_API_KEY");
        const SONARR_HOST = getParameter("SONARR_HOST");

        if (SONARR_API_KEY && SONARR_HOST){
            const url = `${SONARR_HOST}/api/v3/series/lookup?term=${name}`;
            const {data} = await axios.get(url, {
                headers: {
                    'X-Api-Key': SONARR_API_KEY
                }
            });  
            if (data.length > 0){
                const {id, seasons, title} = data[0];
                return {id, seasons, title};
            }
        }
        return;
    },

    getEpisodeTitle : async (name, season, episode) => {
        const SONARR_API_KEY = getParameter("SONARR_API_KEY");
        const SONARR_HOST = getParameter("SONARR_HOST");

        const series = await sonarrService.findSeries(name);
        if (series){
            const url = `${SONARR_HOST}/api/v3/episode?seriesId=${series.id}&seasonNumber=${season}&episodeIds=${episode}&apikey=${SONARR_API_KEY}`;
            const {data} = await axios.get(url, {
                headers: {
                    'X-Api-Key': SONARR_API_KEY
                }
            });  

            const validEpisodes = data.filter(({episodeNumber}) => episodeNumber == episode);
            if (validEpisodes.length > 0){
                return validEpisodes[0].title;
            }
        }
        return;
    },

    getEpisodeFromTitle: async(seriesName, season, downloadLine) => {
        const SONARR_API_KEY = getParameter("SONARR_API_KEY");
        const SONARR_HOST = getParameter("SONARR_HOST");

        const series = await sonarrService.findSeries(seriesName);
        if (series){
            const url = `${SONARR_HOST}/api/v3/episode?seriesId=${series.id}&seasonNumber=${season}&apikey=${SONARR_API_KEY}`;
            const {data} = await axios.get(url, {
                headers: {
                    'X-Api-Key': SONARR_API_KEY
                }
            });  

            const found = data.filter((episode) => downloadLine.includes(episode.title));
            if (found.length > 0){
                return found[0].episodeNumber;
            }
        }
        return;
    }
}

export default sonarrService;