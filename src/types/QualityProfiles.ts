export interface QualityProfile {
    id : string,
    name : string,
    quality : string
}

export const qualityProfiles : QualityProfile[] = [
    {id : "mobile", name : "Mobile", quality : "288p"},
    {id : "web", name : "Web", quality : "396p"},
    {id : "sd", name : "SD", quality : "540p"},
    {id : "hd", name : "HD", quality : "720p"},
    {id : "fhd", name : "Full-HD", quality : "1080p"},
];