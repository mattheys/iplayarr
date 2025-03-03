import { RequestHandler } from "express"
import QueueEndpoint from "./sabnzbd/QueueEndpoint"
import ConfigEndpoint from "./sabnzbd/ConfigEndpoint"
import HistoryEndpoint from "./sabnzbd/HistoryEndpoint"
import CapsEndpoint from "./newznab/CapsEndpoint"
import TvSearchEndpoint from "./newznab/TvSearchEndpoint"
import AddFileEndpoint from "./newznab/AddFileEndpoint"
import DownloadNZBEndpoint from "./newznab/DownloadNZBEndpoint"
import VersionEndpoint from "./sabnzbd/VersionEndpoint"

export interface EndpointDirectory {
    [key : string] : RequestHandler
}

export const SabNZBDEndpointDirectory : EndpointDirectory = {
    queue : QueueEndpoint,
    get_config : ConfigEndpoint,
    history : HistoryEndpoint,
    version : VersionEndpoint
}

export const NewzNabEndpointDirectory : EndpointDirectory = {
    caps : CapsEndpoint,
    tvsearch : TvSearchEndpoint,
    "nzb-download" : DownloadNZBEndpoint,
    addFile : AddFileEndpoint
}