import type { BagItemData, EquipItemRequest, ItemSlot } from "@errant/shared";

import type { BattleEquipment } from "../domains/equipment/equipment-definition.ts";
import { EquipmentService } from "../domains/equipment/equipment-service.ts";
import { StatisticsService } from "../domains/statistics/statistics-service.ts";

export class EquipmentOrchestrator {
    private readonly equipmentService: EquipmentService;
    private readonly statisticsService: StatisticsService;

    constructor(equipmentService: EquipmentService, statisticsService: StatisticsService) {
        this.equipmentService = equipmentService;
        this.statisticsService = statisticsService;
    }

    async getEquipment(userId: string): Promise<BattleEquipment> {
        return this.equipmentService.getEquipment(userId);
    }

    async getBag(userId: string): Promise<BagItemData[]> {
        return this.equipmentService.getBag(userId);
    }

    async equipItem(userId: string, request: EquipItemRequest): Promise<BattleEquipment> {
        const attributes = await this.statisticsService.getStatistics(userId);
        return this.equipmentService.equipItem(userId, request, attributes);
    }

    async unequipItem(userId: string, slot: ItemSlot): Promise<BattleEquipment> {
        return this.equipmentService.unequipItem(userId, slot);
    }
}
