import type { ItemGuid } from "@errant/shared";
import { Int32, type Collection } from "mongodb";

import { HttpError } from "../../common/http/errors.ts";
import { toInt32 } from "../../db/db-utils.ts";
import type { EquipmentEntity } from "./equipment-entity.ts";

export type EquipmentDocument = {
    _id: string;
    UserId: string;
    Silver: Int32 | number;
    Bag: BagItemDocument[];
    Headgear: ItemGuid | null;
    Armor: ItemGuid | null;
    Footwear: ItemGuid | null;
    Charm: ItemGuid | null;
    RightHand: ItemGuid | null;
    LeftHand: ItemGuid | null;
};

export type BagItemDocument = {
    ItemGuid: ItemGuid;
    Quantity: Int32 | number;
};

export type EquipmentRepository = {
    create(equipment: EquipmentEntity): Promise<void>;
    readByUserId(userId: string): Promise<EquipmentEntity | null>;
    update(equipment: EquipmentEntity): Promise<void>;
};

export class MongoEquipmentRepository implements EquipmentRepository {
    private readonly equipmentCollection: Collection<EquipmentDocument>;

    constructor(equipmentCollection: Collection<EquipmentDocument>) {
        this.equipmentCollection = equipmentCollection;
    }

    async create(equipment: EquipmentEntity): Promise<void> {
        await this.equipmentCollection.insertOne(MongoEquipmentRepository.toEquipmentDocument(equipment));
    }

    async readByUserId(userId: string): Promise<EquipmentEntity | null> {
        const document = await this.equipmentCollection.findOne({ UserId: userId });
        return MongoEquipmentRepository.toEquipmentEntity(document);
    }

    async update(equipment: EquipmentEntity): Promise<void> {
        const result = await this.equipmentCollection.replaceOne(
            { _id: equipment.id },
            MongoEquipmentRepository.toEquipmentDocument(equipment),
        );
        if (result.matchedCount === 0) {
            throw new HttpError("errors.equipmentNotFound");
        }
    }

    private static toEquipmentDocument(equipment: EquipmentEntity): EquipmentDocument {
        return {
            _id: equipment.id,
            UserId: equipment.userId,
            Silver: toInt32(equipment.silver),
            Bag: equipment.bag.map((item) => ({
                ItemGuid: item.itemGuid,
                Quantity: toInt32(item.quantity),
            })),
            Headgear: equipment.headgear,
            Armor: equipment.armor,
            Footwear: equipment.footwear,
            Charm: equipment.charm,
            RightHand: equipment.rightHand,
            LeftHand: equipment.leftHand,
        };
    }

    private static toEquipmentEntity(document: EquipmentDocument | null): EquipmentEntity | null {
        if (document === null) {
            return null;
        }
        return {
            id: document._id,
            userId: document.UserId,
            silver: document.Silver.valueOf(),
            bag: document.Bag.map((item) => ({
                itemGuid: item.ItemGuid,
                quantity: item.Quantity.valueOf(),
            })),
            headgear: document.Headgear,
            armor: document.Armor,
            footwear: document.Footwear,
            charm: document.Charm,
            rightHand: document.RightHand,
            leftHand: document.LeftHand,
        };
    }
}
