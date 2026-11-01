import type { FastifyInstance } from "fastify";

import { HttpError } from "./errors.ts";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function registerMutationGuard(app: FastifyInstance): void {
    app.addHook("onRequest", async (request) => {
        if (SAFE_METHODS.has(request.method)) {
            return;
        }

        const header = request.headers["x-errant-request"];
        const contentType = request.headers["content-type"] ?? "";
        const mediaType = contentType.split(";")[0]?.trim().toLowerCase();
        if (header !== "1" || mediaType !== "application/json") {
            throw new HttpError(400, [{ key: "errors.forbidden" }]);
        }
    });
}
