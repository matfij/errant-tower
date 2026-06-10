namespace ErrantTowerServer.Domains.Skills.Data;

public class TenacitySkills
{
    public static readonly Skill GreatVigor = new()
    {
        Guid = SkillGuid.GreatVigor,
        Name = "Great Vigor",
        PhysicalAttackFactor = 1.0,
        PhysicalDefenseFactor = 1.5,
        Types = [SkillType.Buff],
        IsPassive = true,
        Properties =
        [
            new () { Type = SkillPropertyType.HealthPoints, Value = 0.01 }
        ]
    };
}
