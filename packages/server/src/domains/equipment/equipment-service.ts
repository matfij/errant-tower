import {
    ItemGuid,
    ItemSlot,
    ItemType,
    type BagItemData,
    type EquipItemRequest,
    type Item,
    type ItemRequirements,
} from "@errant/shared";

import { HttpError } from "../../common/http/errors.ts";
import { UtilsService } from "../../common/utils-service.ts";
import { getItem } from "../items/item-registry.ts";
import type { UserAttributes } from "../statistics/statistics-definition.ts";
import type { BattleEquipment } from "./equipment-definition.ts";
import type { BagItem, EquipmentEntity } from "./equipment-entity.ts";
import type { EquipmentRepository } from "./equipment-repository.ts";

export class EquipmentService {
    private readonly equipmentRepository: EquipmentRepository;

    constructor(equipmentRepository: EquipmentRepository) {
        this.equipmentRepository = equipmentRepository;
    }

    async createInitial(userId: string): Promise<void> {
        const equipment: EquipmentEntity = {
            id: UtilsService.newId(),
            userId,
            silver: 0,
            bag: [
                { itemGuid: ItemGuid.WoodenSword, quantity: 1 },
                { itemGuid: ItemGuid.LeatherArmor, quantity: 1 },
                { itemGuid: ItemGuid.LeatherArmor, quantity: 1 },
                { itemGuid: ItemGuid.LeatherBoots, quantity: 1 },
                { itemGuid: ItemGuid.WoodenBow, quantity: 1 },
                { itemGuid: ItemGuid.WoodenStaff, quantity: 1 },
            ],
            headgear: null,
            armor: null,
            footwear: null,
            charm: null,
            rightHand: null,
            leftHand: null,
        };
        await this.equipmentRepository.create(equipment);
    }

    async awardItems(userId: string, silver: number, newItems: BagItem[]): Promise<void> {
        const equipment = await this.readEquipment(userId);
        equipment.silver += silver;

        for (const newItem of newItems) {
            const existing = equipment.bag.find((item) => item.itemGuid === newItem.itemGuid) ?? null;
            if (existing !== null && getItem(existing.itemGuid).isStackable) {
                existing.quantity += newItem.quantity;
            } else {
                equipment.bag.push(newItem);
            }
        }

        await this.equipmentRepository.update(equipment);
    }

    async getEquipment(userId: string): Promise<BattleEquipment> {
        const equipment = await this.readEquipment(userId);
        return this.toBattleEquipment(equipment);
    }

    async getEquipmentList(userId: string): Promise<Item[]> {
        const equipment = await this.getEquipment(userId);
        return [
            equipment.headgear,
            equipment.armor,
            equipment.footwear,
            equipment.charm,
            equipment.leftHand,
            equipment.rightHand,
        ].filter((item): item is Item => item !== null);
    }

    async getBag(userId: string): Promise<BagItemData[]> {
        const equipment = await this.readEquipment(userId);
        return equipment.bag.map((item) => ({
            item: getItem(item.itemGuid),
            quantity: item.quantity,
        }));
    }

    async equipItem(
        userId: string,
        request: EquipItemRequest,
        attributes: UserAttributes,
    ): Promise<BattleEquipment> {
        const equipment = await this.readEquipment(userId);
        const owned = equipment.bag.find((item) => item.itemGuid === request.guid) ?? null;
        if (owned === null) {
            throw new HttpError("errors.itemNotOwned");
        }

        const item = getItem(request.guid);
        if (!this.meetsRequirements(item.requirements, attributes)) {
            throw new HttpError("errors.insufficientAttributes");
        }
        if (!this.slotAccepts(item.type, request.slot)) {
            throw new HttpError("errors.incorrectEquipmentSlot");
        }

        const previous = this.getEquippedGuid(equipment, request.slot);
        if (previous !== null) {
            equipment.bag.push({ itemGuid: previous, quantity: 1 });
        }
        this.assignSlot(equipment, request.slot, item.guid);
        this.removeNonStackable(equipment.bag, item.guid);
        await this.equipmentRepository.update(equipment);
        return this.toBattleEquipment(equipment);
    }

