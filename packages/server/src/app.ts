import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import Fastify, { type FastifyInstance } from "fastify";

import { registerAuthRoutes } from "./auth/routes.ts";
import { createAuthService } from "./auth/service.ts";
import type { UserStore } from "./db/user-store.ts";
import type { EmailSender } from "./email/resend.ts";
import { errorBody, HttpError } from "./http/errors.ts";
import { registerMutationGuard } from "./http/guard.ts";

export type BuildAppOptions = {
    logger: boolean | object;
    corsOrigins: string[];
    cookieSecret: string;
    users: UserStore;
    emails: EmailSender;
    now: () => number;
    newId: () => string;
    newActionCode: () => string;
};

export async function buildApp(options: BuildAppOptions): Promise<FastifyInstance> {
    const app = Fastify({ logger: options.logger });

    app.removeContentTypeParser("application/json");
    app.addContentTypeParser("application/json", { parseAs: "string" }, (_request, body, done) => {
        const text = typeof body === "string" ? body : "";
        if (text === "") {
            done(null, {});
            return;
        }

        try {
            done(null, JSON.parse(text) as unknown);
        } catch {
            done(new HttpError(400, [{ key: "errors.validation" }]), undefined);
        }
    });

    await app.register(cookie);
    await app.register(cors, {
        origin: options.corsOrigins,
        credentials: true,
        methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "X-Errant-Request"],
    });

    registerMutationGuard(app);

    const service = createAuthService({
        users: options.users,
        emails: options.emails,
        now: options.now,
        newId: options.newId,
        newActionCode: options.newActionCode,
        log: app.log,
    });

    registerAuthRoutes(app, {
        service,
        users: options.users,
        cookieSecret: options.cookieSecret,
        now: options.now,
        newId: options.newId,
    });

    app.setErrorHandler((error, request, reply) => {
        if (error instanceof HttpError) {
            return reply.status(error.status).send(errorBody(error.errors));
        }

        request.log.error({ err: error }, "Unhandled exception");
        return reply.status(500).send(errorBody([{ key: "errors.fatal" }]));
    });

    return app;
}
