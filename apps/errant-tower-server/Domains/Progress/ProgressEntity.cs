using MongoDB.Bson.Serialization.Attributes;

namespace ErrantTowerServer.Domains.Progress;

public class ProgressEntity
{
    [BsonId]
    public required string Id { get; set; }
    public required string UserId { get; set; }
    public required string Username { get; set; }

    public required TowerDomain CompletedDomains { get; set; } = TowerDomain.None;
    public required int CompletedFloors { get; set; } = 0;
    public required int Stamina { get; set; } = 3;

    public required TowerDomain CurrentDomain { get; set; } = TowerDomain.None;
    public required int CurrentFloor { get; set; } = 0;
    public required int MaxInitiative { get; set; } = 0;
    public required int Initiative { get; set; } = 0;
    public required int MaxHealth { get; set; } = 0;
    public required int Health { get; set; } = 0;
    public required int MaxMana { get; set; } = 0;
    public required int Mana { get; set; } = 0;
    public required int MaxEnergy { get; set; } = 0;
    public required int Energy { get; set; } = 0;
    public required int X { get; set; } = 0;
    public required int Y { get; set; } = 0;
    public required FloorEvent[] FloorEvents { get; set; } = [];
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
