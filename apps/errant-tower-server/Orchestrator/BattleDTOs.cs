using ErrantTowerServer.Domains.Battles;

namespace ErrantTowerServer.Orchestrator;

public record GetBattleResponse
{
    public required string Id { get; set; }
    public required bool IsFinished { get; set; }
    public required int TurnNumber { get; set; }
    public required BattleCharacter User { get; set; }
    public required BattleCharacter Enemy { get; set; }
}
