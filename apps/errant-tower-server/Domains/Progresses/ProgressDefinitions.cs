using ErrantTowerServer.Domains.Floors;

namespace ErrantTowerServer.Domains.Progresses;

public record DomainFloors
{
    public required bool IsUnlocked { get; init; }
    public required FloorDomain Domain { get; init; }
    public required FloorTeaser[] Floors { get; init; }
}

public record FloorTeaser
{
    public bool IsUnlocked { get; init; }
    public required FloorGuid Guid { get; init; }
}

public record Expedition
{
    public required FloorGuid FloorGuid { get; set; }
    public required string FloorImageUrl { get; set; }
    public required int Initiative { get; set; }
    public required double MaxHealth { get; set; }
    public required double Health { get; set; }
    public required double MaxMana { get; set; }
    public required double Mana { get; set; }
    public required double MaxEnergy { get; set; }
    public required double Energy { get; set; }
    public required int X { get; set; }
    public required int Y { get; set; }
    public required FloorTile[] FloorTiles { get; set; }
}
