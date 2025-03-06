import { ChildProcess } from "child_process";
import { QueueEntryStatus, QueueStatus } from "./responses/sabnzbd/QueueResponse";
import { DownloadDetails } from "./DownloadDetails";
import { VideoType } from "./IPlayerSearchResult";

export interface QueueEntry {
    pid : string,
    status : QueueEntryStatus,
    process? : ChildProcess,
    details?: DownloadDetails,
    nzbName: string,
    type : VideoType
}