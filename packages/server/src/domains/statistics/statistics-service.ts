import { UserAttribute } from "@errant/shared";

import { HttpError } from "../../common/http/errors.ts";
import { UtilsService } from "../../common/utils-service.ts";
import type { StatisticsEntity } from "./statistics-entity.ts";
import type { StatisticsRepository } from "./statistics-repository.ts";

export class StatisticsService {
    private readonly initialAttribute = 10;
    private readonly initialPoints = 10;

    private readonly statisticsRepository: StatisticsRepository;

    constructor(statisticsRepository: StatisticsRepository) {
        this.statisticsRepository = statisticsRepository;
    }

    async createInitial(userId: string): Promise<void> {
        const statistics: StatisticsEntity = {
            id: UtilsService.newId(),
            userId,
            attributePoints: this.initialPoints,
            skillPoints: this.initialPoints,
            strength: this.initialAttribute,
            dexterity: this.initialAttribute,
            constitution: this.initialAttribute,
            spirit: this.initialAttribute,
            learnedSkills: [],
        };
        await this.statisticsRepository.create(statistics);
    }

    async getStatistics(userId: string): Promise<StatisticsEntity> {
        const statistics = await this.statisticsRepository.readByUserId(userId);
        if (statistics === null) {
            throw new HttpError("errors.statisticsNotFound");
        }
        return statistics;
    }

    async extendAttribute(userId: string, attribute: UserAttribute): Promise<StatisticsEntity> {
        const statistics = await this.getStatistics(userId);
        if (statistics.attributePoints < 1) {
            throw new HttpError("errors.notEnoughAttributePoints");
        }

        switch (attribute) {
            case UserAttribute.Strength:
                statistics.strength += 1;
                break;
            case UserAttribute.Dexterity:
                statistics.dexterity += 1;
                break;
            case UserAttribute.Constitution:
                statistics.constitution += 1;
                break;
            case UserAttribute.Spirit:
                statistics.spirit += 1;
                break;
        }
        statistics.attributePoints -= 1;
        await this.statisticsRepository.update(statistics);
        return statistics;
    }
}
