using ErrantTowerServer.Domains.Statistics;

namespace ErrantTowerServer.Domains.Enemy;

public readonly record struct Enemy
{
    public EnemyGuid Guid { get; init; }
    public string Name { get; init; }
    public EnemyRace Race { get; init; }
    public string? Title { get; init; }
    public BattleStatistics Statistics { get; init; }

    // TODO - loots
}

public enum EnemyRace
{
    Vermin = 1,
    Feline = 2,
    Beast = 3,
    Reptile = 4,
    Human = 5,
    Mechanical = 100,
    Spirit = 101,
    Dragon = 102,
}
