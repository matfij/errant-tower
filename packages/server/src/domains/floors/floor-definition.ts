import type { FloorDomain, FloorGuid, FloorTile, ItemGuid } from "@errant/shared";

import type { EnemyGuid } from "../enemies/enemy-definition.ts";

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

export type FloorEnemy = {
    guid: EnemyGuid;
    chance: number;
};

export type FloorTreasure = {
    guid: ItemGuid;
    chance: number;
};
