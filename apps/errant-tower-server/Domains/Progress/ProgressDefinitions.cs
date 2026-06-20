using ErrantTowerServer.Domains.Floor;

namespace ErrantTowerServer.Domains.Progress;

public record FloorTeaser
{
    public bool IsUnlocked { get; init; }
    public required FloorGuid FloorGuid { get; init; }
    public required FloorDomain FloorDomain { get; init; }
}
