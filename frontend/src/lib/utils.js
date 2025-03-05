export const getHost = () => {
    return process.env.NODE_ENV != 'production' ? `http://${window.location.hostname}:4404` : '';
}