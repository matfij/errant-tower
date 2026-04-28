export interface ApiErrorResponse {
    errors: ApiError[];
}

export interface ApiError {
    key: string;
    field: string | null;
}
