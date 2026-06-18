using ErrantTowerServer.Domains.Item;
using ErrantTowerServer.Domains.Skills;
using ErrantTowerServer.Domains.Statistics;

namespace ErrantTowerServer.Domains.Enemy.Data;

public static class DungeonEnemies
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
            PhysicalDefense = 2,
            MagicalDefense = 0,
            CriticalChance = 0.1,
            PhysicalCriticalPower = 1.2,
            PunctureChance = 0.1,
            DodgeChance = 0.3,
        },
        Skills = [SkillGuid.Scratch, SkillGuid.Scratch, SkillGuid.Bite],
        Loots = [new() { ItemGuid = ItemGuid.WornHide, Chance = 0.3 }],
    };

    public static readonly Enemy chembr = new()
    {
        Guid = EnemyGuid.Chembr,
        ImageUrl = "chember.png",
        Name = "Chember",
        Race = EnemyRace.Beast,
        Statistics = new BattleStatistics()
        {
            Initiative = 1.3,
            HealthPoints = 40,
            PhysicalAttack = 6,
            MagicalAttack = 0,
            PhysicalDefense = 1,
            MagicalDefense = 0,
            CriticalChance = 0.1,
            PhysicalCriticalPower = 1.2,
            DodgeChance = 0.1,
        },
        Skills = [SkillGuid.Scratch, SkillGuid.Bite, SkillGuid.Bite],
        Loots = [new() { ItemGuid = ItemGuid.WornHide, Chance = 0.4 }],
    };

    public static readonly Enemy kerramid = new()
    {
        Guid = EnemyGuid.Kerramid,
        ImageUrl = "kerramid.png",
        Name = "Kerramid",
        Race = EnemyRace.Insect,
        Statistics = new BattleStatistics()
        {
            Initiative = 1,
            HealthPoints = 120,
            PhysicalAttack = 4,
            MagicalAttack = 0,
            PhysicalDefense = 2,
            MagicalDefense = 1,
            CriticalChance = 0.1,
            PhysicalCriticalPower = 1.2,
            BlockChance = 0.1,
            BlockPower = 0.5,
        },
        Skills = [SkillGuid.Tackle, SkillGuid.Bite, SkillGuid.TailWhip],
        Loots = [new() { ItemGuid = ItemGuid.SmallClaw, Chance = 0.5 }],
    };

    public static readonly Enemy glowpede = new()
    {
        Guid = EnemyGuid.Glowpede,
        ImageUrl = "glowpede.png",
        Name = "Glowpede",
        Race = EnemyRace.Insect,
        Statistics = new BattleStatistics()
        {
            Initiative = 1,
            HealthPoints = 110,
            PhysicalAttack = 7,
            MagicalAttack = 0,
            PhysicalDefense = 3,
            MagicalDefense = 2,
            CriticalChance = 0.2,
            PhysicalCriticalPower = 1.2,
            PunctureChance = 0.2,
            DodgeChance = 0.2
        },
        Skills = [SkillGuid.Tackle, SkillGuid.Bite],
        Loots =
        [
            new() { ItemGuid = ItemGuid.SmallClaw, Chance = 0.7 },
            new() { ItemGuid = ItemGuid.ShinyClaw, Chance = 0.2 },
        ],
    };

    public static readonly Enemy scrapper = new()
    {
        Guid = EnemyGuid.Scrapper,
        ImageUrl = "scrapper.png",
        Name = "Scrapper",
        Race = EnemyRace.Vermin,
        Statistics = new BattleStatistics()
        {
            Initiative = 1.6,
            HealthPoints = 60,
            PhysicalAttack = 6,
            MagicalAttack = 0,
            PhysicalDefense = 2,
            MagicalDefense = 1,
            CriticalChance = 0.1,
            PhysicalCriticalPower = 1.2,
            DodgeChance = 0.1,
            BlockChance = 0.1,
            BlockPower = 0.25,
        },
        Skills = [SkillGuid.Cut, SkillGuid.Bite],
        Loots = 
        [
            new() { ItemGuid = ItemGuid.WornHide, Chance = 0.2 },
            new() { ItemGuid = ItemGuid.SmallClaw, Chance = 0.2 },
            new() { ItemGuid = ItemGuid.CopperBar, Chance = 0.2 },
        ],
    };

    public static readonly Enemy boarus = new()
    {
        Guid = EnemyGuid.Boarous,
        ImageUrl = "boarus.png",
        Name = "Boarus",
        Race = EnemyRace.Beast,
        Statistics = new BattleStatistics()
        {
            Initiative = 1,
            HealthPoints = 140,
            PhysicalAttack = 4,
            MagicalAttack = 0,
            PhysicalDefense = 1,
            MagicalDefense = 1,
            CriticalChance = 0.1,
            PhysicalCriticalPower = 1.2,
        },
        Skills = [SkillGuid.Tackle, SkillGuid.Bite, SkillGuid.TailWhip],
        Loots =
        [
            new() { ItemGuid = ItemGuid.WornHide, Chance = 0.7 },
            new() { ItemGuid = ItemGuid.ShinyHide, Chance = 0.2 },
        ],
    };
}
