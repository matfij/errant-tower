using MongoDB.Bson.Serialization.Attributes;

namespace ErrantTowerServer.Domains.Statistics;

public class StatisticsEntity
{
    [BsonId]
    public required string Id { get; set; }
    public required string UserId { get; set; }

    public required int AttributePoints { get; set; } = 0;

    public required int Strength { get; set; } = 0;
    public required int Dexterity { get; set; } = 0;
    public required int Constitution { get; set; } = 0;
    public required int Spirit { get; set; } = 0;

    public required int Initiative { get; set; } = 0;
    public required int HealthPoints { get; set; } = 0;
    public required int ManaPoints { get; set; } = 0;
    public required int EnergyPoints { get; set; } = 0;
    public required int PhysicalAttack { get; set; } = 0;
    public required int MagicalAttack { get; set; } = 0;
    public required int PhysicalDefense { get; set; } = 0;
    public required int MagicalDefense { get; set; } = 0;
    public required int PhysicalAbsorption { get; set; } = 0;
    public required int MagicalAbsorption { get; set; } = 0;
    public required int CriticalChance { get; set; } = 0;
    public required int PhysicalCriticalPower { get; set; } = 0;
    public required int MagicalCriticalPower { get; set; } = 0;
    public required int PunctureChance { get; set; } = 0;
    public required int DodgeChance { get; set; } = 0;
    public required int ParryChance { get; set; } = 0;
    public required int BlockChance { get; set; } = 0;
    public required int BlockPower { get; set; } = 0;
    public required int CounterChance { get; set; } = 0;
    public required int HealthRegen { get; set; } = 0;
    public required int ManaRegen { get; set; } = 0;
    public required int EnergyRegen { get; set; } = 0;
}
