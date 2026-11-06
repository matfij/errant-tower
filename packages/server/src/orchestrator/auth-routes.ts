import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { RequestBodyService } from "../common/http/body.ts";
import { AuthOrchestrator } from "./auth-orchestrator.ts";
import { AuthSessionService } from "./auth-session-service.ts";

export class AuthRoutes {
    private readonly authOrchestrator: AuthOrchestrator;
    private readonly authSessionService: AuthSessionService;

    constructor(authOrchestrator: AuthOrchestrator, authSessionService: AuthSessionService) {
        this.authOrchestrator = authOrchestrator;
        this.authSessionService = authSessionService;
    }

    register(app: FastifyInstance): void {
        app.post("/auth/sign-up-start", async (request, reply) => {
            const body = RequestBodyService.parse(AuthRoutes.startSignUpBody, request.body);
            await this.authOrchestrator.startSignUp(body.email, body.username);
            return reply.status(200).send();
        });

        app.post("/auth/sign-up-complete", async (request, reply) => {
            const body = RequestBodyService.parse(AuthRoutes.completeSignUpBody, request.body);
            const user = await this.authOrchestrator.completeSignUp(body.email, body.actionCode);

            this.authSessionService.writeSession(reply, user);

            return {
                userId: user.id,
                username: user.username,
            };
        });

        app.post("/auth/sign-in-start", async (request, reply) => {
            const body = RequestBodyService.parse(AuthRoutes.startSignInBody, request.body);
            await this.authOrchestrator.startSignIn(body.email);
            return reply.status(200).send();
        });

        app.post("/auth/sign-in-complete", async (request, reply) => {
            const body = RequestBodyService.parse(AuthRoutes.completeSignInBody, request.body);
            const user = await this.authOrchestrator.completeSignIn(body.email, body.actionCode);

            this.authSessionService.writeSession(reply, user);

            return {
                userId: user.id,
                username: user.username,
            };
        });

        app.post("/auth/sign-out", async (request, reply) => {
            await this.authSessionService.signOut(request, reply);
            return reply.status(200).send();
        });

        app.get("/auth/session", async (request, reply) => {
            const user = await this.authSessionService.requireUser(request, reply);
            return {
                userId: user.id,
                username: user.username,
            };
        });
    }

    private static readonly startSignUpBody = z.object({
        email: z.string().email(),
        username: z
            .string()
            .min(4)
            .max(16)
            .regex(/^[A-Za-z0-9_]+$/),
    });

    private static readonly completeSignUpBody = z.object({
        email: z.string().email(),
        actionCode: z.string().length(6).regex(/^\d+$/),
    });

    private static readonly startSignInBody = z.object({
        email: z.string().email(),
    });

    private static readonly completeSignInBody = z.object({
        email: z.string().email(),
        actionCode: z.string().length(6).regex(/^\d+$/),
    });
}
