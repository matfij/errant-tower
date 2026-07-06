using ErrantTowerServer.Domains.Enemy;
using ErrantTowerServer.Domains.Floor;
using ErrantTowerServer.Domains.Item;
using MongoDB.Bson.Serialization.Attributes;

namespace ErrantTowerServer.Domains.Progress;

public class ProgressEntity
{
    [BsonId]
    public required string Id { get; set; }
    public required string UserId { get; set; }

    public FloorGuid UnlockedFloors { get; set; } = FloorGuid.Floor1;
    public FloorDomain UnlockedDomain { get; set; } = FloorDomain.Dungeon;
    public int Stamina { get; set; } = 3;

    public bool IsInExpedition { get; set; } = false;
    public FloorGuid CurrentFloor { get; set; } = 0;
    public int Initiative { get; set; } = 0;
    public double MaxHealth { get; set; } = 0;
    public double Health { get; set; } = 0;
    public double MaxMana { get; set; } = 0;
    public double Mana { get; set; } = 0;
    public double MaxEnergy { get; set; } = 0;
    public double Energy { get; set; } = 0;
    public int X { get; set; } = 0;
    public int Y { get; set; } = 0;
    public FloorTileInfo[] FloorTiles { get; set; } = [];
}

public enum TowerDomain
{
    None = 0,
    Dungeon = 1,
    Forest = 2,
    Desert = 3,
}

public readonly record struct FloorTileInfo
{
    public required int X { get; init; }
    public required int Y { get; init; }
    public required FloorTileType Type { get; init; }
    public EnemyGuid? EnemyGuid { get; init; }
    public ItemGuid? ItemGuid { get; init; }
    public int? Silver { get; init; }
}
