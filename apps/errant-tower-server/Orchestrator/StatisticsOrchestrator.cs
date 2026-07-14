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
        var result = await statisticsService.GetSkillTree(userId);
        return (GetSkillTreeResponse)result;
    }

    public async Task LearnSkill(string userId, LearnSkillRequest request)
    {
        await statisticsService.LearnSkill(userId, request.SkillGuid);
    }

    public async Task<ResetSkillsTreeResponse> ResetSkills(string userId)
    {
        var result = await statisticsService.ResetSkills(userId);
        return (ResetSkillsTreeResponse)result;
    }
}
