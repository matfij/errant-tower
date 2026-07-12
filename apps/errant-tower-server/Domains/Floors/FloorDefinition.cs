using ErrantTowerServer.Common;
using ErrantTowerServer.Domains.Enemies;
using ErrantTowerServer.Domains.Items;

namespace ErrantTowerServer.Domains.Floors;

public record struct Floor
{
    public required FloorGuid Guid { get; init; }
    public required FloorDomain Domain { get; init; }
    public required string ImageUrl { get; init; }
    public required string TilesUrl { get; init; }
    public required FloorEnemy[] Enemies { get; init; }
    public required double SpecialEnemyChance { get; init; }
    public required FloorEnemy[] SpecialEnemies { get; init; }
    public required double TreasureChance { get; init; }
    public required FloorTreasure[] TreasureItemGuids { get; init; }
    public required int TreasureSilverMin { get; init; }
    public required int TreasureSilverMax { get; init; }
    public required int StartX { get; init; }
    public required int StartY { get; init; }
    public required FloorTile[] Tiles { get; init; }
}

public enum FloorDomain
{
    Dungeon = 1,
    Forest = 2,
}

public record struct FloorTile
{
    public required int X { get; init; }
    public required int Y { get; init; }
    public required FloorTileType Type { get; init; }
}

public enum FloorTileType
{
    Start = 0,
    Route = 1,
    Wall = 2,
    Battle = 3,
    Treasure = 4,
    NPC = 5,
    Finish = 6,
}

public record struct FloorEnemy : IWeightedItem<EnemyGuid>
{
    public required EnemyGuid Guid { get; init; }
    public required double Chance { get; init; }
}

public record struct FloorTreasure : IWeightedItem<ItemGuid>
{
    public required ItemGuid Guid { get; init; }
    public required double Chance { get; init; }
}
