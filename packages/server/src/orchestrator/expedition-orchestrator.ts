import type { DomainFloors, FloorGuid, GetExpeditionResponse } from "@errant/shared";

import { EquipmentService } from "../domains/equipment/equipment-service.ts";
import { ExpeditionService } from "../domains/expedition/expedition-service.ts";
import { StatisticsService } from "../domains/statistics/statistics-service.ts";

export class ExpeditionOrchestrator {
    private readonly expeditionService: ExpeditionService;
    private readonly statisticsService: StatisticsService;
    private readonly equipmentService: EquipmentService;

    constructor(
        expeditionService: ExpeditionService,
        statisticsService: StatisticsService,
        equipmentService: EquipmentService,
    ) {
        this.expeditionService = expeditionService;
        this.statisticsService = statisticsService;
        this.equipmentService = equipmentService;
    }

    async getFloors(userId: string): Promise<DomainFloors[]> {
        return this.expeditionService.getFloors(userId);
    }

    async startExpedition(userId: string, floorGuid: FloorGuid): Promise<void> {
        const equipment = await this.equipmentService.getEquipmentList(userId);
        const battleStatistics = await this.statisticsService.getUserBattleStatistics(userId, equipment);
        await this.expeditionService.startExpedition(userId, floorGuid, battleStatistics);
    }

    async getExpedition(userId: string): Promise<GetExpeditionResponse> {
        return this.expeditionService.getExpedition(userId);
    }
}
