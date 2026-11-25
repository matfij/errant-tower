import type { BattleSkill, UserSkill } from "@errant/shared";

export const toUserSkill = (skill: BattleSkill): UserSkill => {
    return {
        guid: skill.guid,
        name: skill.name,
        description: skill.description,
        imageUrl: skill.imageUrl,
        path: skill.path,
        tier: 0,
        level: 1,
        types: skill.types,
        physicalAttackFactor: [skill.physicalAttackFactor],
        magicalAttackFactor: [skill.magicalAttackFactor],
        physicalDefenseFactor: [skill.physicalDefenseFactor],
        magicalDefenseFactor: [skill.magicalDefenseFactor],
        isPassive: skill.isPassive,
        targetSelf: skill.targetSelf,
        hitCount: [skill.hitCount],
        energyCost: [skill.energyCost],
        manaCost: [skill.manaCost],
        targetEffects: skill.targetEffects.map((effect) => ({
            type: effect.type,
            values: [effect.value],
            chances: [effect.chance],
            durations: [effect.duration],
        })),
        selfEffects: skill.selfEffects.map((effect) => ({
            type: effect.type,
            values: [effect.value],
            chances: [effect.chance],
            durations: [effect.duration],
        })),
        targetProperties: skill.targetProperties.map((property) => ({
            effect: property.effect,
            type: property.type,
            values: [property.value],
            duration: property.duration,
        })),
        selfProperties: skill.selfProperties.map((property) => ({
            effect: property.effect,
            type: property.type,
            values: [property.value],
            duration: property.duration,
        })),
        requirements: skill.requirements.map((requirement) => ({
            path: requirement.path,
            points: requirement.points,
        })),
    };
};
