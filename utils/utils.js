import sonarrService from "../service/sonarrService.js";

const seasonRegex = /(?:Series|Season)\s(\d+)/;
const episodeRegex = /(?:Episode|Ep)\s(\d+)/;

export function formatBytes(bytes, unit = true, decimals = 2) {
    if (bytes === 0) return "0 Bytes";

    const k  = 1024;
    const sizes = ["Bytes", "KB", "MB", "G", "TB", "PB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + (unit ? " "+sizes[i] : '');
}

export function formatTimeShort(date1, date2 = new Date()) {
    const diff = Math.abs(date2.getTime() - date1.getTime()) / 1000; // Difference in seconds

    const intervals = [
        { label: "y", seconds: 31536000 },
        { label: "mo", seconds: 2592000 },
        { label: "d", seconds: 86400 },
        { label: "h", seconds: 3600 },
        { label: "m", seconds: 60 },
        { label: "s", seconds: 1 },
    ];

    for (const interval of intervals) {
        const value = Math.floor(diff / interval.seconds);
        if (value >= 1) return `${value}${interval.label}`;
    }

    return "0s";
}

export function formatInlineDates(str) {
    return str.replace(/\b(\d{2})-(\d{2})-(\d{4})\b/g, (_, day, month, year) => `${year}-${month}-${day}`);
}

export function formatSeriesString(input) {
    return input.replace(/Series\.(\d+)\.-(?:\.\d+\.?)?\.Episode\.(\d+)/, (match, season, episode) => {
        return `S${season.padStart(2, '0')}E${episode.padStart(2, '0')}`;
    });
}
export function legacyCreateNZBName(input) {
    let filename = input.replaceAll("_", ".");
    filename = filename.replaceAll(" ", ".");
    filename = filename.replaceAll(":", "");
    filename = formatInlineDates(filename);
    filename = formatSeriesString(filename);
    return `${filename}.WEB.H264-BBC`;
}

export async function createNZBName(title, line){
        let season = false;
        let episode = false;
        const seasonMatch = seasonRegex.exec(line);
        const episodeMatch = episodeRegex.exec(line);
        if (seasonMatch){
            season = seasonMatch[1];
        }
        if (episodeMatch){
            episode = episodeMatch[1];
        } else {
            episode = await sonarrService.getEpisodeFromTitle(title, season, line);
        }
    
        if (season && episode){
            return `${title.replaceAll(" ", ".")}.S${season.toString().padStart(2, '0')}E${episode.toString().padStart(2, '0')}.WEB.H264-BBC`;
        }
}

export function getBaseUrl(req) {
    return `${req.protocol}://${req.hostname}:${req.socket.localPort}`;
  };
  