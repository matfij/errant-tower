import type {
    AuthUserResponse,
    CompleteSignInRequest,
    CompleteSignUpRequest,
    StartSignInRequest,
    StartSignUpRequest,
} from "@errant/shared";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import type { UserRecord, UserStore } from "../db/user-store.ts";
import { parseBody } from "../http/body.ts";
import { HttpError } from "../http/errors.ts";
import {
    AUTH_COOKIE,
    authCookieOptions,
    openSession,
    sealSession,
    sessionExpiry,
    sessionIsCurrent,
    type SessionPayload,
} from "./cookie.ts";
import type { AuthService } from "./service.ts";

const startSignUpBody = z.object({
    email: z.string().email(),
    username: z.string().min(4).max(16),
});

const completeSignUpBody = z.object({
    email: z.string().email(),
    actionCode: z.string().length(6),
});

const startSignInBody = z.object({
    email: z.string().email(),
});

const completeSignInBody = z.object({
    email: z.string().email(),
    actionCode: z.string().length(6),
});

export function registerAuthRoutes(
    app: FastifyInstance,
    deps: {
        service: AuthService;
        users: UserStore;
        cookieSecret: string;
        now: () => number;
        newId: () => string;
    },
): void {
    app.post("/auth/sign-up-start", async (request, reply) => {
        const body: StartSignUpRequest = parseBody(startSignUpBody, request.body);
        await deps.service.startSignUp(body.email, body.username);
        return reply.status(200).send();
    });

    app.post("/auth/sign-up-complete", async (request, reply) => {
        const body: CompleteSignUpRequest = parseBody(completeSignUpBody, request.body);
        const user = await deps.service.completeSignUp(body.email, body.actionCode);
        writeSessionCookie(reply, deps, user);
        return userResponse(user);
    });

    app.post("/auth/sign-in-start", async (request, reply) => {
        const body: StartSignInRequest = parseBody(startSignInBody, request.body);
        await deps.service.startSignIn(body.email);
        return reply.status(200).send();
    });

    app.post("/auth/sign-in-complete", async (request, reply) => {
        const body: CompleteSignInRequest = parseBody(completeSignInBody, request.body);
        const user = await deps.service.completeSignIn(body.email, body.actionCode);
        writeSessionCookie(reply, deps, user);
        return userResponse(user);
    });

    app.post("/auth/sign-out", async (request, reply) => {
        const payload = readPayload(request, deps.cookieSecret);
        if (payload !== null && sessionIsCurrent(payload, deps.now())) {
            const user = await deps.users.findById(payload.userId);
            if (user !== null && user.sessionId === payload.sessionId) {
                user.sessionId = deps.newId();
                await deps.users.replace(user);
            }
        }

        reply.clearCookie(AUTH_COOKIE, {
            path: authCookieOptions.path,
            httpOnly: authCookieOptions.httpOnly,
            secure: authCookieOptions.secure,
            sameSite: authCookieOptions.sameSite,
        });
        return reply.status(200).send();
    });

    app.get("/auth/session", async (request, reply) => {
        const user = await authenticatedUser(request, deps);
        writeSessionCookie(reply, deps, user);
        return userResponse(user);
    });
}

async function authenticatedUser(
    request: FastifyRequest,
    deps: { users: UserStore; cookieSecret: string; now: () => number },
): Promise<UserRecord> {
    const payload = readPayload(request, deps.cookieSecret);
    if (payload === null || !sessionIsCurrent(payload, deps.now())) {
        throw new HttpError(401, [{ key: "errors.unauthorized" }]);
    }

    const user = await deps.users.findById(payload.userId);
    if (user === null || user.sessionId !== payload.sessionId) {
        throw new HttpError(401, [{ key: "errors.unauthorized" }]);
    }
    return user;
}

function readPayload(request: FastifyRequest, secret: string): SessionPayload | null {
    const token = request.cookies[AUTH_COOKIE];
    if (token === undefined || token === "") {
        return null;
    }
    return openSession(token, secret);
}

function writeSessionCookie(
    reply: FastifyReply,
    deps: { cookieSecret: string; now: () => number },
    user: UserRecord,
): void {
    if (user.sessionId === null) {
        throw new HttpError(401, [{ key: "errors.unauthorized" }]);
    }

    const token = sealSession(
        {
            userId: user.id,
            sessionId: user.sessionId,
            expiresAt: sessionExpiry(deps.now()),
        },
        deps.cookieSecret,
    );
    reply.setCookie(AUTH_COOKIE, token, authCookieOptions);
}

function userResponse(user: UserRecord): AuthUserResponse {
    return {
        userId: user.id,
        username: user.username,
    };
}
