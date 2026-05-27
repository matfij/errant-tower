using ErrantTowerServer.Domains.Statistics;

namespace ErrantTowerServer.Domains.Enemy;

public readonly record struct Enemy
{
    public required EnemyGuid Guid { get; init; }
    public required string Name { get; init; }
    public required string ImageUrl { get; init; }
    public required EnemyRace Race { get; init; }
    public string? Title { get; init; }
    public required BattleStatistics Statistics { get; init; }

    // TODO - loots

    // TODO - skills
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
