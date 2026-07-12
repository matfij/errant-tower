using ErrantTowerServer.Common;
using ErrantTowerServer.Domains.Items;
using ErrantTowerServer.Domains.Skills;
using ErrantTowerServer.Domains.Statistics;

namespace ErrantTowerServer.Domains.Enemies;

public readonly record struct Enemy
{
    public Enemy() { }

    public required EnemyGuid Guid { get; init; }
    public required string Name { get; init; }
    public required string ImageUrl { get; init; }
    public required EnemyRace Race { get; init; }
    public string? Title { get; init; }
    public required BattleStatistics Statistics { get; init; }
    public required SkillGuid[] Skills { get; init; }
    public EnemyLoot[] Loots { get; init; } = [];
}

public enum EnemyRace
{
    Vermin = 1,
    Feline = 2,
    Beast = 3,
    Reptile = 4,
    Human = 5,
    Undead = 6,
    Insect = 7,
    Avian = 8,
    Mechanical = 100,
    Spirit = 101,
    Dragon = 102,
}

public readonly record struct EnemyLoot : IWeightedItem<ItemGuid>
{
    public required ItemGuid Guid { get; init; }
    public required double Chance { get; init; }
}
