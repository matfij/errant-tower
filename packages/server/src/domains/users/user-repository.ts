import { Int32, Long, type Collection } from "mongodb";

import { readNumber, toInt32 } from "../../db/db-utils.ts";
import type { UserEntity } from "./user-entity.ts";

export type UserDocument = {
    _id: string;
    Email: string;
    Username: string;
    ActionCodeHash: string | null;
    ActionCodeExpiresAt: Long | number | null;
    ActionCodeAttempts: Int32 | number | null;
    IsConfirmed: boolean;
    SessionId?: string | null;
};

export type UserRepository = {
    findById(id: string): Promise<UserEntity | null>;
    findByEmail(email: string): Promise<UserEntity | null>;
    findByUsername(username: string): Promise<UserEntity | null>;
    insert(user: UserEntity): Promise<void>;
    replace(user: UserEntity): Promise<void>;
    delete(id: string): Promise<void>;
};

export class MongoUserRepository implements UserRepository {
    constructor(private readonly usersCollection: Collection<UserDocument>) {}

    async findById(id: string): Promise<UserEntity | null> {
        const document = await this.usersCollection.findOne({ _id: id });
        return document === null ? null : MongoUserRepository.toUserEntity(document);
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        const document = await this.usersCollection.findOne({ Email: email });
        return document === null ? null : MongoUserRepository.toUserEntity(document);
    }

    async findByUsername(username: string): Promise<UserEntity | null> {
        const document = await this.usersCollection.findOne({ Username: username });
        return document === null ? null : MongoUserRepository.toUserEntity(document);
    }

    async insert(user: UserEntity): Promise<void> {
        await this.usersCollection.insertOne(MongoUserRepository.toUserDocument(user));
    }

    async replace(user: UserEntity): Promise<void> {
        const result = await this.usersCollection.replaceOne(
            { _id: user.id },
            MongoUserRepository.toUserDocument(user),
        );
        if (result.matchedCount === 0) {
            throw new Error("errors.userUpdateFailed");
        }
    }

    async delete(id: string): Promise<void> {
        const result = await this.usersCollection.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
            throw new Error("errors.userDeleteFailed");
        }
    }

    private static toUserDocument(user: UserEntity): UserDocument {
        const document: UserDocument = {
            _id: user.id,
            Email: user.email,
            Username: user.username,
            ActionCodeHash: user.actionCodeHash,
            ActionCodeExpiresAt:
                user.actionCodeExpiresAt === null ? null : Long.fromNumber(user.actionCodeExpiresAt),
            ActionCodeAttempts: user.actionCodeAttempts === null ? null : toInt32(user.actionCodeAttempts),
            IsConfirmed: user.isConfirmed,
        };

        if (user.sessionId !== null) {
            document.SessionId = user.sessionId;
        }

        return document;
    }

    private static toUserEntity(document: UserDocument): UserEntity {
        return {
            id: document._id,
            email: document.Email,
            username: document.Username,
            actionCodeHash: document.ActionCodeHash,
            actionCodeExpiresAt: readNumber(document.ActionCodeExpiresAt),
            actionCodeAttempts: readNumber(document.ActionCodeAttempts),
            isConfirmed: document.IsConfirmed,
            sessionId: document.SessionId ?? null,
        };
    }
}
