import { ACTION_CODE_ATTEMPTS, ACTION_CODE_TTL_MS } from "../config.ts";
import type { UserRecord, UserStore } from "../db/user-store.ts";
import { DuplicateUserField } from "../db/user-store.ts";
import type { EmailSender } from "../email/resend.ts";
import { HttpError } from "../http/errors.ts";
import { actionCodeMatches, hashActionCode } from "./action-code.ts";
import { signInEmail, signUpEmail } from "./email-templates.ts";

export type AuthService = {
    startSignUp(email: string, username: string): Promise<void>;
    completeSignUp(email: string, actionCode: string): Promise<UserRecord>;
    startSignIn(email: string): Promise<void>;
    completeSignIn(email: string, actionCode: string): Promise<UserRecord>;
};

type Logger = {
    error(object: Record<string, unknown>, message: string): void;
};

export function createAuthService(deps: {
    users: UserStore;
    emails: EmailSender;
    now: () => number;
    newId: () => string;
    newActionCode: () => string;
    log: Logger;
}): AuthService {
    return {
        async startSignUp(email, username) {
            const existing = await deps.users.findByEmail(email);
            const restart = existing !== null && !existing.isConfirmed && isExpired(existing, deps.now());
            if (!restart && existing !== null) {
                throw new HttpError(400, [
                    { key: existing.isConfirmed ? "errors.emailInUse" : "errors.signUpStarted" },
                ]);
            }

            const usernameOwner = await deps.users.findByUsername(username);
            if (usernameOwner !== null && usernameOwner.id !== existing?.id) {
                throw new HttpError(400, [{ key: "errors.usernameInUse" }]);
            }

            if (restart && existing !== null) {
                await deps.users.delete(existing.id);
            }

            const actionCode = deps.newActionCode();
            const user: UserRecord = {
                id: deps.newId(),
                email,
                username,
                actionCodeHash: hashActionCode(actionCode),
                actionCodeAttempts: 0,
                actionCodeExpiresAt: deps.now() + ACTION_CODE_TTL_MS,
                isConfirmed: false,
                sessionId: null,
            };

            try {
                await deps.users.insert(user);
            } catch (error) {
                if (error instanceof DuplicateUserField) {
                    throw new HttpError(400, [
                        { key: error.field === "username" ? "errors.usernameInUse" : "errors.emailInUse" },
                    ]);
                }
                throw error;
            }

            try {
                await deps.emails.send(
                    user.email,
                    "Welcome to Errant Tower",
                    signUpEmail(user.username, actionCode),
                );
            } catch (error) {
                deps.log.error({ err: error, email: user.email }, "Failed to send sign-up email");
                await deps.users.delete(user.id);
                throw new HttpError(400, [{ key: "errors.emailSendFailed" }]);
            }
        },

        async completeSignUp(email, actionCode) {
            const user = await deps.users.findByEmail(email);
            if (user === null) {
                throw new HttpError(400, [{ key: "errors.userNotFound" }]);
            }
            if (user.isConfirmed) {
                throw new HttpError(400, [{ key: "errors.userAlreadyConfirmed" }]);
            }

            await verifyActionCode(deps, user, actionCode);
            user.isConfirmed = true;
            clearActionCode(user);
            user.sessionId = deps.newId();
            await deps.users.replace(user);
            await deps.users.insertInitial(user.id, user.username);
            return user;
        },

        async startSignIn(email) {
            const user = await confirmedUser(deps.users, email);
            const actionCode = deps.newActionCode();
            user.actionCodeHash = hashActionCode(actionCode);
            user.actionCodeAttempts = 0;
            user.actionCodeExpiresAt = deps.now() + ACTION_CODE_TTL_MS;
            await deps.users.replace(user);

            try {
                await deps.emails.send(
                    user.email,
                    "Errant Tower Sign-In Code",
                    signInEmail(user.username, actionCode),
                );
            } catch (error) {
                deps.log.error({ err: error, email: user.email }, "Failed to send sign-in email");
                throw new HttpError(400, [{ key: "errors.emailSendFailed" }]);
            }
        },

        async completeSignIn(email, actionCode) {
            const user = await confirmedUser(deps.users, email);
            await verifyActionCode(deps, user, actionCode);
            clearActionCode(user);
            user.sessionId = deps.newId();
            await deps.users.replace(user);
            return user;
        },
    };
}

async function confirmedUser(users: UserStore, email: string): Promise<UserRecord> {
    const user = await users.findByEmail(email);
    if (user === null) {
        throw new HttpError(400, [{ key: "errors.userNotFound" }]);
    }
    if (!user.isConfirmed) {
        throw new HttpError(400, [{ key: "errors.userNotConfirmed" }]);
    }
    return user;
}

async function verifyActionCode(
    deps: { users: UserStore; now: () => number },
    user: UserRecord,
    actionCode: string,
): Promise<void> {
    if (user.actionCodeHash === null) {
        throw new HttpError(400, [{ key: "errors.actionCodeNotSet" }]);
    }
    if (isExpired(user, deps.now())) {
        throw new HttpError(400, [{ key: "errors.actionCodeExpired" }]);
    }
    if ((user.actionCodeAttempts ?? 0) >= ACTION_CODE_ATTEMPTS) {
        throw new HttpError(400, [{ key: "errors.actionCodeAttemptsExceeded" }]);
    }
    if (!actionCodeMatches(actionCode, user.actionCodeHash)) {
        user.actionCodeAttempts = (user.actionCodeAttempts ?? 0) + 1;
        await deps.users.replace(user);
        throw new HttpError(400, [{ key: "errors.actionCodeInvalid" }]);
    }
}

function clearActionCode(user: UserRecord): void {
    user.actionCodeHash = null;
    user.actionCodeAttempts = null;
    user.actionCodeExpiresAt = null;
}

function isExpired(user: UserRecord, now: number): boolean {
    return user.actionCodeExpiresAt !== null && user.actionCodeExpiresAt < now;
}
