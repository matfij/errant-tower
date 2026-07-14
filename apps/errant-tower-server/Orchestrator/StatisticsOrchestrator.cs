using ErrantTowerServer.Domains.Statistics;

namespace ErrantTowerServer.Orchestrator;

public interface IStatisticsOrchestrator
{
    public Task<GetSkillTreeResponse> GetSkillTree(string userId);
    public Task LearnSkill(string userId, LearnSkillRequest request);
    public Task<ResetSkillsTreeResponse> ResetSkills(string userId);
}

public class StatisticsOrchestrator(IStatisticsService statisticsService) : IStatisticsOrchestrator
{
    public async Task<GetSkillTreeResponse> GetSkillTree(string userId)
    {
        var skillTree = await statisticsService.GetSkillTree(userId);
        return new GetSkillTreeResponse()
        {

            Blade = skillTree.Blade,
            Tenacity = skillTree.Tenacity,
            Hammer = skillTree.Hammer,
            Bellicosity = skillTree.Bellicosity,
            Lance = skillTree.Lance,
            Vivacity = skillTree.Vivacity,
            Bow = skillTree.Bow,
            Perspicacity = skillTree.Perspicacity,
            Staff = skillTree.Staff,
            Sagacity = skillTree.Sagacity,
        };
    }

    public async Task LearnSkill(string userId, LearnSkillRequest request)
    {
        await statisticsService.LearnSkill(userId, request.SkillGuid);
    }

    public async Task<ResetSkillsTreeResponse> ResetSkills(string userId)
    {
        var skillTree = await statisticsService.ResetSkills(userId);
        return new ResetSkillsTreeResponse()
        {
            Blade = skillTree.Blade,
            Tenacity = skillTree.Tenacity,
            Hammer = skillTree.Hammer,
            Bellicosity = skillTree.Bellicosity,
            Lance = skillTree.Lance,
            Vivacity = skillTree.Vivacity,
            Bow = skillTree.Bow,
            Perspicacity = skillTree.Perspicacity,
            Staff = skillTree.Staff,
            Sagacity = skillTree.Sagacity,
        };
    }
}
