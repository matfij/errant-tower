import { MongoClient } from "mongodb";

import {
    MongoBattleRepository,
    type BattleDocument,
    type BattleRepository,
} from "../domains/battles/battle-repository.ts";
import {
    MongoEquipmentRepository,
    type EquipmentDocument,
    type EquipmentRepository,
} from "../domains/equipment/equipment-repository.ts";
import {
    MongoExpeditionRepository,
    type ExpeditionDocument,
    type ExpeditionRepository,
} from "../domains/expedition/expedition-repository.ts";
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
        equipmentRepository: EquipmentRepository;
        expeditionRepository: ExpeditionRepository;
        battleRepository: BattleRepository;
        close: () => Promise<void>;
    }> {
        const client = new MongoClient(options.uri);
        await client.connect();
        const database = client.db(options.database);

        const users = database.collection<UserDocument>("Users");
        await users.createIndex({ Email: 1 }, { unique: true }, undefined);
        await users.createIndex({ Username: 1 }, { unique: true }, {});

        const statistics = database.collection<StatisticsDocument>("Statistics");
        await statistics.createIndex({ UserId: 1 }, { unique: true }, undefined);

        const equipment = database.collection<EquipmentDocument>("Equipments");
        await equipment.createIndex({ UserId: 1 }, { unique: true }, undefined);

        const expeditions = database.collection<ExpeditionDocument>("Expeditions");
        await expeditions.createIndex({ UserId: 1 }, { unique: true }, undefined);

        const battles = database.collection<BattleDocument>("Battles");
        await battles.createIndex({ UserId: 1 }, { unique: true }, undefined);

        const userRepository = new MongoUserRepository(users);
        const statisticsRepository = new MongoStatisticsRepository(statistics);
        const equipmentRepository = new MongoEquipmentRepository(equipment);
        const expeditionRepository = new MongoExpeditionRepository(expeditions);
        const battleRepository = new MongoBattleRepository(battles);

        return {
            userRepository,
            statisticsRepository,
            equipmentRepository,
            expeditionRepository,
            battleRepository,
            close: () => client.close(),
        };
    }
}
