import type { UserAttribute } from "@errant/shared";

import type { StatisticsEntity } from "../domains/statistics/statistics-entity.ts";
import { StatisticsService } from "../domains/statistics/statistics-service.ts";

export class StatisticsOrchestrator {
    private readonly statisticsService: StatisticsService;

    constructor(statisticsService: StatisticsService) {
        this.statisticsService = statisticsService;
    }

    async getAttributes(userId: string): Promise<StatisticsEntity> {
        return this.statisticsService.getStatistics(userId);
    }

    async extendAttribute(userId: string, attribute: UserAttribute): Promise<StatisticsEntity> {
        return this.statisticsService.extendAttribute(userId, attribute);
    }
}
