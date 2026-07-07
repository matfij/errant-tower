using ErrantTowerServer.Domains.Floor;

namespace ErrantTowerServer.Domains.Progress;

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
    public FloorGuid FloorGuid { get; set; }
    public required string FloorImageUrl { get; set; }
    public int Initiative { get; set; }
    public double MaxHealth { get; set; }
    public double Health { get; set; }
    public double MaxMana { get; set; }
    public double Mana { get; set; }
    public double MaxEnergy { get; set; }
    public double Energy { get; set; }
    public int X { get; set; }
    public int Y { get; set; }
    public required FloorTile[] FloorTiles { get; set; }
}
