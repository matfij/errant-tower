import type { output, ZodTypeAny } from "zod";

import { HttpError } from "./errors.ts";

export class RequestBodyService {
    static parse<T extends ZodTypeAny>(schema: T, body: unknown): output<T> {
        const result = schema.safeParse(body);
        if (result.success) {
            return result.data;
        }

        const errors = result.error.issues.map((issue) => {
            const field = issue.path[0];
            return {
                key: "errors.validation",
                ...(typeof field === "string" ? { field } : {}),
            };
        });

        if (errors.length === 0) {
            throw new HttpError("errors.validation");
        }

        throw new HttpError(400, errors);
    }
}
