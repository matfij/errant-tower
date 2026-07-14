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

public record GetExpeditionResponse : Expedition { }
