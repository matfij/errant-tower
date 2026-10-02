using ErrantTowerServer.Common;
using ErrantTowerServer.Domains.Skills;

namespace ErrantTowerServer.Domains.Statistics;

public interface ISkillsService
{
    public Task<SkillTree> GetSkillTree(string userId);
    public Task<SkillTree> LearnSkill(string userId, SkillGuid skill);
    public Task<SkillTree> ResetSkills(string userId);
}

public class SkillsService(IStatisticsRepository statisticsRepository) : ISkillsService
{
    public async Task<SkillTree> GetSkillTree(string userId)
    {
        var statistics = await GetStatistics(userId);

        var skillsByPath = GetLearnedUserSkills(statistics).ToLookup(skill => skill.Path);

        return new SkillTree
        {
            SkillPoints = statistics.SkillPoints,
            Paths = new SkillTreePaths
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
            }
        };
    }

    public async Task<SkillTree> LearnSkill(string userId, SkillGuid skillGuid)
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

        return await GetSkillTree(userId);
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

    private async Task<StatisticsEntity> GetStatistics(string userId)
    {
        return await statisticsRepository.FindOneByUserId(userId)
            ?? throw new ApiException("errors.statisticsNotFound");
    }
}
