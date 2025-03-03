export enum ApiError {
    API_NOT_FOUND = "API Not Found",
    NOT_AUTHORISED = "Not Authorised",
}

export interface ApiResponse {
    error?: ApiError;
}