namespace ErrantTowerServer.Domains.Enemy.Data;

public static class Enemies1
{
    public static readonly Enemy ratter = new()
    {
        Guid = EnemyGuid.Ratter,
        Name = "Ratter",
        Race = EnemyRace.Vermin,
        Statistics =
        {
            Initiative = 1.5,
            HealthPoints = 20,
            PhysicalAttack = 5,
            MagicalAttack = 0,
            PhysicalDefense = 1,
            MagicalDefense = 0,
            CriticalChance = 0.1,
            PhysicalCriticalPower = 1.2,
            PunctureChance = 0.1,
            DodgeChance = 0.2,
        }
    };
}