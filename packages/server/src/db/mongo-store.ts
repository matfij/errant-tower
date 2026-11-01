import { randomUUID } from "node:crypto";

import { MongoClient, MongoServerError, type Collection } from "mongodb";

import {
    initialCharacterDocuments,
    userDocument,
    userFromDocument,
    type StoredDocument,
} from "./documents.ts";
import { DuplicateUserField, type UserStore } from "./user-store.ts";

export async function connectMongo(options: {
    uri: string;
    database: string;
}): Promise<{ users: UserStore; close: () => Promise<void> }> {
    const client = new MongoClient(options.uri);
    await client.connect();
    const database = client.db(options.database);
    const users = database.collection<StoredDocument>("Users");
    const progresses = database.collection<StoredDocument>("Progresses");
    const statistics = database.collection<StoredDocument>("Statistics");
    const equipments = database.collection<StoredDocument>("Equipments");

    await users.createIndex({ Email: 1 }, { unique: true });
    await users.createIndex({ Username: 1 }, { unique: true });

    return {
        users: createMongoUserStore({ users, progresses, statistics, equipments }),
        close: () => client.close(),
    };
}

function createMongoUserStore(collections: {
    users: Collection<StoredDocument>;
    progresses: Collection<StoredDocument>;
    statistics: Collection<StoredDocument>;
    equipments: Collection<StoredDocument>;
}): UserStore {
    return {
        async findById(id) {
            const document = await collections.users.findOne({ _id: id });
            return document === null ? null : userFromDocument(document);
        },
        async findByEmail(email) {
            const document = await collections.users.findOne({ Email: email });
            return document === null ? null : userFromDocument(document);
        },
        async findByUsername(username) {
            const document = await collections.users.findOne({ Username: username });
            return document === null ? null : userFromDocument(document);
        },
        async insert(user) {
            try {
                await collections.users.insertOne(userDocument(user));
            } catch (error) {
                throw mapDuplicate(error);
            }
        },
        async replace(user) {
            const result = await collections.users.replaceOne({ _id: user.id }, userDocument(user));
            if (result.matchedCount === 0) {
                throw new Error("errors.userUpdateFailed");
            }
        },
        async delete(id) {
            const result = await collections.users.deleteOne({ _id: id });
            if (result.deletedCount === 0) {
                throw new Error("errors.userDeleteFailed");
            }
        },
        async insertInitial(userId, username) {
            const documents = initialCharacterDocuments(userId, username, {
                progressId: randomUUID(),
                statisticsId: randomUUID(),
                equipmentId: randomUUID(),
            });
            await collections.progresses.insertOne(documents.progress);
            await collections.statistics.insertOne(documents.statistics);
            await collections.equipments.insertOne(documents.equipment);
        },
    };
}

function mapDuplicate(error: unknown): unknown {
    if (!(error instanceof MongoServerError) || error.code !== 11000) {
        return error;
    }

    const pattern = error.keyPattern ?? {};
    if ("Username" in pattern) {
        return new DuplicateUserField("username");
    }
    return new DuplicateUserField("email");
}
