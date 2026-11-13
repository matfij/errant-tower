import type { ItemGuid } from "./items.ts";
import type { BattleStatistics } from "./statistics.ts";

export enum FloorGuid {
    // Dungeon
    Floor1 = "DungeonFloor1",
    Floor2 = "DungeonFloor2",
    Floor3 = "DungeonFloor3",
}

export enum FloorDomain {
    Dungeon = "Dungeon1",
    Forest = "Forest2",
}

export enum FloorTileType {
    Start = "Start",
    Route = "Route",
    Wall = "Wall",
    Battle = "Battle",
    Treasure = "Treasure",
    NPC = "NPC",
    Finish = "Finish",
}

export type FloorTile = {
    x: number;
    y: number;
    type: FloorTileType;
};

export type FloorTeaser = {
    isUnlocked: boolean;
    guid: FloorGuid;
};

export type DomainFloors = {
    isUnlocked: boolean;
    domain: FloorDomain;
    floors: FloorTeaser[];
};

export type GetFloorsResponse = {
    domainFloors: DomainFloors[];
};

export type StartExpeditionRequest = {
    floorGuid: FloorGuid;
};

export type GetExpeditionResponse = {
    floorGuid: FloorGuid;
    floorImageUrl: string;
    battleId: string | null;
    maxInitiative: number;
    initiative: number;
    statistics: BattleStatistics;
    x: number;
    y: number;
    floorTiles: FloorTile[];
};

export enum MoveDirection {
    Up = 1,
    Down = 2,
    Left = 3,
    Right = 4,
}

export type GainedItem = {
    itemGuid: ItemGuid;
    quantity: number;
};

export type ExpeditionSummary = {
    isSuccess: boolean;
    hasFinished: boolean;
    gainedSilver: number;
    gainedItems: GainedItem[];
    gainedAttributePoints: number;
    gainedSkillPoints: number;
};

export type MoveResult = {
    x: number;
    y: number;
    initiative: number;
    battleId: string | null;
    summary: ExpeditionSummary | null;
};

export type MoveMessage = {
    type: "move";
    direction: MoveDirection;
};

export type MoveReply = {
    type: "moved";
    x: number;
    y: number;
    initiative: number;
    battleId: string | null;
    summary: ExpeditionSummary | null;
};

export type ExpeditionErrorMessage = {
    type: "error";
    key: string;
};
