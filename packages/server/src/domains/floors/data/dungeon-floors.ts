import { FloorDomain, FloorGuid, ItemGuid } from "@errant/shared";

import { EnemyGuid } from "../../enemies/enemy-definition.ts";
import { defineFloor } from "../floor-utils.ts";
import { readFloorTiles } from "./floor-tiles.ts";

export const dungeonFloors = {
    /*
     * Dungeon
     */
    floor1: defineFloor({
        guid: FloorGuid.Floor1,
        domain: FloorDomain.Dungeon,
        imageUrl: "floor-1.png",
        tilesUrl: "FloorTiles1.csv",
        enemies: [
            { guid: EnemyGuid.Ratter, chance: 0.2 },
            { guid: EnemyGuid.Chembr, chance: 0.2 },
            { guid: EnemyGuid.Kerramid, chance: 0.1 },
        ],
        battleChance: 0.05,
        specialEnemyChance: 0.45,
        specialEnemies: [{ guid: EnemyGuid.Scrapper, chance: 0.5 }],
        treasureChance: 0.45,
        treasureItemGuids: [
            { guid: ItemGuid.CopperBar, chance: 0.5 },
            { guid: ItemGuid.LeadBar, chance: 0.5 },
        ],
        treasureSilverMin: 10,
        treasureSilverMax: 20,
        startX: 60,
        startY: 460,
        tiles: readFloorTiles("FloorTiles1.csv"),
    }),
    floor2: defineFloor({
        guid: FloorGuid.Floor2,
        domain: FloorDomain.Dungeon,
        imageUrl: "floor-2.png",
        tilesUrl: "FloorTiles2.csv",
        enemies: [
            { guid: EnemyGuid.Pigon, chance: 0.2 },
            { guid: EnemyGuid.Chembr, chance: 0.2 },
            { guid: EnemyGuid.Kerramid, chance: 0.1 },
            { guid: EnemyGuid.Boarus, chance: 0.1 },
        ],
        battleChance: 0.06,
        specialEnemyChance: 0.5,
        specialEnemies: [
            { guid: EnemyGuid.Scrapper, chance: 0.5 },
            { guid: EnemyGuid.Glowpede, chance: 0.5 },
        ],
        treasureChance: 0.5,
        treasureItemGuids: [
            { guid: ItemGuid.CopperBar, chance: 0.5 },
            { guid: ItemGuid.LeadBar, chance: 0.1 },
            { guid: ItemGuid.Emerald, chance: 0.25 },
        ],
        treasureSilverMin: 12,
        treasureSilverMax: 22,
        startX: 0,
        startY: 0,
        tiles: [],
    }),
    floor3: defineFloor({
        guid: FloorGuid.Floor3,
        domain: FloorDomain.Dungeon,
        imageUrl: "floor-3.png",
        tilesUrl: "FloorTiles3.csv",
        enemies: [
            { guid: EnemyGuid.Pigon, chance: 0.2 },
            { guid: EnemyGuid.Wisker, chance: 0.1 },
            { guid: EnemyGuid.Regewur, chance: 0.1 },
            { guid: EnemyGuid.Boarus, chance: 0.1 },
        ],
        battleChance: 0.065,
        specialEnemyChance: 0.55,
        specialEnemies: [
            { guid: EnemyGuid.Glowpede, chance: 0.5 },
            { guid: EnemyGuid.Morus, chance: 0.5 },
        ],
        treasureChance: 0.55,
        treasureItemGuids: [
            { guid: ItemGuid.LeadBar, chance: 0.1 },
            { guid: ItemGuid.Emerald, chance: 0.25 },
            { guid: ItemGuid.ShinyEmerald, chance: 0.05 },
        ],
        treasureSilverMin: 14,
        treasureSilverMax: 25,
        startX: 0,
        startY: 0,
        tiles: [],
    }),
};
