export enum AppType {
    SONARR = 'SONARR',
    RADARR = 'RADARR',
    PROWLARR = 'PROWLARR',
    // LIDARR = 'LIDARR'
}

export enum AppFeature {
    DOWNLOAD_CLIENT = 'download_client',
    INDEXER = 'indexer',
    PROWLARR_DOWNLOAD_CLIENT = 'prowlarr_download_client',
    PROWLARR_INDEXER = 'prowlarr_indexer'
}

export const appCategories : Record<AppType, number[]> = {
    [AppType.SONARR]: [5030, 5040],
    [AppType.RADARR]: [2010, 2020, 2030, 2040, 2045, 2050, 2060],
    [AppType.PROWLARR]: [5030, 5040, 2010, 2020, 2030, 2040, 2045, 2050, 2060],
    // [AppType.LIDARR]: []
}

export const appFeatures : Record<AppType, AppFeature[]> = {
    [AppType.SONARR] : [AppFeature.DOWNLOAD_CLIENT, AppFeature.INDEXER],
    [AppType.RADARR] : [AppFeature.DOWNLOAD_CLIENT, AppFeature.INDEXER],
    [AppType.PROWLARR] : [AppFeature.PROWLARR_DOWNLOAD_CLIENT, AppFeature.PROWLARR_INDEXER],
    // [AppType.LIDARR] : []
}