    async unequipItem(userId: string, slot: ItemSlot): Promise<BattleEquipment> {
        const equipment = await this.readEquipment(userId);
        const previous = this.getEquippedGuid(equipment, slot);
        if (previous !== null) {
            this.assignSlot(equipment, slot, null);
            equipment.bag.push({ itemGuid: previous, quantity: 1 });
            await this.equipmentRepository.update(equipment);
        }
        return this.toBattleEquipment(equipment);
    }

    private async readEquipment(userId: string): Promise<EquipmentEntity> {
        const equipment = await this.equipmentRepository.readByUserId(userId);
        if (equipment === null) {
            throw new HttpError("errors.equipmentNotFound");
        }
        return equipment;
    }

    private toBattleEquipment(equipment: EquipmentEntity): BattleEquipment {
        return {
            headgear: this.getEquippedItem(equipment.headgear),
            armor: this.getEquippedItem(equipment.armor),
            footwear: this.getEquippedItem(equipment.footwear),
            charm: this.getEquippedItem(equipment.charm),
            rightHand: this.getEquippedItem(equipment.rightHand),
            leftHand: this.getEquippedItem(equipment.leftHand),
        };
    }

    private getEquippedItem(guid: ItemGuid | null): Item | null {
        if (guid === null) {
            return null;
        }
        return getItem(guid);
    }

    private meetsRequirements(requirements: ItemRequirements | null, attributes: UserAttributes): boolean {
        if (requirements === null) {
            return true;
        }
        return (
            (requirements.strength ?? 0) <= attributes.strength &&
            (requirements.dexterity ?? 0) <= attributes.dexterity &&
            (requirements.constitution ?? 0) <= attributes.constitution &&
            (requirements.spirit ?? 0) <= attributes.spirit
        );
    }

    private slotAccepts(type: ItemType, slot: ItemSlot): boolean {
        switch (type) {
            case ItemType.Helmet:
                return slot === ItemSlot.Headgear;
            case ItemType.Armor:
                return slot === ItemSlot.Armor;
            case ItemType.Boots:
                return slot === ItemSlot.Footwear;
            case ItemType.Charm:
                return slot === ItemSlot.Charm;
            case ItemType.Sword:
            case ItemType.Staff:
            case ItemType.Lance:
            case ItemType.Bow:
            case ItemType.Hammer:
            case ItemType.Shield:
            case ItemType.Dagger:
                return slot === ItemSlot.RightHand || slot === ItemSlot.LeftHand;
            case ItemType.Material:
            case ItemType.Consumable:
                return false;
        }
    }

    private getEquippedGuid(equipment: EquipmentEntity, slot: ItemSlot): ItemGuid | null {
        switch (slot) {
            case ItemSlot.Headgear:
                return equipment.headgear;
            case ItemSlot.Armor:
                return equipment.armor;
            case ItemSlot.Footwear:
                return equipment.footwear;
            case ItemSlot.Charm:
                return equipment.charm;
            case ItemSlot.RightHand:
                return equipment.rightHand;
            case ItemSlot.LeftHand:
                return equipment.leftHand;
        }
    }

    private assignSlot(equipment: EquipmentEntity, slot: ItemSlot, guid: ItemGuid | null): void {
        switch (slot) {
            case ItemSlot.Headgear:
                equipment.headgear = guid;
                break;
            case ItemSlot.Armor:
                equipment.armor = guid;
                break;
            case ItemSlot.Footwear:
                equipment.footwear = guid;
                break;
            case ItemSlot.Charm:
                equipment.charm = guid;
                break;
            case ItemSlot.RightHand:
                equipment.rightHand = guid;
                break;
            case ItemSlot.LeftHand:
                equipment.leftHand = guid;
                break;
        }
    }

    private removeNonStackable(bag: BagItem[], guid: ItemGuid): void {
        const index = bag.findIndex((item) => item.itemGuid === guid && item.quantity === 1);
        if (index >= 0) {
            bag.splice(index, 1);
        }
    }
}
