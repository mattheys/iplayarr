export interface NZBGetAppendRequest {
    NZBFilename : string,
    Content : string,
    Category : string,
    Priority : number,
    AddToTop : boolean,
    AddPaused : boolean,
    DupeKey : string,
    DupeScore : number,
    DupeMode : string,
    PPParameters : string[]
}