using ErrantTowerServer.Domains.Skills;
using ErrantTowerServer.Domains.Statistics;

namespace ErrantTowerServer.Domains.Enemy.Data;

public static class Enemies1
{
    public static readonly Enemy ratter = new()
    {
        Guid = EnemyGuid.Ratter,
        ImageUrl = "ratter.png",
        Name = "Ratter",
        Race = EnemyRace.Vermin,
        Statistics = new BattleStatistics()
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
        },
        Skills = [SkillGuid.Scratch, SkillGuid.Scratch, SkillGuid.Bite],
    };
}