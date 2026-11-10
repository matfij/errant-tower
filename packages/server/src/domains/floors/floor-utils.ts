import type { FloorDomain, FloorGuid, FloorTileType, ItemGuid } from "@errant/shared";

import type { EnemyGuid } from "../enemies/enemy-definition.ts";
import type { Floor } from "./floor-definition.ts";

type FloorDraft = {
    guid: FloorGuid;
    domain: FloorDomain;
    imageUrl: string;
    tilesUrl: string;
    enemies: {
        guid: EnemyGuid;
        chance: number;
    }[];
    battleChance: number;
    specialEnemyChance: number;
    specialEnemies: {
        guid: EnemyGuid;
        chance: number;
    }[];
    treasureChance: number;
    treasureItemGuids: {
        guid: ItemGuid;
        chance: number;
    }[];
    treasureSilverMin: number;
    treasureSilverMax: number;
    startX: number;
    startY: number;
    tiles: {
        x: number;
        y: number;
        type: FloorTileType;
    }[];
};

export const defineFloor = (draft: FloorDraft): Floor => {
    return {
        guid: draft.guid,
        domain: draft.domain,
        imageUrl: draft.imageUrl,
        tilesUrl: draft.tilesUrl,
        enemies: draft.enemies,
        battleChance: draft.battleChance,
        specialEnemyChance: draft.specialEnemyChance,
        specialEnemies: draft.specialEnemies,
        treasureChance: draft.treasureChance,
        treasureItemGuids: draft.treasureItemGuids,
        treasureSilverMin: draft.treasureSilverMin,
        treasureSilverMax: draft.treasureSilverMax,
        startX: draft.startX,
        startY: draft.startY,
        tiles: draft.tiles,
    };
};
