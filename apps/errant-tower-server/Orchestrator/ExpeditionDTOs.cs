using System.ComponentModel.DataAnnotations;
using ErrantTowerServer.Domains.Expeditions;

namespace ErrantTowerServer.Orchestrator;

public record MoveRequest
{
    [Required]
    public required MoveDirection Direction { get; init; }
}

public record MoveResponse : MoveResult { }
