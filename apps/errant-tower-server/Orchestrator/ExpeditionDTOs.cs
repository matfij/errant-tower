using System.ComponentModel.DataAnnotations;
using ErrantTowerServer.Domains.Floor;
using ErrantTowerServer.Domains.Progress;

namespace ErrantTowerServer.Orchestrator;

public record GetFloorsResponse
{
    [Required]
    public required DomainFloors[] DomainFloors { get; set; }

}

public record DomainFloors
{
    [Required]
    public required bool IsUnlocked { get; set; }
    [Required]
    public required FloorDomain Domain { get; init; }
    [Required]
    public required FloorTeaser[] Floors { get; init; }
}

public record StartExpeditionRequest
{
    [Required]
    public required FloorGuid FloorGuid { get; init; }
}
