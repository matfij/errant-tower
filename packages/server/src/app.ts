import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import Fastify, { type FastifyInstance } from "fastify";

import type { EmailService } from "./common/email/email-service.ts";
import { HttpError } from "./common/http/errors.ts";
import { MutationGuardService } from "./common/http/guard.ts";
import { LogService } from "./common/log.ts";
import type { UserRepository } from "./domains/users/user-repository.ts";
import { UserService } from "./domains/users/user-service.ts";
import { AuthOrchestrator } from "./orchestrator/auth-orchestrator.ts";
import { AuthRoutes } from "./orchestrator/auth-routes.ts";

export type BuildAppOptions = {
    logger: boolean | object;
    corsOrigins: string[];
    cookieSecret: string;
    userRepository: UserRepository;
    emailService: EmailService;
};

export const buildApp = async (options: BuildAppOptions): Promise<FastifyInstance> => {
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
            done(new HttpError("errors.validation"), undefined);
        }
    });

    await app.register(cookie);
    await app.register(cors, {
        origin: options.corsOrigins,
        credentials: true,
        methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "X-Errant-Request"],
    });

    LogService.bind(app.log);

    MutationGuardService.register(app);

    new AuthRoutes(
        new AuthOrchestrator(new UserService(options.userRepository, options.emailService)),
        options.userRepository,
        options.cookieSecret,
    ).register(app);

    app.setErrorHandler((error, _request, reply) => {
        if (error instanceof HttpError) {
            return reply.status(error.statusCode).send(error.body());
        }
        LogService.error({ err: error }, "Unhandled exception");
        return reply.status(500).send(new HttpError("errors.fatal", 500).body());
    });

    return app;
};
