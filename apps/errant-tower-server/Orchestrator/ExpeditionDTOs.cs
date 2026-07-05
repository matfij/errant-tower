using System.ComponentModel.DataAnnotations;
using ErrantTowerServer.Domains.Floor;
using ErrantTowerServer.Domains.Progress;

namespace ErrantTowerServer.Orchestrator;

public record GetFloorsResponse
{
    [Required]
    public required DomainFloors[] DomainFloors { get; set; }
}

public record StartExpeditionRequest
{
    [Required]
    public required FloorGuid FloorGuid { get; init; }
}
