import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, describe, it } from "node:test";

import type { FastifyInstance } from "fastify";

import { buildApp } from "./app.ts";
import { generateActionCode } from "./auth/action-code.ts";
import { AUTH_COOKIE, openSession } from "./auth/cookie.ts";
import { ACTION_CODE_TTL_MS, SESSION_TTL_MS } from "./config.ts";
import type { UserRecord, UserStore } from "./db/user-store.ts";
import { DuplicateUserField } from "./db/user-store.ts";

const COOKIE_SECRET = "test-cookie-secret-32-characters-min";

type SentEmail = {
    to: string;
    subject: string;
    html: string;
};

function createMemoryStore() {
    const byId = new Map<string, UserRecord>();
    const initial: { userId: string; username: string }[] = [];

    const clone = (user: UserRecord): UserRecord => ({ ...user });

    const store: UserStore = {
        async findById(id) {
            const user = byId.get(id);
            return user === undefined ? null : clone(user);
        },
        async findByEmail(email) {
            const user = [...byId.values()].find((entry) => entry.email === email);
            return user === undefined ? null : clone(user);
        },
        async findByUsername(username) {
            const user = [...byId.values()].find((entry) => entry.username === username);
            return user === undefined ? null : clone(user);
        },
        async insert(user) {
            if ([...byId.values()].some((entry) => entry.email === user.email)) {
                throw new DuplicateUserField("email");
            }
            if ([...byId.values()].some((entry) => entry.username === user.username)) {
                throw new DuplicateUserField("username");
            }
            byId.set(user.id, clone(user));
        },
        async replace(user) {
            if (!byId.has(user.id)) {
                throw new Error("errors.userUpdateFailed");
            }
            byId.set(user.id, clone(user));
        },
        async delete(id) {
            if (!byId.delete(id)) {
                throw new Error("errors.userDeleteFailed");
            }
        },
        async insertInitial(userId, username) {
            initial.push({ userId, username });
        },
    };

    return {
        store,
        initial,
        list: () => [...byId.values()].map(clone),
    };
}

async function createTestApp() {
    const users = createMemoryStore();
    const sent: SentEmail[] = [];
    let now = Date.parse("2026-01-01T00:00:00.000Z");
    let failEmail = false;

    const app = await buildApp({
        logger: false,
        corsOrigins: ["http://localhost:5174"],
        cookieSecret: COOKIE_SECRET,
        users: users.store,
        emails: {
            async send(to, subject, html) {
                if (failEmail) {
                    throw new Error("resend down");
                }
                sent.push({ to, subject, html });
            },
        },
        now: () => now,
        newId: () => randomUUID(),
        newActionCode: generateActionCode,
    });

    return {
        app,
        users,
        sent,
        setNow: (value: number) => {
            now = value;
        },
        now: () => now,
        setFailEmail: (value: boolean) => {
            failEmail = value;
        },
    };
}

function codeFrom(html: string): string {
    const match = html.match(/\b(\d{6})\b/);
    assert.ok(match?.[1]);
    return match[1];
}

function cookieFrom(header: unknown): string {
    const lines = Array.isArray(header) ? header : [header];
    const line = lines.find((value) => typeof value === "string" && value.startsWith(`${AUTH_COOKIE}=`));
    if (typeof line !== "string") {
        assert.fail("missing auth cookie");
    }
    const pair = line.split(";")[0] ?? "";
    return decodeURIComponent(pair.slice(`${AUTH_COOKIE}=`.length));
}

async function post(
    app: FastifyInstance,
    url: string,
    payload: unknown,
    extraHeaders: Record<string, string> = {},
) {
    return app.inject({
        method: "POST",
        url,
        headers: {
            "content-type": "application/json",
            "x-errant-request": "1",
            ...extraHeaders,
        },
        payload: payload === undefined ? undefined : (payload as object),
    });
}

