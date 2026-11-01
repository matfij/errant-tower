import type { ZodType } from "zod";

import { HttpError } from "./errors.ts";

export function parseBody<T>(schema: ZodType<T>, body: unknown): T {
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
        throw new HttpError(400, [{ key: "errors.validation" }]);
    }

    throw new HttpError(400, errors);
}
