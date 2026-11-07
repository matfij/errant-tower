import { ItemGuid, ItemSlot, type GetEquipmentResponse, type Item } from "@errant/shared";
import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { RequestBodyService } from "../common/http/body.ts";
import type { BattleEquipment } from "../domains/equipment/equipment-definition.ts";
import { AuthSessionService } from "./auth-session-service.ts";
import { EquipmentOrchestrator } from "./equipment-orchestrator.ts";

export class EquipmentRoutes {
    private readonly equipmentOrchestrator: EquipmentOrchestrator;
    private readonly authSessionService: AuthSessionService;

    constructor(equipmentOrchestrator: EquipmentOrchestrator, authSessionService: AuthSessionService) {
        this.equipmentOrchestrator = equipmentOrchestrator;
        this.authSessionService = authSessionService;
    }

    register(app: FastifyInstance): void {
        app.get("/equipment/get-equipment", async (request, reply) => {
            const user = await this.authSessionService.requireUser(request, reply);
            const equipment = await this.equipmentOrchestrator.getEquipment(user.id);
            return toEquipmentResponse(equipment);
        });

        app.get("/equipment/get-bag", async (request, reply) => {
            const user = await this.authSessionService.requireUser(request, reply);
            const items = await this.equipmentOrchestrator.getBag(user.id);
            return {
                items: items.map((bagItem) => ({
                    item: toItemResponse(bagItem.item),
                    quantity: bagItem.quantity,
                })),
            };
        });

        app.post("/equipment/equip-item", async (request, reply) => {
            const user = await this.authSessionService.requireUser(request, reply);
            const body = RequestBodyService.parse(EquipmentRoutes.equipItemBody, request.body);
            const equipment = await this.equipmentOrchestrator.equipItem(user.id, body);
            return toEquipmentResponse(equipment);
        });

        app.post("/equipment/unequip-item", async (request, reply) => {
            const user = await this.authSessionService.requireUser(request, reply);
            const body = RequestBodyService.parse(EquipmentRoutes.unequipItemBody, request.body);
            const equipment = await this.equipmentOrchestrator.unequipItem(user.id, body.slot);
            return toEquipmentResponse(equipment);
        });
    }

    private static readonly equipItemBody = z.object({
        guid: z.nativeEnum(ItemGuid),
        slot: z.nativeEnum(ItemSlot),
    });

    private static readonly unequipItemBody = z.object({
        slot: z.nativeEnum(ItemSlot),
    });
}

const toItemResponse = (item: Item | null): Item | null => {
    if (item === null) {
        return null;
    }
    return {
        guid: item.guid,
        name: item.name,
        description: item.description,
        imageUrl: item.imageUrl,
        type: item.type,
        rarity: item.rarity,
        price: item.price,
        isStackable: item.isStackable,
        statistics:
            item.statistics === null
                ? null
                : {
                      speed: item.statistics.speed,
                      maxHealthPoints: item.statistics.maxHealthPoints,
                      healthPoints: item.statistics.healthPoints,
                      maxManaPoints: item.statistics.maxManaPoints,
                      manaPoints: item.statistics.manaPoints,
                      maxEnergyPoints: item.statistics.maxEnergyPoints,
                      energyPoints: item.statistics.energyPoints,
                      physicalAttack: item.statistics.physicalAttack,
                      magicalAttack: item.statistics.magicalAttack,
                      physicalDefense: item.statistics.physicalDefense,
                      magicalDefense: item.statistics.magicalDefense,
                      physicalAbsorption: item.statistics.physicalAbsorption,
                      magicalAbsorption: item.statistics.magicalAbsorption,
                      criticalChance: item.statistics.criticalChance,
                      physicalCriticalPower: item.statistics.physicalCriticalPower,
                      magicalCriticalPower: item.statistics.magicalCriticalPower,
                      punctureChance: item.statistics.punctureChance,
                      dodgeChance: item.statistics.dodgeChance,
                      parryChance: item.statistics.parryChance,
                      blockChance: item.statistics.blockChance,
                      blockPower: item.statistics.blockPower,
                      counterChance: item.statistics.counterChance,
                      healthRegen: item.statistics.healthRegen,
                      manaRegen: item.statistics.manaRegen,
                      energyRegen: item.statistics.energyRegen,
                  },
        requirements:
            item.requirements === null
                ? null
                : {
                      strength: item.requirements.strength,
                      dexterity: item.requirements.dexterity,
                      constitution: item.requirements.constitution,
                      spirit: item.requirements.spirit,
                  },
    };
};

const toEquipmentResponse = (equipment: BattleEquipment): GetEquipmentResponse => {
    return {
        headgear: toItemResponse(equipment.headgear),
        armor: toItemResponse(equipment.armor),
        footwear: toItemResponse(equipment.footwear),
        charm: toItemResponse(equipment.charm),
        rightHand: toItemResponse(equipment.rightHand),
        leftHand: toItemResponse(equipment.leftHand),
    };
};
