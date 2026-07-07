using System.ComponentModel.DataAnnotations;
using ErrantTowerServer.Domains.Floor;
using ErrantTowerServer.Domains.Progress;

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
    public FloorGuid FloorGuid { get; set; }
    [Required]
    public required string FloorImageUrl { get; set; }
    [Required]
    public int Initiative { get; set; }
    [Required]
    public double MaxHealth { get; set; }
    [Required]
    public double Health { get; set; }
    [Required]
    public double MaxMana { get; set; }
    [Required]
    public double Mana { get; set; }
    [Required]
    public double MaxEnergy { get; set; }
    [Required]
    public double Energy { get; set; }
    [Required]
    public int X { get; set; }
    [Required]
    public int Y { get; set; }
    [Required]
    public required FloorTile[] FloorTiles { get; set; }
}
