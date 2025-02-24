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

    return "0s"; // If the difference is less than 1 second
}

export function formatInlineDates(str) {
    return str.replace(/\b(\d{2})-(\d{2})-(\d{4})\b/g, (_, day, month, year) => `${year}-${month}-${day}`);
}

export function formatSeriesString(input) {
    return input.replace(/Series\.(\d+)\.-(?:\.\d+\.?)?\.Episode\.(\d+)/, (match, season, episode) => {
        return `S${season.padStart(2, '0')}E${episode.padStart(2, '0')}`;
    });
}

//The.Repair.Shop.On.The.Road.S01E14.WEB.H264-RBB
//The Repair Shop: Series 14 - Episode 5
export function createNZBName(input) {
    let filename = input.replaceAll("_", ".");
    filename = filename.replaceAll(" ", ".");
    filename = filename.replaceAll(":", "");
    filename = formatInlineDates(filename);
    filename = formatSeriesString(filename);
    return `${filename}.WEB.H264-BBC`;
}