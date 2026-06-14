namespace ErrantTowerServer.Domains.Skills.Data;

public static class TenacitySkills
{
    public static readonly Skill GreatVigor = new()
    {
        Guid = SkillGuid.GreatVigor,
        Name = "Great Vigor",
        ImageUrl = "great-vigor.png",
        Types = [SkillType.Buff],
        IsPassive = true,
        Properties =
        [
            [new () { Type = SkillPropertyType.HealthPoints, Value = 0.01 }],
        ]
    };
}
