using ErrantTowerServer.Common;
using ErrantTowerServer.Domains.Skills;

namespace ErrantTowerServer.Domains.Statistics;

public interface IStatisticsService
{
    public Task CreateInitial(string userId);
    public Task<BattleStatistics> GetUserBattleStatistics(string userId);
    public Task AwardPoints(string userId, int attributePoints, int skillPoints);
    public Task<SkillTree> GetSkillTree(string userId);
    public Task LearnSkill(string userId, SkillGuid skill);
    public Task<SkillTree> ResetSkills(string userId);
}

public class StatisticsService(IStatisticsRepository statisticsRepository) : IStatisticsService
{
    public async Task CreateInitial(string userId)
    {
        var newStatistics = new StatisticsEntity
        {
            Id = Utils.GenerateGuid(),
            UserId = userId,
            BattleStatistics = new BattleStatistics
            {
                Speed = 0,
                HealthPoints = 100,
                ManaPoints = 50,
                EnergyPoints = 50,
                PhysicalAttack = 10,
                MagicalAttack = 5,
                PhysicalDefense = 5,
                MagicalDefense = 3,
                PhysicalAbsorption = 0,
                MagicalAbsorption = 0,
                CriticalChance = 5,
                PhysicalCriticalPower = 150,
                MagicalCriticalPower = 150,
                PunctureChance = 0,
                DodgeChance = 0,
                ParryChance = 0,
                BlockChance = 0,
                BlockPower = 0,
                CounterChance = 0,
                HealthRegen = 0,
                ManaRegen = 0,
                EnergyRegen = 0
            },
        };
        await statisticsRepository.CreateOne(newStatistics);
    }

    public async Task<BattleStatistics> GetUserBattleStatistics(string userId)
    {
        var statistics = await GetStatistics(userId);
        return statistics.BattleStatistics;
    }

    public async Task AwardPoints(string userId, int attributePoints, int skillPoints)
    {
        var statistics = await GetStatistics(userId);

        statistics.AttributePoints += attributePoints;
        statistics.SkillPoints += skillPoints;

        _ = await statisticsRepository.UpdateOne(statistics);
    }

    public async Task<SkillTree> GetSkillTree(string userId)
    {
        var statistics = await GetStatistics(userId);

        var skillsByPath = GetLearnedUserSkills(statistics).ToLookup(skill => skill.Path);

        return new SkillTree
        {
            Blade = [.. skillsByPath[SkillPath.Blade]],
            Tenacity = [.. skillsByPath[SkillPath.Tenacity]],
            Hammer = [.. skillsByPath[SkillPath.Hammer]],
            Bellicosity = [.. skillsByPath[SkillPath.Bellicosity]],
            Lance = [.. skillsByPath[SkillPath.Lance]],
            Vivacity = [.. skillsByPath[SkillPath.Vivacity]],
            Bow = [.. skillsByPath[SkillPath.Bow]],
            Perspicacity = [.. skillsByPath[SkillPath.Perspicacity]],
            Staff = [.. skillsByPath[SkillPath.Staff]],
            Sagacity = [.. skillsByPath[SkillPath.Sagacity]],
        };
    }

    public async Task LearnSkill(string userId, SkillGuid skillGuid)
    {
        var statistics = await GetStatistics(userId);
        var targetSkill = statistics.LearnedSkills.FirstOrDefault(skill => skill.Guid == skillGuid);
        var targetSkillData = SkillRegistry.GetSkill(skillGuid);

        if (statistics.SkillPoints < 1)
        {
            throw new ApiException("errors.insufficientSkillPoints");
        }

        if (targetSkill is not null)
        {
            if (targetSkill.Level >= 10)
            {
                throw new ApiException("errors.skillAlreadyLearned");
            }
            targetSkill.Level++;
        }
        else
        {
            var learnedUserSkills = GetLearnedUserSkills(statistics);

            foreach (var requirement in targetSkillData.Requirements)
            {
                var pathPoints = learnedUserSkills
                    .Where(skill => skill.Path == requirement.Path)
                    .Sum(skill => skill.Level);

                if (pathPoints < requirement.Points)
                {
                    throw new ApiException("errors.skillRequirementsNotMet");
                }
            }

            var newSkill = new LearnedSkill() { Guid = skillGuid, Level = 1 };
            statistics.LearnedSkills.Add(newSkill);
        }

        statistics.SkillPoints--;
        _ = await statisticsRepository.UpdateOne(statistics);
    }

    public async Task<SkillTree> ResetSkills(string userId)
    {
        var statistics = await GetStatistics(userId);
        var restoredPoints = statistics.LearnedSkills.Sum(skill => skill.Level);

        statistics.LearnedSkills = [];
        statistics.SkillPoints += restoredPoints;

        _ = await statisticsRepository.UpdateOne(statistics);

        return await GetSkillTree(userId);
    }

    private async Task<StatisticsEntity> GetStatistics(string userId)
    {
        return await statisticsRepository.FindOneByUserId(userId)
            ?? throw new ApiException("errors.statisticsNotFound");
    }

    private static List<UserSkill> GetLearnedUserSkills(StatisticsEntity statistics)
    {
        var levelByGuid = statistics.LearnedSkills.ToDictionary(skill => skill.Guid, s => s.Level);

        return
        [..
            SkillRegistry
                .GetAll()
                .Select(skill => skill.ToUserSkill(levelByGuid.GetValueOrDefault(skill.Guid, 0)))
        ];
    }
}
