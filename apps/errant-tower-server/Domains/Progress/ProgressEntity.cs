using ErrantTowerServer.Domains.Floor;
using MongoDB.Bson.Serialization.Attributes;

namespace ErrantTowerServer.Domains.Progress;

public class ProgressEntity
{
    [BsonId]
    public required string Id { get; set; }
    public required string UserId { get; set; }

    public int CompletedFloors { get; set; } = 0;
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
    public FloorEvent[] FloorEvents { get; set; } = [];
}

public enum TowerDomain
{
    None = 0,
    Dungeon = 1,
    Forest = 2,
    Desert = 3,
}

public record struct FloorEvent(
    int X,
    int Y,
    FloorEventType Type,
    string Reference
);

public enum FloorEventType
{
    None = 0,
    Enemy = 1,
    Treasure = 2,
    NPC = 3,
    Exit = 4,
}
