import type { BattleStatistics, SkillGuid, UserAttribute } from "@errant/shared";

import { EquipmentService } from "../domains/equipment/equipment-service.ts";
import { SkillsService } from "../domains/statistics/skills-service.ts";
import type { SkillTree } from "../domains/statistics/statistics-definition.ts";
import type { StatisticsEntity } from "../domains/statistics/statistics-entity.ts";
import { StatisticsService } from "../domains/statistics/statistics-service.ts";

export class StatisticsOrchestrator {
    private readonly statisticsService: StatisticsService;
    private readonly skillsService: SkillsService;
    private readonly equipmentService: EquipmentService;

    constructor(
        statisticsService: StatisticsService,
        skillsService: SkillsService,
        equipmentService: EquipmentService,
    ) {
        this.statisticsService = statisticsService;
        this.skillsService = skillsService;
        this.equipmentService = equipmentService;
    }

    async getAttributes(userId: string): Promise<StatisticsEntity> {
        return this.statisticsService.getStatistics(userId);
    }

    async getBattleStatistics(userId: string): Promise<BattleStatistics> {
        const equipment = await this.equipmentService.getEquipmentList(userId);
        return this.statisticsService.getUserBattleStatistics(userId, equipment);
    }

    async extendAttribute(userId: string, attribute: UserAttribute): Promise<StatisticsEntity> {
        return this.statisticsService.extendAttribute(userId, attribute);
    }

    async getSkillTree(userId: string): Promise<SkillTree> {
        return this.skillsService.getSkillTree(userId);
    }

    async learnSkill(userId: string, skillGuid: SkillGuid): Promise<SkillTree> {
        return this.skillsService.learnSkill(userId, skillGuid);
    }

    async resetSkills(userId: string): Promise<SkillTree> {
        return this.skillsService.resetSkills(userId);
    }
}
