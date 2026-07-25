using ErrantTowerServer.Common;
using ErrantTowerServer.Domains.Enemies;
using ErrantTowerServer.Domains.Skills;
using ErrantTowerServer.Domains.Statistics;

namespace ErrantTowerServer.Domains.Battles;

public interface IBattleService
{
    public Task<BattleEntity> Start(string userId, string username, BattleStatistics userStatistics, Enemy enemy);
    public Task<BattleEntity> Act(string userId, SkillGuid skillGuid);
}

public class BattleService(IBattleRepository battleRepository) : IBattleService
{
    public async Task<BattleEntity> Start(string userId, string username, BattleStatistics userStatistics, Enemy enemy)
    {

        var battle = new BattleEntity()
        {
            Id = Utils.GenerateGuid(),
            UserId = userId,
            IsFinished = false,
            TurnNumber = 0,
            User = new BattleCharacter()
            {
                Name = username,
                Statistics = userStatistics,
                Statuses = []
            },
            Enemy = new BattleCharacter()
            {
                Name = enemy.Name,
                Statistics = enemy.Statistics,
                Statuses = []
            }
        };

        await battleRepository.CreateOne(battle);

        return battle;
    }

    public Task<BattleEntity> Act(string userId, SkillGuid skillGuid)
    {
        // TODO(#93): Battle sync
        throw new NotImplementedException();
    }
}
