using System.ComponentModel.DataAnnotations;
using ErrantTowerServer.Domains.Floors;
using ErrantTowerServer.Domains.Progresses;

namespace ErrantTowerServer.Orchestrator;

public record GetFloorsResponse
{
    [Required]
    public required DomainFloors[] DomainFloors { get; init; }
}

public record StartExpeditionRequest
{
    [Required]
    public required FloorGuid FloorGuid { get; init; }
}

public record GetExpeditionResponse
{
    [Required]
    public required FloorGuid FloorGuid { get; init; }
    [Required]
    public required string FloorImageUrl { get; init; }
    [Required]
    public required int Initiative { get; init; }
    [Required]
    public required double MaxHealth { get; init; }
    [Required]
    public required double Health { get; init; }
    [Required]
    public required double MaxMana { get; init; }
    [Required]
    public required double Mana { get; init; }
    [Required]
    public required double MaxEnergy { get; init; }
    [Required]
    public required double Energy { get; init; }
    [Required]
    public required int X { get; init; }
    [Required]
    public required int Y { get; init; }
    [Required]
    public required FloorTile[] FloorTiles { get; init; }
}
