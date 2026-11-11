import { EnemyRace, type BattleSkill, type BattleStatistics } from "@errant/shared";

import { HttpError } from "../../common/http/errors.ts";
import { UtilsService } from "../../common/utils-service.ts";
import type { Enemy } from "../enemies/enemy-definition.ts";
import type { BattleEntity } from "./battle-entity.ts";
import type { BattleRepository } from "./battle-repository.ts";

export class BattleService {
    private readonly userImageUrl = "saber.png";

    private readonly battleRepository: BattleRepository;

    constructor(battleRepository: BattleRepository) {
        this.battleRepository = battleRepository;
    }

    async start(
        userId: string,
        username: string,
        userStatistics: BattleStatistics,
        skills: BattleSkill[],
        enemy: Enemy,
    ): Promise<BattleEntity> {
        const existing = await this.battleRepository.readByUserId(userId);
        if (existing !== null && !existing.isFinished) {
            throw new HttpError("errors.battleAlreadyStarted");
        }

        const battle: BattleEntity = {
            id: UtilsService.newId(),
            userId,
            isFinished: false,
            turnNumber: 0,
            user: {
                name: username,
                imageUrl: this.userImageUrl,
                title: null,
                race: EnemyRace.Human,
                statistics: { ...userStatistics },
                statuses: [],
            },
            enemy: {
                name: enemy.name,
                imageUrl: enemy.imageUrl,
                title: enemy.title,
                race: enemy.race,
                statistics: { ...enemy.statistics },
                statuses: [],
            },
            skills: [...skills],
            logs: [],
        };

        if (existing !== null) {
            await this.battleRepository.update(battle);
        } else {
            await this.battleRepository.create(battle);
        }
        return battle;
    }

    async get(userId: string): Promise<BattleEntity> {
        const battle = await this.battleRepository.readByUserId(userId);
        if (battle === null || battle.isFinished) {
            throw new HttpError("errors.notInBattle");
        }
        return battle;
    }
}
