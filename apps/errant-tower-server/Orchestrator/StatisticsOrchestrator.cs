using ErrantTowerServer.Domains.Statistics;

namespace ErrantTowerServer.Orchestrator;

public interface IStatisticsOrchestrator
{
    public Task<GetSkillTreeResponse> GetSkillTree(string userId);
    public Task<LearnSkillResponse> LearnSkill(string userId, LearnSkillRequest request);
    public Task<ResetSkillsResponse> ResetSkills(string userId);
}

public class StatisticsOrchestrator(IStatisticsService statisticsService) : IStatisticsOrchestrator
{
    public async Task<GetSkillTreeResponse> GetSkillTree(string userId)
    {
        var skillTree = await statisticsService.GetSkillTree(userId);
        return new GetSkillTreeResponse()
        {
            SkillPoints = skillTree.SkillPoints,
            Paths = skillTree.Paths
        };
    }

    public async Task<LearnSkillResponse> LearnSkill(string userId, LearnSkillRequest request)
    {
        var skillTree = await statisticsService.LearnSkill(userId, request.SkillGuid);
        return new LearnSkillResponse()
        {
            SkillPoints = skillTree.SkillPoints,
            Paths = skillTree.Paths
        };
    }

    public async Task<ResetSkillsResponse> ResetSkills(string userId)
    {
        var skillTree = await statisticsService.ResetSkills(userId);
        return new ResetSkillsResponse()
        {
            SkillPoints = skillTree.SkillPoints,
            Paths = skillTree.Paths
        };
    }
}
