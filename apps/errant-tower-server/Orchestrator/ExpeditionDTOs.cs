using System.ComponentModel.DataAnnotations;
using ErrantTowerServer.Domains.Equipments;
using ErrantTowerServer.Domains.Expeditions;

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
    public string? BattleId { get; init; }
    public int? Silver { get; init; }
    public IList<BagItemData>? Items { get; init; }
    public ExpeditionSummary? Summary { get; init; }
}
