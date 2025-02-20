import { getParameter } from "./configService.js";
import axios from "axios";

const sonarrService = {
    getMissing : async () => {
        let missing = []
        const seriesList = {};
        const sonarrUrl = getParameter("SONARR_URL");
        const sonarrApiKey = getParameter("SONARR_API_KEY");
        const url =`${sonarrUrl}/api/v3/wanted/missing?includeImages=false&monitored=true&apikey=${sonarrApiKey}`;

        const {data : {totalRecords}} = await axios.get(url);
        const pages = Math.ceil(totalRecords / 10);
        for (let page = 1; page <= pages; page++){
            let results = await getMissingPage(page);
            for (let {seriesId, seasonNumber, episodeNumber, title} of results){
                missing.push({
                    series : await getSeries(seriesList, seriesId),
                    seasonNumber,
                    episodeNumber,
                    title
                })
            }
        }
        return missing;
    }
}

async function getSeries(seriesList, seriesId) {
    if (Object.hasOwn(seriesList, seriesId)){
        return seriesList[seriesId];
    }
    const sonarrUrl = getParameter("SONARR_URL");
    const sonarrApiKey = getParameter("SONARR_API_KEY");
    const url =`${sonarrUrl}/api/v3/series/${seriesId}?apikey=${sonarrApiKey}`;

    const {data : {title}} = await axios.get(url);
    seriesList[seriesId] = title;
    return title;
}

async function getMissingPage(pageNo) {
    const sonarrUrl = getParameter("SONARR_URL");
    const sonarrApiKey = getParameter("SONARR_API_KEY");
    const url =`${sonarrUrl}/api/v3/wanted/missing?includeImages=false&monitored=true&apikey=${sonarrApiKey}&page=${pageNo}`;

    const {data : {records}} = await axios.get(url);

    return records;
}

export default sonarrService;