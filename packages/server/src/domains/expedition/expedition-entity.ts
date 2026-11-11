import type { BattleStatistics, FloorDomain, FloorGuid, FloorTileType, ItemGuid } from "@errant/shared";

import type { EnemyGuid } from "../enemies/enemy-definition.ts";

export type ExpeditionEntity = {
    id: string;
    userId: string;
    username: string;
    unlockedFloor: FloorGuid;
    unlockedDomain: FloorDomain;
    stamina: number;
    isInExpedition: boolean;
    currentFloor: FloorGuid;
    initiative: number;
    maxInitiative: number;
    adrenaline: number;
    battleId: string | null;
    gainedSilver: number;
    gainedItems: GainedItem[];
    statistics: BattleStatistics | null;
    x: number;
    y: number;
    floorTiles: FloorTileInfo[];
};

export type FloorTileInfo = {
    x: number;
    y: number;
    type: FloorTileType;
    enemyGuid: EnemyGuid | null;
    itemGuid: ItemGuid | null;
    silver: number | null;
};

export type GainedItem = {
    itemGuid: ItemGuid;
    quantity: number;
};
