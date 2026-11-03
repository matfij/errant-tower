import type { ApiErrorItem, ApiErrorResponse } from "@errant/shared";

export class HttpError extends Error {
    readonly statusCode: number;
    readonly errors: ApiErrorItem[];

    constructor(key: string, statusCode?: number);
    constructor(statusCode: number, errors: ApiErrorItem[]);
    constructor(keyOrStatusCode: string | number, statusCodeOrErrors: number | ApiErrorItem[] = 400) {
        if (typeof keyOrStatusCode === "string") {
            super(keyOrStatusCode);
            this.statusCode = typeof statusCodeOrErrors === "number" ? statusCodeOrErrors : 400;
            this.errors = [{ key: keyOrStatusCode }];
            return;
        }

        const errors = statusCodeOrErrors as ApiErrorItem[];
        super(errors[0]?.key ?? "errors.fatal");
        this.statusCode = keyOrStatusCode;
        this.errors = errors;
    }

    body(): ApiErrorResponse {
        return {
            errors: this.errors.map((error) =>
                error.field === undefined ? { key: error.key } : { key: error.key, field: error.field },
            ),
        };
    }
}
