import type { ApiErrorItem, ApiErrorResponse } from "@errant/shared";

export class HttpError extends Error {
    readonly status: number;
    readonly statusCode: number;
    readonly errors: ApiErrorItem[];

    constructor(status: number, errors: ApiErrorItem[]) {
        super(errors[0]?.key ?? "errors.fatal");
        this.status = status;
        this.statusCode = status;
        this.errors = errors;
    }
}

export function errorBody(errors: ApiErrorItem[]): ApiErrorResponse {
    return {
        errors: errors.map((error) =>
            error.field === undefined ? { key: error.key } : { key: error.key, field: error.field },
        ),
    };
}

export function validationError(field?: string): HttpError {
    return new HttpError(400, [{ key: "errors.validation", ...(field === undefined ? {} : { field }) }]);
}
