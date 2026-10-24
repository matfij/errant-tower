using ErrantTowerServer.Domains.Equipments;
using ErrantTowerServer.Domains.Statistics;

namespace ErrantTowerServer.Orchestrator;

public interface IStatisticsOrchestrator
{
    public Task<GetAttributesResponse> GetAttributes(string userId);
    public Task<GetBattleStatisticsResponse> GetBattleStatistics(string userId);
    public Task<GetSkillTreeResponse> GetSkillTree(string userId);
    public Task<LearnSkillResponse> LearnSkill(string userId, LearnSkillRequest request);
    public Task<ResetSkillsResponse> ResetSkills(string userId);
}

public class StatisticsOrchestrator(
    IStatisticsService statisticsService,
    ISkillsService skillsService,
    IEquipmentService equipmentService
    ) : IStatisticsOrchestrator
{
    public async Task<GetAttributesResponse> GetAttributes(string userId)
    {
        var statistics = await statisticsService.GetStatistics(userId);
        return new GetAttributesResponse()
        {
            Strength = statistics.Strength,
            Dexterity = statistics.Dexterity,
            Constitution = statistics.Constitution,
            Spirit = statistics.Spirit,
            AttributePoints = statistics.AttributePoints,
        };
    }

    public async Task<GetBattleStatisticsResponse> GetBattleStatistics(string userId)
    {
        var equipment = await equipmentService.GetEquipmentList(userId);
        var battleStatistic = await statisticsService.GetUserBattleStatistics(userId, equipment);
        return new GetBattleStatisticsResponse()
        {
            Speed = battleStatistic.Speed,
            MaxHealthPoints = battleStatistic.MaxHealthPoints,
            HealthPoints = battleStatistic.HealthPoints,
            MaxManaPoints = battleStatistic.MaxManaPoints,
            ManaPoints = battleStatistic.ManaPoints,
            MaxEnergyPoints = battleStatistic.MaxEnergyPoints,
            EnergyPoints = battleStatistic.EnergyPoints,
            PhysicalAttack = battleStatistic.PhysicalAttack,
            MagicalAttack = battleStatistic.MagicalAttack,
            PhysicalDefense = battleStatistic.PhysicalDefense,
            MagicalDefense = battleStatistic.MagicalDefense,
            PhysicalAbsorption = battleStatistic.PhysicalAbsorption,
            MagicalAbsorption = battleStatistic.MagicalAbsorption,
            CriticalChance = battleStatistic.CriticalChance,
            PhysicalCriticalPower = battleStatistic.PhysicalCriticalPower,
            MagicalCriticalPower = battleStatistic.MagicalCriticalPower,
            PunctureChance = battleStatistic.PunctureChance,
            DodgeChance = battleStatistic.DodgeChance,
            ParryChance = battleStatistic.ParryChance,
            BlockChance = battleStatistic.BlockChance,
            BlockPower = battleStatistic.BlockPower,
            CounterChance = battleStatistic.CounterChance,
            HealthRegen = battleStatistic.HealthRegen,
            ManaRegen = battleStatistic.ManaRegen,
            EnergyRegen = battleStatistic.EnergyRegen,
        };
    }

    public async Task<GetSkillTreeResponse> GetSkillTree(string userId)
    {
        var skillTree = await skillsService.GetSkillTree(userId);
        return new GetSkillTreeResponse()
        {
            SkillPoints = skillTree.SkillPoints,
            Paths = skillTree.Paths
        };
    }

    public async Task<LearnSkillResponse> LearnSkill(string userId, LearnSkillRequest request)
    {
        var skillTree = await skillsService.LearnSkill(userId, request.SkillGuid);
        return new LearnSkillResponse()
        {
            SkillPoints = skillTree.SkillPoints,
            Paths = skillTree.Paths
        };
    }

    public async Task<ResetSkillsResponse> ResetSkills(string userId)
    {
        var skillTree = await skillsService.ResetSkills(userId);
        return new ResetSkillsResponse()
        {
            SkillPoints = skillTree.SkillPoints,
            Paths = skillTree.Paths
        };
    }
}
