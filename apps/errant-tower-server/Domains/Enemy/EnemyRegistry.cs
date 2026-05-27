using ErrantTowerServer.Common;

namespace ErrantTowerServer.Domains.Enemy;

public static class EnemyRegistry
{
    private static readonly IReadOnlyDictionary <EnemyGuid, Enemy> enemies = new Dictionary<EnemyGuid, Enemy>
    {
        { EnemyGuid.Ratter, Data.Enemies1.ratter },
    };

    public static Enemy GetEnemy(EnemyGuid guid)
    {
        if (!enemies.TryGetValue(guid, out var enemy))
        {
            throw new ApiException("errors.enemyNotDefined");
        }
        return enemy;
    }
}

public enum EnemyGuid
{
    Ratter = 100,
}
