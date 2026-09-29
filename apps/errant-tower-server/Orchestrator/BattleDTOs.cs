using ErrantTowerServer.Domains.Battles;

namespace ErrantTowerServer.Orchestrator;

public record GetBattleResponse
{
    public required string Id { get; init; }
    public required bool IsFinished { get; init; }
    public required int TurnNumber { get; init; }
    public required BattleCharacter User { get; init; }
    public required BattleCharacter Enemy { get; init; }
}
