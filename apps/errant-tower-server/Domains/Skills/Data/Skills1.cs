namespace ErrantTowerServer.Domains.Skills.Data;

public static class Skills1
{
    public static readonly Skill Scratch = new()
    {
        Guid = SkillGuid.Scratch,
        Name = "Scratch",
        PhysicalAttackFactor = 1.1,
        PhysicalDefenseFactor = 0.8,
        Types = [SkillType.Slash],
    };

    public static readonly Skill Bite = new()
    {
        Guid = SkillGuid.Bite,
        Name = "Bite",
        PhysicalAttackFactor = 1.2,
        PhysicalDefenseFactor = 0.8,
        Types = [SkillType.Pierce],
    };

    public static readonly Skill TailWhip = new()
    {
        Guid = SkillGuid.TailWhip,
        Name = "Tail Whip",
        PhysicalAttackFactor = 0.8,
        PhysicalDefenseFactor = 1.2,
        Types = [SkillType.Bash],
    };
}
