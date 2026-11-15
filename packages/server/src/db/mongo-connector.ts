import { MongoClient } from "mongodb";

import type { BattleEntity } from "../domains/battles/battle-entity.ts";
import { BattleRepository } from "../domains/battles/battle-repository.ts";
import type { EquipmentEntity } from "../domains/equipment/equipment-entity.ts";
import { EquipmentRepository } from "../domains/equipment/equipment-repository.ts";
import type { ExpeditionEntity } from "../domains/expedition/expedition-entity.ts";
import { ExpeditionRepository } from "../domains/expedition/expedition-repository.ts";
import type { StatisticsEntity } from "../domains/statistics/statistics-entity.ts";
import { StatisticsRepository } from "../domains/statistics/statistics-repository.ts";
import type { UserEntity } from "../domains/users/user-entity.ts";
import { UserRepository } from "../domains/users/user-repository.ts";
import { type DocumentOf } from "./mongo-repository.ts";

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

        const users = database.collection<DocumentOf<UserEntity>>("Users");
        await users.createIndex({ email: 1 }, { unique: true }, undefined);
        await users.createIndex({ username: 1 }, { unique: true }, {});

        const statistics = database.collection<DocumentOf<StatisticsEntity>>("Statistics");
        await statistics.createIndex({ userId: 1 }, { unique: true }, undefined);

        const equipment = database.collection<DocumentOf<EquipmentEntity>>("Equipments");
        await equipment.createIndex({ userId: 1 }, { unique: true }, undefined);

        const expeditions = database.collection<DocumentOf<ExpeditionEntity>>("Expeditions");
        await expeditions.createIndex({ userId: 1 }, { unique: true }, undefined);

        const battles = database.collection<DocumentOf<BattleEntity>>("Battles");
        await battles.createIndex({ userId: 1 }, { unique: true }, undefined);

        const userRepository = new UserRepository(users);
        const statisticsRepository = new StatisticsRepository(statistics);
        const equipmentRepository = new EquipmentRepository(equipment);
        const expeditionRepository = new ExpeditionRepository(expeditions);
        const battleRepository = new BattleRepository(battles);

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
