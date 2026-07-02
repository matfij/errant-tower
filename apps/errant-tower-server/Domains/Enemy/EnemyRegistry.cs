using System.Collections.Frozen;
using ErrantTowerServer.Common;

namespace ErrantTowerServer.Domains.Enemy;

public static class EnemyRegistry
{
    private static readonly FrozenDictionary<EnemyGuid, Enemy> _enemies = new Dictionary<EnemyGuid, Enemy>
    {
        { EnemyGuid.Ratter, Data.DungeonEnemies.ratter },
        { EnemyGuid.Chembr, Data.DungeonEnemies.chembr },
        { EnemyGuid.Kerramid, Data.DungeonEnemies.kerramid },
        { EnemyGuid.Glowpede, Data.DungeonEnemies.glowpede },
        { EnemyGuid.Scrapper, Data.DungeonEnemies.scrapper },
        { EnemyGuid.Boarus, Data.DungeonEnemies.boarus },
        { EnemyGuid.Pigon, Data.DungeonEnemies.pigon },
        { EnemyGuid.Morus, Data.DungeonEnemies.morus },
        { EnemyGuid.Wisker, Data.DungeonEnemies.wisker },
        { EnemyGuid.Regewur, Data.DungeonEnemies.regewur },
    }.ToFrozenDictionary();

    public static Enemy GetEnemy(EnemyGuid guid)
    {
        if (!_enemies.TryGetValue(guid, out var enemy))
        {
            throw new ApiException("errors.enemyNotDefined");
        }
        return enemy;
    }
}

public enum EnemyGuid
{
    Ratter = 100,
    Chembr = 101,
    Kerramid = 102,
    Glowpede = 103,
    Scrapper = 104,
    Boarus = 105,
    Pigon = 106,
    Morus = 107,
    Wisker = 108,
    Regewur = 109,
}
