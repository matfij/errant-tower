namespace ErrantTowerServer.Domains.Statistics;

public class BattleStatistics
{
    public required double Initiative { get; set; } = 0;
    public required double HealthPoints { get; set; } = 0;
    public required double ManaPoints { get; set; } = 0;
    public required double EnergyPoints { get; set; } = 0;
    public required double PhysicalAttack { get; set; } = 0;
    public required double MagicalAttack { get; set; } = 0;
    public required double PhysicalDefense { get; set; } = 0;
    public required double MagicalDefense { get; set; } = 0;
    public required double PhysicalAbsorption { get; set; } = 0;
    public required double MagicalAbsorption { get; set; } = 0;
    public required double CriticalChance { get; set; } = 0;
    public required double PhysicalCriticalPower { get; set; } = 0;
    public required double MagicalCriticalPower { get; set; } = 0;
    public required double PunctureChance { get; set; } = 0;
    public required double DodgeChance { get; set; } = 0;
    public required double ParryChance { get; set; } = 0;
    public required double BlockChance { get; set; } = 0;
    public required double BlockPower { get; set; } = 0;
    public required double CounterChance { get; set; } = 0;
    public required double HealthRegen { get; set; } = 0;
    public required double ManaRegen { get; set; } = 0;
    public required double EnergyRegen { get; set; } = 0;
}
