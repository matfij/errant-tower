import type { BattleStatistics, FloorDomain, FloorGuid, FloorTileType, ItemGuid } from "@errant/shared";
import { Int32, type Collection } from "mongodb";

import { HttpError } from "../../common/http/errors.ts";
import { toInt32 } from "../../db/db-utils.ts";
import type { EnemyGuid } from "../enemies/enemy-definition.ts";
import type { ExpeditionEntity, FloorTileInfo } from "./expedition-entity.ts";

export type ExpeditionDocument = {
    _id: string;
    UserId: string;
    Username: string;
    UnlockedFloor: FloorGuid;
    UnlockedDomain: FloorDomain;
    Stamina: Int32 | number;
    IsInExpedition: boolean;
    CurrentFloor: FloorGuid;
    Initiative: Int32 | number;
    MaxInitiative: Int32 | number;
    Adrenaline: Int32 | number;
    BattleId: string | null;
    GainedSilver: Int32 | number;
    GainedItems: GainedItemDocument[];
    Statistics: BattleStatistics | null;
    X: Int32 | number;
    Y: Int32 | number;
    FloorTiles: FloorTileInfoDocument[];
};

export type FloorTileInfoDocument = {
    X: Int32 | number;
    Y: Int32 | number;
    Type: FloorTileType;
    EnemyGuid: EnemyGuid | null;
    ItemGuid: ItemGuid | null;
    Silver: Int32 | number | null;
};

export type GainedItemDocument = {
    ItemGuid: ItemGuid;
    Quantity: Int32 | number;
};

export type ExpeditionRepository = {
    create(expedition: ExpeditionEntity): Promise<void>;
    readByUserId(userId: string): Promise<ExpeditionEntity | null>;
    update(expedition: ExpeditionEntity): Promise<void>;
};

export class MongoExpeditionRepository implements ExpeditionRepository {
    private readonly expeditionCollection: Collection<ExpeditionDocument>;

    constructor(expeditionCollection: Collection<ExpeditionDocument>) {
        this.expeditionCollection = expeditionCollection;
    }

    async create(expedition: ExpeditionEntity): Promise<void> {
        await this.expeditionCollection.insertOne(MongoExpeditionRepository.toExpeditionDocument(expedition));
    }

    async readByUserId(userId: string): Promise<ExpeditionEntity | null> {
        const document = await this.expeditionCollection.findOne({ UserId: userId });
        return MongoExpeditionRepository.toExpeditionEntity(document);
    }

    async update(expedition: ExpeditionEntity): Promise<void> {
        const result = await this.expeditionCollection.replaceOne(
            { _id: expedition.id },
            MongoExpeditionRepository.toExpeditionDocument(expedition),
        );
        if (result.matchedCount === 0) {
            throw new HttpError("errors.expeditionNotFound");
        }
    }

    private static toExpeditionDocument(expedition: ExpeditionEntity): ExpeditionDocument {
        return {
            _id: expedition.id,
            UserId: expedition.userId,
            Username: expedition.username,
            UnlockedFloor: expedition.unlockedFloor,
            UnlockedDomain: expedition.unlockedDomain,
            Stamina: toInt32(expedition.stamina),
            IsInExpedition: expedition.isInExpedition,
            CurrentFloor: expedition.currentFloor,
            Initiative: toInt32(expedition.initiative),
            MaxInitiative: toInt32(expedition.maxInitiative),
            Adrenaline: toInt32(expedition.adrenaline),
            BattleId: expedition.battleId,
            GainedSilver: toInt32(expedition.gainedSilver),
            GainedItems: expedition.gainedItems.map((item) => ({
                ItemGuid: item.itemGuid,
                Quantity: toInt32(item.quantity),
            })),
            Statistics: expedition.statistics,
            X: toInt32(expedition.x),
            Y: toInt32(expedition.y),
            FloorTiles: expedition.floorTiles.map(MongoExpeditionRepository.toFloorTileInfoDocument),
        };
    }

    private static toExpeditionEntity(document: ExpeditionDocument | null): ExpeditionEntity | null {
        if (document === null) {
            return null;
        }
        return {
            id: document._id,
            userId: document.UserId,
            username: document.Username,
            unlockedFloor: document.UnlockedFloor,
            unlockedDomain: document.UnlockedDomain,
            stamina: document.Stamina.valueOf(),
            isInExpedition: document.IsInExpedition,
            currentFloor: document.CurrentFloor,
            initiative: document.Initiative.valueOf(),
            maxInitiative: document.MaxInitiative.valueOf(),
            adrenaline: document.Adrenaline.valueOf(),
            battleId: document.BattleId,
            gainedSilver: document.GainedSilver.valueOf(),
            gainedItems: document.GainedItems.map((item) => ({
                itemGuid: item.ItemGuid,
                quantity: item.Quantity.valueOf(),
            })),
            statistics: document.Statistics,
            x: document.X.valueOf(),
            y: document.Y.valueOf(),
            floorTiles: document.FloorTiles.map(MongoExpeditionRepository.toFloorTileInfo),
        };
    }

    private static toFloorTileInfoDocument(tile: FloorTileInfo): FloorTileInfoDocument {
        return {
            X: toInt32(tile.x),
            Y: toInt32(tile.y),
            Type: tile.type,
            EnemyGuid: tile.enemyGuid,
            ItemGuid: tile.itemGuid,
            Silver: tile.silver === null ? null : toInt32(tile.silver),
        };
    }

    private static toFloorTileInfo(tile: FloorTileInfoDocument): FloorTileInfo {
        return {
            x: tile.X.valueOf(),
            y: tile.Y.valueOf(),
            type: tile.Type,
            enemyGuid: tile.EnemyGuid,
            itemGuid: tile.ItemGuid,
            silver: tile.Silver === null ? null : tile.Silver.valueOf(),
        };
    }
}
