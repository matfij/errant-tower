import { MongoServerError } from "mongodb";

import { EmailService } from "../../common/email/email-service.ts";
import { HttpError } from "../../common/http/errors.ts";
import { LogService } from "../../common/log.ts";
import { UtilsService } from "../../common/utils-service.ts";
import { config } from "../../config.ts";
import { dbErrorCodes } from "../../db/db-utils.ts";
import { userEmailTemplates } from "./user-email-templates.ts";
import type { UserEntity } from "./user-entity.ts";
import type { UserRepository } from "./user-repository.ts";
import { UserUtilsService } from "./user-utils.ts";

export class UserService {
    private readonly userRepository: UserRepository;
    private readonly emailService: EmailService;

    constructor(userRepository: UserRepository, emailService: EmailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    async startSignUp(email: string, username: string): Promise<void> {
        const existing = await this.userRepository.findByEmail(email);
        const restart =
            existing !== null &&
            !existing.isConfirmed &&
            UserUtilsService.actionCodeExpired(existing.actionCodeExpiresAt, UtilsService.timeNow());
        if (!restart && existing !== null) {
            throw new HttpError(existing.isConfirmed ? "errors.emailInUse" : "errors.signUpStarted");
        }

        const usernameOwner = await this.userRepository.findByUsername(username);
        if (usernameOwner !== null && usernameOwner.id !== existing?.id) {
            throw new HttpError("errors.usernameInUse");
        }

        if (restart && existing !== null) {
            await this.userRepository.delete(existing.id);
        }

        const actionCode = UserUtilsService.generateActionCode();
        const user: UserEntity = {
            id: UtilsService.newId(),
            email,
            username,
            actionCodeHash: UserUtilsService.hashActionCode(actionCode),
            actionCodeAttempts: 0,
            actionCodeExpiresAt: UtilsService.timeNow() + config.actionCodeTtlMs,
            isConfirmed: false,
            sessionId: null,
        };

        try {
            await this.userRepository.insert(user);
        } catch (error) {
            if (error instanceof MongoServerError && error.code === dbErrorCodes.duplicatedKey) {
                const pattern = error.keyPattern ?? {};
                throw new HttpError("Username" in pattern ? "errors.usernameInUse" : "errors.emailInUse");
            }
            throw error;
        }

        try {
            const email = userEmailTemplates.signUp;
            await this.emailService.send(user.email, email.subject, email.html(user.username, actionCode));
        } catch (error) {
            LogService.error({ err: error, email: user.email }, "Failed to send sign-up email");
            await this.userRepository.delete(user.id);
            throw new HttpError("errors.emailSendFailed");
        }
    }

    async completeSignUp(email: string, actionCode: string): Promise<UserEntity> {
        const user = await this.userRepository.findByEmail(email);
        if (user === null) {
            throw new HttpError("errors.userNotFound");
        }
        if (user.isConfirmed) {
            throw new HttpError("errors.userAlreadyConfirmed");
        }

        await this.verifyActionCode(user, actionCode);
        user.isConfirmed = true;
        this.clearActionCode(user);
        user.sessionId = UtilsService.newId();
        await this.userRepository.replace(user);
        return user;
    }

    async startSignIn(email: string): Promise<void> {
        const user = await this.getConfirmedUser(email);
        const previous = {
            actionCodeHash: user.actionCodeHash,
            actionCodeAttempts: user.actionCodeAttempts,
            actionCodeExpiresAt: user.actionCodeExpiresAt,
        };
        const actionCode = UserUtilsService.generateActionCode();
        const actionCodeHash = UserUtilsService.hashActionCode(actionCode);
        user.actionCodeHash = actionCodeHash;
        user.actionCodeAttempts = 0;
        user.actionCodeExpiresAt = UtilsService.timeNow() + config.actionCodeTtlMs;
        await this.userRepository.replace(user);

        try {
            const email = userEmailTemplates.signIn;
            await this.emailService.send(user.email, email.subject, email.html(user.username, actionCode));
        } catch (error) {
            LogService.error({ err: error, email: user.email }, "Failed to send sign-in email");
            await this.userRepository.replace({ ...user, ...previous });
            throw new HttpError("errors.emailSendFailed");
        }
    }

    async completeSignIn(email: string, actionCode: string): Promise<UserEntity> {
        const user = await this.getConfirmedUser(email);
        await this.verifyActionCode(user, actionCode);
        this.clearActionCode(user);
        user.sessionId = UtilsService.newId();
        await this.userRepository.replace(user);
        return user;
    }

    private clearActionCode(user: UserEntity): void {
        user.actionCodeHash = null;
        user.actionCodeAttempts = null;
        user.actionCodeExpiresAt = null;
    }

    private async getConfirmedUser(email: string): Promise<UserEntity> {
        const user = await this.userRepository.findByEmail(email);
        if (user === null) {
            throw new HttpError("errors.userNotFound");
        }
        if (!user.isConfirmed) {
            throw new HttpError("errors.userNotConfirmed");
        }
        return user;
    }

    private async verifyActionCode(user: UserEntity, actionCode: string): Promise<void> {
        if (user.actionCodeHash === null) {
            throw new HttpError("errors.actionCodeNotSet");
        }
        if (UserUtilsService.actionCodeExpired(user.actionCodeExpiresAt, UtilsService.timeNow())) {
            throw new HttpError("errors.actionCodeExpired");
        }
        if ((user.actionCodeAttempts ?? 0) >= config.actionCodeAttempts) {
            throw new HttpError("errors.actionCodeAttemptsExceeded");
        }
        if (!UserUtilsService.actionCodeMatches(actionCode, user.actionCodeHash)) {
            user.actionCodeAttempts = (user.actionCodeAttempts ?? 0) + 1;
            await this.userRepository.replace(user);
            throw new HttpError("errors.actionCodeInvalid");
        }
    }
}
