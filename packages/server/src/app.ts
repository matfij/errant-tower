import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import Fastify, { type FastifyInstance } from "fastify";

import type { EmailService } from "./common/email/email-service.ts";
import { HttpError } from "./common/http/errors.ts";
import { MutationGuardService } from "./common/http/guard.ts";
import { LogService } from "./common/log.ts";
import type { EquipmentRepository } from "./domains/equipment/equipment-repository.ts";
import { EquipmentService } from "./domains/equipment/equipment-service.ts";
import { SkillsService } from "./domains/statistics/skills-service.ts";
import type { StatisticsRepository } from "./domains/statistics/statistics-repository.ts";
import { StatisticsService } from "./domains/statistics/statistics-service.ts";
import type { UserRepository } from "./domains/users/user-repository.ts";
import { UserService } from "./domains/users/user-service.ts";
import { AuthOrchestrator } from "./orchestrator/auth-orchestrator.ts";
import { AuthRoutes } from "./orchestrator/auth-routes.ts";
import { AuthSessionService } from "./orchestrator/auth-session-service.ts";
import { EquipmentOrchestrator } from "./orchestrator/equipment-orchestrator.ts";
import { EquipmentRoutes } from "./orchestrator/equipment-routes.ts";
import { StatisticsOrchestrator } from "./orchestrator/statistics-orchestrator.ts";
import { StatisticsRoutes } from "./orchestrator/statistics-routes.ts";

export type BuildAppOptions = {
    logger: boolean | object;
    corsOrigins: string[];
    cookieSecret: string;
    userRepository: UserRepository;
    statisticsRepository: StatisticsRepository;
    equipmentRepository: EquipmentRepository;
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

    const userService = new UserService(options.userRepository, options.emailService);

    const authSessionService = new AuthSessionService(options.userRepository, options.cookieSecret);

    const statisticsService = new StatisticsService(options.statisticsRepository);

    const skillsService = new SkillsService(options.statisticsRepository);

    const equipmentService = new EquipmentService(options.equipmentRepository);

    const authOrchestrator = new AuthOrchestrator(userService, statisticsService, equipmentService);
    const authRoutes = new AuthRoutes(authOrchestrator, authSessionService);

    const statisticsOrchestrator = new StatisticsOrchestrator(
        statisticsService,
        skillsService,
        equipmentService,
    );
    const statisticsRoutes = new StatisticsRoutes(statisticsOrchestrator, authSessionService);

    const equipmentOrchestrator = new EquipmentOrchestrator(equipmentService, statisticsService);
    const equipmentRoutes = new EquipmentRoutes(equipmentOrchestrator, authSessionService);

    authRoutes.register(app);
    statisticsRoutes.register(app);
    equipmentRoutes.register(app);

    app.setNotFoundHandler((_request, reply) => {
        return reply.status(404).send(new HttpError("errors.notFound", 404).body());
    });

    app.setErrorHandler((error, _request, reply) => {
        if (error instanceof HttpError) {
            return reply.status(error.statusCode).send(error.body());
        }
        LogService.error({ err: error }, "Unhandled exception");
        return reply.status(500).send(new HttpError("errors.fatal", 500).body());
    });

    return app;
};
