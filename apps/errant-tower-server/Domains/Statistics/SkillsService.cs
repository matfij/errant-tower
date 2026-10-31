using ErrantTowerServer.Common;
using ErrantTowerServer.Domains.Skills;

namespace ErrantTowerServer.Domains.Statistics;

public interface ISkillsService
{
    public Task<SkillTree> GetSkillTree(string userId);
    public Task<IList<BattleSkill>> GetActiveSkills(string userId);
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

    public async Task<IList<BattleSkill>> GetActiveSkills(string userId)
    {
        var statistics = await GetStatistics(userId);

        return statistics.LearnedSkills
            .Select(skill => (Skill: skill, Data: SkillRegistry.GetSkill(skill.Guid)))
            .Where(skill => !skill.Data.IsPassive)
            .Select(skill => new BattleSkill
            {
                Guid = skill.Skill.Guid,
                Name = skill.Data.Name,
                Description = skill.Data.Description,
                ImageUrl = skill.Data.ImageUrl,
                Path = skill.Data.Path,
                Types = skill.Data.Types,
                PhysicalAttackFactor = skill.Data.PhysicalAttackFactor[skill.Skill.Level - 1],
                MagicalAttackFactor = skill.Data.MagicalAttackFactor[skill.Skill.Level - 1],
                PhysicalDefenseFactor = skill.Data.PhysicalDefenseFactor[skill.Skill.Level - 1],
                MagicalDefenseFactor = skill.Data.MagicalDefenseFactor[skill.Skill.Level - 1],
                IsPassive = skill.Data.IsPassive,
                TargetSelf = skill.Data.TargetSelf,
                HitCount = skill.Data.HitCount[skill.Skill.Level - 1],
                EnergyCost = skill.Data.EnergyCost[skill.Skill.Level - 1],
                ManaCost = skill.Data.ManaCost[skill.Skill.Level - 1],
                TargetEffects = skill.Data.TargetEffects[skill.Skill.Level - 1],
                SelfEffects = skill.Data.SelfEffects[skill.Skill.Level - 1],
                TargetProperties = skill.Data.TargetProperties[skill.Skill.Level - 1],
                SelfProperties = skill.Data.SelfProperties[skill.Skill.Level - 1],
                Requirements = skill.Data.Requirements
            })
            .ToList();
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
        if (targetSkillData.Path == SkillPath.None)
        {
            throw new ApiException("errors.cantLearnThisSkill");
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

            statistics.LearnedSkills.Add(new() { Guid = skillGuid, Level = 1 });
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
