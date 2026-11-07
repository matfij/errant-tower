import {
    SkillPath,
    SkillPropertyEffect,
    type Skill,
    type SkillEffect,
    type SkillProperty,
} from "@errant/shared";

import {
    emptyEffects,
    emptyProperties,
    oneFactors,
    zeroFactors,
    type SkillDraft,
    type SkillEffectDraft,
    type SkillPropertyDraft,
} from "./skill-definition.ts";

export const defineSkill = (draft: SkillDraft): Skill => {
    return {
        guid: draft.guid,
        name: draft.name,
        description: draft.description ?? null,
        imageUrl: draft.imageUrl ?? "blank.png",
        path: draft.path ?? SkillPath.None,
        tier: draft.tier ?? 1,
        types: draft.types,
        physicalAttackFactor: draft.physicalAttackFactor ?? zeroFactors,
        magicalAttackFactor: draft.magicalAttackFactor ?? zeroFactors,
        physicalDefenseFactor: draft.physicalDefenseFactor ?? zeroFactors,
        magicalDefenseFactor: draft.magicalDefenseFactor ?? zeroFactors,
        isPassive: draft.isPassive ?? false,
        targetSelf: draft.targetSelf ?? false,
        hitCount: draft.hitCount ?? oneFactors,
        energyCost: draft.energyCost ?? zeroFactors,
        manaCost: draft.manaCost ?? zeroFactors,
        targetEffects: fillEffects(draft.targetEffects),
        selfEffects: fillEffects(draft.selfEffects),
        targetProperties: fillProperties(draft.targetProperties),
        selfProperties: fillProperties(draft.selfProperties),
        requirements: draft.requirements ?? [],
    };
};

const fillEffects = (effects: SkillEffectDraft[] | undefined): SkillEffect[] => {
    if (effects === undefined) {
        return emptyEffects;
    }
    return effects.map((effect) => ({
        type: effect.type,
        values: effect.values,
        chance: effect.chance ?? 0,
        duration: effect.duration ?? 0,
    }));
};

const fillProperties = (properties: SkillPropertyDraft[] | undefined): SkillProperty[] => {
    if (properties === undefined) {
        return emptyProperties;
    }
    return properties.map((property) => ({
        effect: property.effect ?? SkillPropertyEffect.Additive,
        type: property.type,
        values: property.values,
        duration: property.duration ?? 0,
    }));
};
