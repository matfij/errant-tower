using System.Collections.Frozen;
using ErrantTowerServer.Common;

namespace ErrantTowerServer.Domains.Enemy;

public static class EnemyRegistry
{
    private static readonly FrozenDictionary <EnemyGuid, Enemy> _enemies = new Dictionary<EnemyGuid, Enemy>
    {
        { EnemyGuid.Ratter, Data.DungeonEnemies.ratter },
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
    Boarous = 105,
}
