import type { FastifyReply, FastifyRequest } from "fastify";

import { HttpError } from "../common/http/errors.ts";
import { UtilsService } from "../common/utils-service.ts";
import type { UserEntity } from "../domains/users/user-entity.ts";
import type { UserRepository } from "../domains/users/user-repository.ts";
import { AuthCookieService, type SessionPayload } from "./auth-cookie-service.ts";

export class AuthSessionService {
    private readonly userRepository: UserRepository;
    private readonly cookieSecret: string;

    constructor(userRepository: UserRepository, cookieSecret: string) {
        this.userRepository = userRepository;
        this.cookieSecret = cookieSecret;
    }

    async requireUser(request: FastifyRequest, reply: FastifyReply): Promise<UserEntity> {
        const user = await this.authenticatedUser(request);
        this.writeSession(reply, user);
        return user;
    }

    async signOut(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const payload = this.readPayload(request);
        if (payload !== null && AuthCookieService.isCurrent(payload, UtilsService.timeNow())) {
            const user = await this.userRepository.readById(payload.userId);
            if (user !== null && user.sessionId === payload.sessionId) {
                user.sessionId = UtilsService.newId();
                await this.userRepository.update(user);
            }
        }

        reply.clearCookie(AuthCookieService.name, {
            path: AuthCookieService.options.path,
            httpOnly: AuthCookieService.options.httpOnly,
            secure: AuthCookieService.options.secure,
            sameSite: AuthCookieService.options.sameSite,
        });
    }

    writeSession(reply: FastifyReply, user: UserEntity): void {
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

    private readPayload(request: FastifyRequest): SessionPayload | null {
        const token = request.cookies[AuthCookieService.name];
        if (token === undefined || token === "") {
            return null;
        }
        return AuthCookieService.open(token, this.cookieSecret);
    }

    private async authenticatedUser(request: FastifyRequest): Promise<UserEntity> {
        const payload = this.readPayload(request);
        if (payload === null || !AuthCookieService.isCurrent(payload, UtilsService.timeNow())) {
            throw new HttpError("errors.unauthorized", 401);
        }

        const user = await this.userRepository.readById(payload.userId);
        if (user === null || user.sessionId !== payload.sessionId) {
            throw new HttpError("errors.unauthorized", 401);
        }
        return user;
    }
}
