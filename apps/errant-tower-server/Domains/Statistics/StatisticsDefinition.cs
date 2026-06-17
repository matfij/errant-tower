namespace ErrantTowerServer.Domains.Statistics;

public record struct BattleStatistics
{
    public BattleStatistics() { }

    public double Initiative { get; set; } = 0;
    public double HealthPoints { get; set; } = 0;
    public double ManaPoints { get; set; } = 0;
    public double EnergyPoints { get; set; } = 0;
    public double PhysicalAttack { get; set; } = 0;
    public double MagicalAttack { get; set; } = 0;
    public double PhysicalDefense { get; set; } = 0;
    public double MagicalDefense { get; set; } = 0;
    public double PhysicalAbsorption { get; set; } = 0;
    public double MagicalAbsorption { get; set; } = 0;
    public double CriticalChance { get; set; } = 0;
    public double PhysicalCriticalPower { get; set; } = 0;
    public double MagicalCriticalPower { get; set; } = 0;
    public double PunctureChance { get; set; } = 0;
    public double DodgeChance { get; set; } = 0;
    public double ParryChance { get; set; } = 0;
    public double BlockChance { get; set; } = 0;
    public double BlockPower { get; set; } = 0;
    public double CounterChance { get; set; } = 0;
    public double HealthRegen { get; set; } = 0;
    public double ManaRegen { get; set; } = 0;
    public double EnergyRegen { get; set; } = 0;
}
