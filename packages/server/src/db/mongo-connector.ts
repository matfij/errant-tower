import { MongoClient } from "mongodb";

import {
    MongoStatisticsRepository,
    type StatisticsDocument,
    type StatisticsRepository,
} from "../domains/statistics/statistics-repository.ts";
import {
    MongoUserRepository,
    type UserDocument,
    type UserRepository,
} from "../domains/users/user-repository.ts";

export class MongoConnector {
    static async connect(options: { uri: string; database: string }): Promise<{
        userRepository: UserRepository;
        statisticsRepository: StatisticsRepository;
        close: () => Promise<void>;
    }> {
        const client = new MongoClient(options.uri);
        await client.connect();
        const database = client.db(options.database);

        const users = database.collection<UserDocument>("Users");
        await users.createIndex({ Email: 1 }, { unique: true }, undefined);
        await users.createIndex({ Username: 1 }, { unique: true }, undefined);

        const statistics = database.collection<StatisticsDocument>("Statistics");

        const userRepository = new MongoUserRepository(users);
        const statisticsRepository = new MongoStatisticsRepository(statistics);

        return {
            userRepository,
            statisticsRepository,
            close: () => client.close(),
        };
    }
}
