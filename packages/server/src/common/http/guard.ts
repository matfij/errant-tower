import type { FastifyInstance } from "fastify";

import { HttpError } from "./errors.ts";

export class MutationGuardService {
    private static readonly safeMethods = new Set(["GET", "HEAD", "OPTIONS"]);

    static register(app: FastifyInstance): void {
        app.addHook("onRequest", async (request) => {
            if (MutationGuardService.safeMethods.has(request.method)) {
                return;
            }
            const header = request.headers["x-errant-request"];
            const contentType = request.headers["content-type"] ?? "";
            const mediaType = contentType.split(";")[0]?.trim().toLowerCase();
            if (header !== "1" || mediaType !== "application/json") {
                throw new HttpError("errors.forbidden");
            }
        });
    }
}
