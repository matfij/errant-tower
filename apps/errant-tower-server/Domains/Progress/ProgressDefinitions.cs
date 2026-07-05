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