describe("auth routes", () => {
    const apps: FastifyInstance[] = [];

    after(async () => {
        await Promise.all(apps.map((app) => app.close()));
    });

    async function setup() {
        const test = await createTestApp();
        apps.push(test.app);
        return test;
    }

    it("signs up, slides the cookie, and rejects it after sign-out", async () => {
        const test = await setup();
        const started = await post(test.app, "/auth/sign-up-start", {
            email: "ada@example.com",
            username: "adal",
        });
        assert.equal(started.statusCode, 200);
        assert.equal(started.body, "");
        assert.equal(test.sent[0]?.subject, "Welcome to Errant Tower");

        const signUpCode = codeFrom(test.sent[0]?.html ?? "");
        const completed = await post(test.app, "/auth/sign-up-complete", {
            email: "ada@example.com",
            actionCode: signUpCode,
        });
        assert.equal(completed.statusCode, 200);
        const created = completed.json<{ userId: string; username: string }>();
        assert.equal(created.username, "adal");
        assert.deepEqual(test.users.initial, [{ userId: created.userId, username: "adal" }]);

        const setCookie = String(completed.headers["set-cookie"]);
        assert.match(setCookie, /HttpOnly/i);
        assert.match(setCookie, /Secure/);
        assert.match(setCookie, /SameSite=None/i);
        assert.match(setCookie, /Max-Age=604800/);
        const cookie = cookieFrom(completed.headers["set-cookie"]);
        const sealed = openSession(cookie, COOKIE_SECRET);
        assert.equal(sealed?.userId, created.userId);
        assert.equal(sealed?.expiresAt, test.now() + SESSION_TTL_MS);

        test.setNow(test.now() + 5_000);
        const session = await test.app.inject({
            method: "GET",
            url: "/auth/session",
            headers: { cookie: `${AUTH_COOKIE}=${cookie}` },
        });
        assert.equal(session.statusCode, 200);
        assert.deepEqual(session.json(), created);
        const slid = openSession(cookieFrom(session.headers["set-cookie"]), COOKIE_SECRET);
        assert.equal(slid?.expiresAt, test.now() + SESSION_TTL_MS);

        const signedOut = await post(test.app, "/auth/sign-out", {}, { cookie: `${AUTH_COOKIE}=${cookie}` });
        assert.equal(signedOut.statusCode, 200);
        const rejected = await test.app.inject({
            method: "GET",
            url: "/auth/session",
            headers: { cookie: `${AUTH_COOKIE}=${cookie}` },
        });
        assert.equal(rejected.statusCode, 401);
        assert.deepEqual(rejected.json(), { errors: [{ key: "errors.unauthorized" }] });
    });

    it("rejects an expired cookie and a cookie whose session was rotated", async () => {
        const test = await setup();
        await post(test.app, "/auth/sign-up-start", { email: "ada@example.com", username: "adal" });
        const completed = await post(test.app, "/auth/sign-up-complete", {
            email: "ada@example.com",
            actionCode: codeFrom(test.sent[0]?.html ?? ""),
        });
        const cookie = cookieFrom(completed.headers["set-cookie"]);
        const payload = openSession(cookie, COOKIE_SECRET);
        assert.ok(payload);

        test.setNow(payload.expiresAt + 1);
        const expired = await test.app.inject({
            method: "GET",
            url: "/auth/session",
            headers: { cookie: `${AUTH_COOKIE}=${cookie}` },
        });
        assert.equal(expired.statusCode, 401);

        test.setNow(payload.expiresAt - 1_000);
        const user = test.users.list()[0];
        assert.ok(user);
        await test.users.store.replace({ ...user, sessionId: randomUUID() });
        const rotated = await test.app.inject({
            method: "GET",
            url: "/auth/session",
            headers: { cookie: `${AUTH_COOKIE}=${cookie}` },
        });
        assert.equal(rotated.statusCode, 401);
    });

    it("rejects a mutated cookie and a cross-site form post", async () => {
        const test = await setup();
        const form = await test.app.inject({
            method: "POST",
            url: "/auth/sign-in-start",
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "x-errant-request": "1",
            },
            payload: "email=ada@example.com",
        });
        assert.equal(form.statusCode, 400);
        assert.deepEqual(form.json(), { errors: [{ key: "errors.forbidden" }] });

        const missingHeader = await test.app.inject({
            method: "POST",
            url: "/auth/sign-in-start",
            headers: { "content-type": "application/json" },
            payload: { email: "ada@example.com" },
        });
        assert.equal(missingHeader.statusCode, 400);
        assert.deepEqual(missingHeader.json(), { errors: [{ key: "errors.forbidden" }] });

        await post(test.app, "/auth/sign-up-start", { email: "ada@example.com", username: "adal" });
        const completed = await post(test.app, "/auth/sign-up-complete", {
            email: "ada@example.com",
            actionCode: codeFrom(test.sent[0]?.html ?? ""),
        });
        const cookie = cookieFrom(completed.headers["set-cookie"]);
        const tampered = await test.app.inject({
            method: "GET",
            url: "/auth/session",
            headers: { cookie: `${AUTH_COOKIE}=${cookie}x` },
        });
        assert.equal(tampered.statusCode, 401);
    });

    it("fails an expired action code and the fourth attempt", async () => {
        const test = await setup();
        await post(test.app, "/auth/sign-up-start", { email: "ada@example.com", username: "adal" });
        const signUpCode = codeFrom(test.sent[0]?.html ?? "");
        await post(test.app, "/auth/sign-up-complete", {
            email: "ada@example.com",
            actionCode: signUpCode,
        });

        const signInStarted = await post(test.app, "/auth/sign-in-start", { email: "ada@example.com" });
        assert.equal(signInStarted.statusCode, 200);
        const signInCode = codeFrom(test.sent[1]?.html ?? "");
        const issuedAt = test.now();

        test.setNow(issuedAt + ACTION_CODE_TTL_MS + 1);
        const expired = await post(test.app, "/auth/sign-in-complete", {
            email: "ada@example.com",
            actionCode: signInCode,
        });
        assert.equal(expired.statusCode, 400);
        assert.deepEqual(expired.json(), { errors: [{ key: "errors.actionCodeExpired" }] });
        assert.equal(test.users.list()[0]?.actionCodeAttempts, 0);

        test.setNow(issuedAt);
        const incorrectCode = signInCode === "000000" ? "111111" : "000000";
        for (let attempt = 0; attempt < 3; attempt += 1) {
            const wrong = await post(test.app, "/auth/sign-in-complete", {
                email: "ada@example.com",
                actionCode: incorrectCode,
            });
            assert.equal(wrong.statusCode, 400);
            assert.deepEqual(wrong.json(), { errors: [{ key: "errors.actionCodeInvalid" }] });
        }

        const fourth = await post(test.app, "/auth/sign-in-complete", {
            email: "ada@example.com",
            actionCode: signInCode,
        });
        assert.equal(fourth.statusCode, 400);
        assert.deepEqual(fourth.json(), { errors: [{ key: "errors.actionCodeAttemptsExceeded" }] });
    });

    it("validates the body and keeps the sign-up conflict rules", async () => {
        const test = await setup();
        const badJson = await test.app.inject({
            method: "POST",
            url: "/auth/sign-up-start",
            headers: {
                "content-type": "application/json",
                "x-errant-request": "1",
            },
            payload: "{",
        });
        assert.equal(badJson.statusCode, 400);
        assert.deepEqual(badJson.json(), { errors: [{ key: "errors.validation" }] });

        const invalid = await post(test.app, "/auth/sign-up-start", { email: "nope", username: "ab" });
        assert.equal(invalid.statusCode, 400);
        assert.deepEqual(invalid.json(), {
            errors: [
                { key: "errors.validation", field: "email" },
                { key: "errors.validation", field: "username" },
            ],
        });

        await post(test.app, "/auth/sign-up-start", { email: "ada@example.com", username: "<b>x" });
        assert.match(test.sent[0]?.html ?? "", /&lt;b&gt;x/);
        assert.doesNotMatch(test.sent[0]?.html ?? "", /<b>x/);

        const pending = await post(test.app, "/auth/sign-up-start", {
            email: "ada@example.com",
            username: "<b>x",
        });
        assert.deepEqual(pending.json(), { errors: [{ key: "errors.signUpStarted" }] });

        const taken = await post(test.app, "/auth/sign-up-start", {
            email: "bea@example.com",
            username: "<b>x",
        });
        assert.deepEqual(taken.json(), { errors: [{ key: "errors.usernameInUse" }] });

        test.setNow(test.now() + ACTION_CODE_TTL_MS + 1);
        const restarted = await post(test.app, "/auth/sign-up-start", {
            email: "ada@example.com",
            username: "ada2",
        });
        assert.equal(restarted.statusCode, 200);
        assert.equal(test.users.list().length, 1);
        assert.equal(test.users.list()[0]?.username, "ada2");

        test.setFailEmail(true);
        const failed = await post(test.app, "/auth/sign-up-start", {
            email: "cy@example.com",
            username: "cycy",
        });
        assert.deepEqual(failed.json(), { errors: [{ key: "errors.emailSendFailed" }] });
        assert.equal(
            test.users.list().some((user) => user.email === "cy@example.com"),
            false,
        );
    });

    it("leaves the sign-in code in place when email sending fails", async () => {
        const test = await setup();
        await post(test.app, "/auth/sign-up-start", { email: "ada@example.com", username: "adal" });
        await post(test.app, "/auth/sign-up-complete", {
            email: "ada@example.com",
            actionCode: codeFrom(test.sent[0]?.html ?? ""),
        });

        test.setFailEmail(true);
        const failed = await post(test.app, "/auth/sign-in-start", { email: "ada@example.com" });
        assert.deepEqual(failed.json(), { errors: [{ key: "errors.emailSendFailed" }] });
        assert.ok(test.users.list()[0]?.actionCodeHash);
    });
});
