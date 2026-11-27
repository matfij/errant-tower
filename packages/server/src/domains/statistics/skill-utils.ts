import { BattleSkill, Skill } from "@errant/shared";

export const toBattleSkill = (skill: Skill, level: number): BattleSkill => {
    const index = level - 1;
    return {
        guid: skill.guid,
        name: skill.name,
        description: skill.description,
        imageUrl: skill.imageUrl,
        path: skill.path,
        tier: skill.tier,
        types: skill.types,
        physicalAttackFactor: skill.physicalAttackFactor[index],
        magicalAttackFactor: skill.magicalAttackFactor[index],
        physicalDefenseFactor: skill.physicalDefenseFactor[index],
        magicalDefenseFactor: skill.magicalDefenseFactor[index],
        isPassive: skill.isPassive,
        targetSelf: skill.targetSelf,
        hitCount: skill.hitCount[index],
        energyCost: skill.energyCost[index],
        manaCost: skill.manaCost[index],
        targetEffects: skill.targetEffects.map((effect) => ({
            type: effect.type,
            value: effect.values[index],
            chance: effect.chances[index],
            duration: effect.durations[index],
        })),
        selfEffects: skill.selfEffects.map((effect) => ({
            type: effect.type,
            value: effect.values[index],
            chance: effect.chances[index],
            duration: effect.durations[index],
        })),
        targetProperties: skill.targetProperties.map((property) => ({
            effect: property.effect,
            type: property.type,
            value: property.values[index],
            duration: property.duration,
        })),
        selfProperties: skill.selfProperties.map((property) => ({
            effect: property.effect,
            type: property.type,
            value: property.values[index],
            duration: property.duration,
        })),
        requirements: skill.requirements.map((requirement) => ({
            path: requirement.path,
            points: requirement.points,
        })),
    };
};
