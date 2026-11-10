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
