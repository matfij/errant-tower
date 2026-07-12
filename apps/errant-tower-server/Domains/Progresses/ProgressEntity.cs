using ErrantTowerServer.Domains.Enemies;
using ErrantTowerServer.Domains.Equipments;
using ErrantTowerServer.Domains.Floors;
using ErrantTowerServer.Domains.Items;
using MongoDB.Bson.Serialization.Attributes;

namespace ErrantTowerServer.Domains.Progresses;

public class ProgressEntity
{
    [BsonId]
    public required string Id { get; set; }
    public required string UserId { get; set; }

    public FloorGuid UnlockedFloor { get; set; } = FloorGuid.Floor1;
    public FloorDomain UnlockedDomain { get; set; } = FloorDomain.Dungeon;
    public int Stamina { get; set; } = 3;

    public bool IsInExpedition { get; set; } = false;
    public FloorGuid CurrentFloor { get; set; } = 0;
    public int Initiative { get; set; } = 0;
    public int Adrenaline { get; set; } = 0;
    public string? BattleId { get; set; }
    public int GainedSilver { get; set; } = 0;
    public List<BagItem> GainedItems { get; set; } = [];
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
