using ErrantTowerServer.Domains.Enemy;
using ErrantTowerServer.Domains.Item;

namespace ErrantTowerServer.Domains.Floor;

public record struct Floor
{
    public required FloorGuid Guid { get; set; }
    public required string MapBackgroundUrl { get; set; }
    public required string BattleBackgroundUrl { get; set; }
    public required FloorEnemy[] Enemies { get; set; }
    public required FloorTreasure[] TreasureItemGuids { get; set; }
    public required string[] NPCGuids { get; set; }
    public required FloorTile[] Tiles { get; set; }
}

public record struct FloorTile
{
    public required int X { get; set; }
    public required int Y { get; set; }
    public required FloorTileType Type { get; set; }
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

public record struct FloorEnemy
{
    public required EnemyGuid EnemyGuid { get; set; }
    public required double EncounterChance { get; set; }
}

public record struct FloorTreasure
{
    public required ItemGuid ItemGuid { get; set; }
    public required double EncounterChance { get; set; }
}