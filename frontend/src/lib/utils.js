export const getHost = () => {
    return process.env.NODE_ENV != 'production' ? `http://${window.location.hostname}:4404` : '';
}

export const formatStorageSize = (mb) => {
    if (mb){
        if (mb >= 1024) {
            return (mb / 1024).toFixed(2) + " GB";
        }
        return mb.toFixed(2) + " MB";
    }
    return;
}