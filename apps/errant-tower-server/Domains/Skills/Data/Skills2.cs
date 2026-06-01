namespace ErrantTowerServer.Domains.Skills.Data;

public static class Skills2
{
    public static readonly Skill Punch = new()
    {
        Guid = SkillGuid.Punch,
        Name = "Punch",
        PhysicalAttackFactor = 0.6,
        PhysicalDefenseFactor = 0.8,
        Types = [SkillType.Blunt],
    };

    public static readonly Skill Slash = new()
    {
        Guid = SkillGuid.Slash,
        Name = "Slash",
        PhysicalAttackFactor = 1.25,
        PhysicalDefenseFactor = 0.9,
        Types = [SkillType.Slash],
    };

    public static readonly Skill Pierce = new()
    {
        Guid = SkillGuid.Pierce,
        Name = "Pierce",
        PhysicalAttackFactor = 1.1,
        PhysicalDefenseFactor = 0.7,
        Types = [SkillType.Pierce],
    };

    public static readonly Skill Bash = new()
    {
        Guid = SkillGuid.Bash,
        Name = "Bash",
        PhysicalAttackFactor = 1.4,
        PhysicalDefenseFactor = 1,
        Types = [SkillType.Blunt],
    };
}
