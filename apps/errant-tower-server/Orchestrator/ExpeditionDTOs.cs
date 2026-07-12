using System.ComponentModel.DataAnnotations;
using ErrantTowerServer.Domains.Expeditions;
using ErrantTowerServer.Domains.Items;

namespace ErrantTowerServer.Orchestrator;

public record MoveRequest
{
    [Required]
    public required MoveDirection Direction { get; init; }
}

public record MoveResponse
{
    [Required]
    public required int X { get; init; }
    [Required]
    public required int Y { get; init; }
    public bool? IsFinished { get; init; }
    public string? BattleId { get; init; }
    public int? Silver { get; init; }
    public IList<Item>? Items { get; init; }
}
