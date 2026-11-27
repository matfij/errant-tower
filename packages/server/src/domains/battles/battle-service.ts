import { EnemyRace, SkillGuid, type BattleSkill, type BattleStatistics } from "@errant/shared";

import { HttpError } from "../../common/http/errors.ts";
import { UtilsService } from "../../common/utils-service.ts";
import type { Enemy } from "../enemies/enemy-definition.ts";
import { getSkill } from "../skills/skill-registry.ts";
import { toBattleSkill } from "../statistics/skill-utils.ts";
import { BattleCalculator } from "./battle-calculator.ts";
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
        const existing = await this.battleRepository.readBy("userId", userId);
        if (existing !== null && !existing.isFinished) {
            throw new HttpError("errors.battleAlreadyStarted");
        }

        const battle: BattleEntity = {
            id: UtilsService.newId(),
            userId,
            isFinished: false,
            turnNumber: 0,
            logs: [],
            user: {
                name: username,
                imageUrl: this.userImageUrl,
                title: null,
                race: EnemyRace.Human,
                statistics: { ...userStatistics },
                initiative: userStatistics.speed,
                statuses: [],
                skills: skills,
            },
            enemy: {
                name: enemy.name,
                imageUrl: enemy.imageUrl,
                title: enemy.title,
                race: enemy.race,
                statistics: { ...enemy.statistics },
                initiative: enemy.statistics.speed,
                statuses: [],
                skills: enemy.skills.map((s) => toBattleSkill(getSkill(s), 1)),
            },
            enemySkillIndex: 0,
        };

        if (existing !== null) {
            await this.battleRepository.replace(battle);
        } else {
            await this.battleRepository.create(battle);
        }
        return battle;
    }

    async get(userId: string): Promise<BattleEntity> {
        const battle = await this.battleRepository.readBy("userId", userId);
        if (battle === null || battle.isFinished) {
            throw new HttpError("errors.notInBattle");
        }
        return battle;
    }

    async act(userId: string, skillGuid?: SkillGuid, _wait?: boolean, _escape?: boolean) {
        const battle = await this.battleRepository.readBy("userId", userId);

        if (!battle || battle.isFinished) {
            throw new HttpError("errors.notInBattle");
        }

        if (UtilsService.isNotNull(skillGuid)) {
            BattleCalculator.act(battle, skillGuid);
        }

        await this.battleRepository.update(battle.id, battle);

        return battle;
    }
}
