using ErrantTowerServer.Domains.Equipments;

namespace ErrantTowerServer.Domains.Expeditions;

public enum MoveDirection
{
    Up = 1,
    Down = 2,
    Left = 3,
    Right = 4,
}

public record MoveResult
{
    public required int X { get; init; }
    public required int Y { get; init; }
    public string? BattleId { get; init; }
    public int? Silver { get; init; }
    public List<BagItemData>? Loots { get; init; }
    public ExpeditionSummary? Summary { get; init; }
}

public record ExpeditionSummary
{
    public required bool IsSuccess { get; init; }
    public required bool HasFinished { get; init; }
    public required int GainedSilver { get; init; }
    public required List<BagItemData> GainedItems { get; init; }
    public required int GainedAttributePoints { get; init; }
    public required int GainedSkillPoints { get; init; }
}
