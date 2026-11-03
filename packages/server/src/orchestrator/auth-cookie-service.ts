import { createHmac, timingSafeEqual } from "node:crypto";

import { config } from "../config.ts";

export type SessionPayload = {
    userId: string;
    sessionId: string;
    expiresAt: number;
};

export class AuthCookieService {
    static readonly name = "errant_tower_auth";

    static readonly options = {
        path: "/",
        sameSite: "none",
        secure: true,
        httpOnly: true,
        maxAge: config.sessionTtlSeconds,
    } as const;

    static seal(payload: SessionPayload, secret: string): string {
        const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
        const signature = createHmac("sha256", secret).update(body).digest("base64url");
        return `${body}.${signature}`;
    }

    static open(token: string, secret: string): SessionPayload | null {
        const dot = token.lastIndexOf(".");
        if (dot <= 0) {
            return null;
        }

        const body = token.slice(0, dot);
        const signature = token.slice(dot + 1);
        const expected = createHmac("sha256", secret).update(body).digest("base64url");
        const actualBuffer = Buffer.from(signature);
        const expectedBuffer = Buffer.from(expected);
        if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) {
            return null;
        }

        try {
            const parsed: unknown = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
            if (!AuthCookieService.isPayload(parsed)) {
                return null;
            }
            return parsed;
        } catch {
            return null;
        }
    }

    static expiry(now: number): number {
        return now + config.sessionTtlMs;
    }

    static isCurrent(payload: SessionPayload, now: number): boolean {
        return payload.expiresAt > now;
    }

    private static isPayload(value: unknown): value is SessionPayload {
        if (value === null || typeof value !== "object") {
            return false;
        }

        const payload = value as Record<string, unknown>;
        return (
            typeof payload.userId === "string" &&
            payload.userId !== "" &&
            typeof payload.sessionId === "string" &&
            payload.sessionId !== "" &&
            typeof payload.expiresAt === "number" &&
            Number.isFinite(payload.expiresAt)
        );
    }
}
