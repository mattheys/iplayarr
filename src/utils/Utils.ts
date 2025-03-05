import sonarrService from "../service/sonarrService";
import { Request } from "express";
import * as crypto from 'crypto';
import { getParameter } from "../service/configService";
import { IplayarrParameter } from "../types/IplayarrParameters";
import Handlebars from 'handlebars';
import { FilenameTemplateContext } from "../types/FilenameTemplateContext";

const seasonRegex = /(?:Series|Season)\s(\d+)/;
const episodeRegex = /(?:Episode|Ep)\s(\d+)/;

export function formatBytes(bytes: number, unit: boolean = true, decimals: number = 2): string {
    if (bytes === 0) return "0 Bytes";

    const k: number = 1024;
    const sizes: string[] = ["Bytes", "KB", "MB", "G", "TB", "PB"];
    const i: number = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + (unit ? " " + sizes[i] : '');
}

export async function createNZBName(title: string, line: string) : Promise<string | undefined> {
    let season: number | undefined = undefined;
    let episode: number | undefined = undefined;
    const seasonMatch = seasonRegex.exec(line);
    const episodeMatch = episodeRegex.exec(line);
    if (seasonMatch) {
        season = parseInt(seasonMatch[1]);
    } else {
        return;
    }
    if (episodeMatch) {
        episode = parseInt(episodeMatch[1]);
    } else {
        episode = await sonarrService.getEpisodeFromTitle(title, season, line);
    }

    if (season && episode) {
        const tvFilenameTemplate : string = (await getParameter(IplayarrParameter.TV_FILENAME_TEMPLATE)) as string;
        const context : FilenameTemplateContext= {
            title : title.replaceAll(" ", "."),
            season : season.toString().padStart(2, '0'),
            episode : episode.toString().padStart(2, '0')
        }
        return  Handlebars.compile(tvFilenameTemplate)(context);
    }
}

export async function legacyCreateNZBName(input: string) : Promise<string> {
    const suffix = getParameter(IplayarrParameter.FALLBACK_FILENAME_SUFFIX);
    let filename = input.replaceAll("_", ".");
    filename = filename.replaceAll(" ", ".");
    filename = filename.replaceAll(":", "");
    filename = formatInlineDates(filename);
    filename = formatSeriesString(filename);
    return `${filename}.${suffix}`;
}

export function formatInlineDates(str: string) : string {
    return str.replace(/\b(\d{2})-(\d{2})-(\d{4})\b/g, (_, day, month, year) => `${year}-${month}-${day}`);
}

export function formatSeriesString(input: string) : string {
    return input.replace(/Series\.(\d+)\.-(?:\.\d+\.?)?\.Episode\.(\d+)/, (match, season, episode) => {
        return `S${season.padStart(2, '0')}E${episode.padStart(2, '0')}`;
    });
}

export function getBaseUrl(req: Request) : string {
    return `${req.protocol}://${req.hostname}:${req.socket.localPort}`;
};

export function md5(input: string): string {
    return crypto.createHash('md5').update(input).digest('hex');
}