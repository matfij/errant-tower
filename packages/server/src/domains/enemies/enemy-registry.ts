import { HttpError } from "../../common/http/errors.ts";
import { dungeonEnemies } from "./data/dungeon-enemies.ts";
import { EnemyGuid, type Enemy } from "./enemy-definition.ts";

export const enemies = {
    [EnemyGuid.Ratter]: dungeonEnemies.ratter,
    [EnemyGuid.Chembr]: dungeonEnemies.chembr,
    [EnemyGuid.Kerramid]: dungeonEnemies.kerramid,
    [EnemyGuid.Glowpede]: dungeonEnemies.glowpede,
    [EnemyGuid.Scrapper]: dungeonEnemies.scrapper,
    [EnemyGuid.Boarus]: dungeonEnemies.boarus,
    [EnemyGuid.Pigon]: dungeonEnemies.pigon,
    [EnemyGuid.Morus]: dungeonEnemies.morus,
    [EnemyGuid.Wisker]: dungeonEnemies.wisker,
    [EnemyGuid.Regewur]: dungeonEnemies.regewur,
} satisfies Record<EnemyGuid, Enemy>;

export const getEnemy = (guid: string): Enemy => {
    if (!isEnemyGuid(guid)) {
        throw new HttpError("errors.enemyNotDefined");
    }
    return enemies[guid];
};

const isEnemyGuid = (guid: string): guid is EnemyGuid => Object.hasOwn(enemies, guid);
