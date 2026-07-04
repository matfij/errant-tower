using ErrantTowerServer.Domains.Floor;

namespace ErrantTowerServer.Domains.Progress;

public record FloorTeaser
{
    public bool IsUnlocked { get; init; }
    public required FloorGuid Guid { get; init; }
}
