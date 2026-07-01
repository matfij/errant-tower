using ErrantTowerServer.Domains.Item;
using ErrantTowerServer.Domains.Skills;
using ErrantTowerServer.Domains.Statistics;

namespace ErrantTowerServer.Domains.Enemy.Data;

public static class DungeonEnemies
{
    public static readonly Enemy ratter = new()
    {
        Guid = EnemyGuid.Ratter,
        ImageUrl = "dungeon/ratter.png",
        Name = "Ratter",
        Race = EnemyRace.Vermin,
        Statistics = new BattleStatistics()
        {
            Speed = 1.5,
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
        ImageUrl = "dungeon/chember.png",
        Name = "Chember",
        Race = EnemyRace.Beast,
        Statistics = new BattleStatistics()
        {
            Speed = 1.3,
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
        ImageUrl = "dungeon/kerramid.png",
        Name = "Kerramid",
        Race = EnemyRace.Insect,
        Statistics = new BattleStatistics()
        {
            Speed = 1,
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
        ImageUrl = "dungeon/glowpede.png",
        Name = "Glowpede",
        Race = EnemyRace.Insect,
        Statistics = new BattleStatistics()
        {
            Speed = 1,
            HealthPoints = 190,
            PhysicalAttack = 15,
            MagicalAttack = 0,
            PhysicalDefense = 10,
            MagicalDefense = 8,
            CriticalChance = 0.2,
            PhysicalCriticalPower = 1.2,
            PunctureChance = 0.2,
            DodgeChance = 0.2
        },
        Skills = [SkillGuid.Tackle, SkillGuid.Bite, SkillGuid.TailWhip],
        Loots =
        [
            new() { ItemGuid = ItemGuid.SmallClaw, Chance = 0.7 },
            new() { ItemGuid = ItemGuid.ShinyClaw, Chance = 0.2 },
        ],
    };

    public static readonly Enemy scrapper = new()
    {
        Guid = EnemyGuid.Scrapper,
        ImageUrl = "dungeon/scrapper.png",
        Name = "Scrapper",
        Race = EnemyRace.Vermin,
        Statistics = new BattleStatistics()
        {
            Speed = 1.6,
            HealthPoints = 160,
            PhysicalAttack = 9,
            MagicalAttack = 0,
            PhysicalDefense = 3,
            MagicalDefense = 3,
            CriticalChance = 0.1,
            PhysicalCriticalPower = 1.2,
            DodgeChance = 0.1,
            BlockChance = 0.1,
            BlockPower = 0.25,
        },
        Skills = [SkillGuid.Cut, SkillGuid.Bite, SkillGuid.TailWhip],
        Loots =
        [
            new() { ItemGuid = ItemGuid.WornHide, Chance = 0.2 },
            new() { ItemGuid = ItemGuid.SmallClaw, Chance = 0.2 },
            new() { ItemGuid = ItemGuid.CopperBar, Chance = 0.2 },
        ],
    };

    public static readonly Enemy boarus = new()
    {
        Guid = EnemyGuid.Boarus,
        ImageUrl = "dungeon/boarus.png",
        Name = "Boarus",
        Race = EnemyRace.Beast,
        Statistics = new BattleStatistics()
        {
            Speed = 1,
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

    public static readonly Enemy pigon = new()
    {
        Guid = EnemyGuid.Pigon,
        ImageUrl = "dungeon/pigon.png",
        Name = "Pigon",
        Race = EnemyRace.Avian,
        Statistics = new BattleStatistics()
        {
            Speed = 1.9,
            HealthPoints = 50,
            PhysicalAttack = 7,
            MagicalAttack = 0,
            PhysicalDefense = 1,
            MagicalDefense = 1,
            CriticalChance = 0.1,
            PhysicalCriticalPower = 1.2,
            PunctureChance = 0.1,
            DodgeChance = 0.4,
        },
        Skills = [SkillGuid.Peck, SkillGuid.Scratch],
        Loots = [new() { ItemGuid = ItemGuid.WornHide, Chance = 0.4 }],
    };

    public static readonly Enemy morus = new()
    {
        Guid = EnemyGuid.Morus,
        ImageUrl = "dungeon/morus.png",
        Name = "Morus",
        Race = EnemyRace.Beast,
        Statistics = new BattleStatistics()
        {
            Speed = 1,
            HealthPoints = 220,
            PhysicalAttack = 20,
            MagicalAttack = 10,
            PhysicalDefense = 8,
            MagicalDefense = 4,
            CriticalChance = 0.2,
            CounterChance = 0.2,
            PhysicalCriticalPower = 1.2,
            PunctureChance = 0.2,
            DodgeChance = 0.2
        },
        Skills = [SkillGuid.Slash, SkillGuid.SwiftStrike, SkillGuid.CrusherBlow],
        Loots =
        [
            new() { ItemGuid = ItemGuid.CopperBar, Chance = 0.6 },
            new() { ItemGuid = ItemGuid.LeadBar, Chance = 0.2 },
        ],
    };

    public static readonly Enemy wisker = new()
    {
        Guid = EnemyGuid.Wisker,
        ImageUrl = "dungeon/wisker.png",
        Name = "Wisker",
        Race = EnemyRace.Beast,
        Statistics = new BattleStatistics()
        {
            Speed = 1.6,
            HealthPoints = 90,
            PhysicalAttack = 9,
            MagicalAttack = 0,
            PhysicalDefense = 3,
            MagicalDefense = 3,
            CriticalChance = 0.2,
            PhysicalCriticalPower = 1.2,
            DodgeChance = 0.2,
        },
        Skills = [SkillGuid.Scratch, SkillGuid.Bite, SkillGuid.Bite],
        Loots = [new() { ItemGuid = ItemGuid.WornHide, Chance = 0.6 }],
    };

    public static readonly Enemy regewur = new()
    {
        Guid = EnemyGuid.Regewur,
        ImageUrl = "dungeon/regewur.png",
        Name = "Regewur",
        Race = EnemyRace.Insect,
        Statistics = new BattleStatistics()
        {
            Speed = 1,
            HealthPoints = 180,
            PhysicalAttack = 8,
            MagicalAttack = 0,
            PhysicalDefense = 8,
            MagicalDefense = 8,
            CriticalChance = 0.1,
            PhysicalCriticalPower = 1.2,
            BlockChance = 0.2,
            BlockPower = 0.5,
        },
        Skills = [SkillGuid.Tackle, SkillGuid.Bite, SkillGuid.Slash],
        Loots = [new() { ItemGuid = ItemGuid.SmallClaw, Chance = 0.5 }],
    };
}
