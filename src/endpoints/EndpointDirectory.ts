import { RequestHandler } from "express"
import QueueEndpoint from "./sabnzbd/QueueEndpoint"
import ConfigEndpoint from "./sabnzbd/ConfigEndpoint"
import HistoryEndpoint from "./sabnzbd/HistoryEndpoint"
import CapsEndpoint from "./newznab/CapsEndpoint"
import AddFileEndpoint from "./sabnzbd/AddFileEndpoint"
import DownloadNZBEndpoint from "./sabnzbd/DownloadNZBEndpoint"
import VersionEndpoint from "./sabnzbd/VersionEndpoint"
import SearchEndpoint from "./newznab/SearchEndpoint"

export interface EndpointDirectory {
    [key : string] : RequestHandler
}

export const SabNZBDEndpointDirectory : EndpointDirectory = {
    queue : QueueEndpoint,
    get_config : ConfigEndpoint,
    history : HistoryEndpoint,
    version : VersionEndpoint,
    "nzb-download" : DownloadNZBEndpoint,
    addfile : AddFileEndpoint
}

export const NewzNabEndpointDirectory : EndpointDirectory = {
    caps : CapsEndpoint,
    tvsearch : SearchEndpoint,
    movie : SearchEndpoint,
    search : SearchEndpoint
}