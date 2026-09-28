using ErrantTowerServer.Domains.Battles;

namespace ErrantTowerServer.Orchestrator;

public interface IBattleOrchestrator
{
    public Task<GetBattleResponse> GetBattle(string userId);
}

public class BattleOrchestrator(IBattleService battleService) : IBattleOrchestrator
{
    public async Task<GetBattleResponse> GetBattle(string userId)
    {
        var battle = await battleService.Get(userId);
        return new GetBattleResponse
        {
            Id = battle.Id,
            User = battle.User,
            Enemy = battle.Enemy,
            IsFinished = battle.IsFinished,
            TurnNumber = battle.TurnNumber,
        };
    }
}
