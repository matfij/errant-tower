import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { RequestBodyService } from "../common/http/body.ts";
import { HttpError } from "../common/http/errors.ts";
import { UtilsService } from "../common/utils-service.ts";
import type { UserEntity } from "../domains/users/user-entity.ts";
import type { UserRepository } from "../domains/users/user-repository.ts";
import { AuthCookieService, type SessionPayload } from "./auth-cookie-service.ts";
import { AuthOrchestrator } from "./auth-orchestrator.ts";

export class AuthRoutes {
    constructor(
        private readonly authOrchestrator: AuthOrchestrator,
        private readonly userRepository: UserRepository,
        private readonly cookieSecret: string,
    ) {}

    register(app: FastifyInstance): void {
        app.post("/auth/sign-up-start", async (request, reply) => {
            const body = RequestBodyService.parse(AuthRoutes.startSignUpBody, request.body);
            await this.authOrchestrator.startSignUp(body.email, body.username);
            return reply.status(200).send();
        });

        app.post("/auth/sign-up-complete", async (request, reply) => {
            const body = RequestBodyService.parse(AuthRoutes.completeSignUpBody, request.body);
            const user = await this.authOrchestrator.completeSignUp(body.email, body.actionCode);

            this.writeSessionCookie(reply, user);

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

            this.writeSessionCookie(reply, user);

            return {
                userId: user.id,
                username: user.username,
            };
        });

        app.post("/auth/sign-out", async (request, reply) => {
            const payload = this.readPayload(request);
            if (payload !== null && AuthCookieService.isCurrent(payload, UtilsService.timeNow())) {
                const user = await this.userRepository.findById(payload.userId);
                if (user !== null && user.sessionId === payload.sessionId) {
                    user.sessionId = UtilsService.newId();
                    await this.userRepository.replace(user);
                }
            }

            reply.clearCookie(AuthCookieService.name, {
                path: AuthCookieService.options.path,
                httpOnly: AuthCookieService.options.httpOnly,
                secure: AuthCookieService.options.secure,
                sameSite: AuthCookieService.options.sameSite,
            });

            return reply.status(200).send();
        });

        app.get("/auth/session", async (request, reply) => {
            const user = await this.authenticatedUser(request);
            this.writeSessionCookie(reply, user);
            return {
                userId: user.id,
                username: user.username,
            };
        });
    }

    private static readonly startSignUpBody = z.object({
        email: z.string().email(),
        username: z.string().min(4).max(16),
    });

    private static readonly completeSignUpBody = z.object({
        email: z.string().email(),
        actionCode: z.string().length(6),
    });

    private static readonly startSignInBody = z.object({
        email: z.string().email(),
    });

    private static readonly completeSignInBody = z.object({
        email: z.string().email(),
        actionCode: z.string().length(6),
    });

    private readPayload(request: FastifyRequest): SessionPayload | null {
        const token = request.cookies[AuthCookieService.name];
        if (token === undefined || token === "") {
            return null;
        }
        return AuthCookieService.open(token, this.cookieSecret);
    }

    private writeSessionCookie(reply: FastifyReply, user: UserEntity): void {
        if (user.sessionId === null) {
            throw new HttpError("errors.unauthorized", 401);
        }

        const token = AuthCookieService.seal(
            {
                userId: user.id,
                sessionId: user.sessionId,
                expiresAt: AuthCookieService.expiry(UtilsService.timeNow()),
            },
            this.cookieSecret,
        );
        reply.setCookie(AuthCookieService.name, token, AuthCookieService.options);
    }

    private async authenticatedUser(request: FastifyRequest): Promise<UserEntity> {
        const payload = this.readPayload(request);
        if (payload === null || !AuthCookieService.isCurrent(payload, UtilsService.timeNow())) {
            throw new HttpError("errors.unauthorized", 401);
        }

        const user = await this.userRepository.findById(payload.userId);
        if (user === null || user.sessionId !== payload.sessionId) {
            throw new HttpError("errors.unauthorized", 401);
        }
        return user;
    }
}
