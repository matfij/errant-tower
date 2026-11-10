import type { ItemGuid } from "@errant/shared";

import type { EnemyGuid } from "../enemies/enemy-definition.ts";

export enum FloorDomain {
    Dungeon = "Dungeon",
    Forest = "Forest",
}

export enum FloorGuid {
    // Dungeon
    Floor1 = "Floor1",
    Floor2 = "Floor2",
    Floor3 = "Floor3",
}

export type Floor = {
    guid: FloorGuid;
    domain: FloorDomain;
    imageUrl: string;
    tilesUrl: string;
    enemies: FloorEnemy[];
    battleChance: number;
    specialEnemyChance: number;
    specialEnemies: FloorEnemy[];
    treasureChance: number;
    treasureItemGuids: FloorTreasure[];
    treasureSilverMin: number;
    treasureSilverMax: number;
    startX: number;
    startY: number;
    tiles: FloorTile[];
};

export type FloorTile = {
    x: number;
    y: number;
    type: FloorTileType;
};

export type FloorEnemy = {
    guid: EnemyGuid;
    chance: number;
};

export type FloorTreasure = {
    guid: ItemGuid;
    chance: number;
};

export enum FloorTileType {
    Start = "Start",
    Route = "Route",
    Wall = "Wall",
    Battle = "Battle",
    Treasure = "Treasure",
    NPC = "NPC",
    Finish = "Finish",
}
