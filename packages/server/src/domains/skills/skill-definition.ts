import type {
    SkillEffect,
    SkillEffectType,
    SkillGuid,
    SkillPath,
    SkillProperty,
    SkillPropertyEffect,
    SkillPropertyType,
    SkillRequirement,
    SkillType,
} from "@errant/shared";

export const skillLevel = {
    min: 1,
    max: 10,
} as const;

export const zeroFactors = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

export const oneFactors = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

export const emptyEffects: SkillEffect[] = [];

export const emptyProperties: SkillProperty[] = [];

export type SkillDraft = {
    guid: SkillGuid;
    name: string;
    description?: string;
    imageUrl?: string;
    path?: SkillPath;
    tier?: number;
    types: SkillType[];
    physicalAttackFactor?: number[];
    magicalAttackFactor?: number[];
    physicalDefenseFactor?: number[];
    magicalDefenseFactor?: number[];
    isPassive?: boolean;
    targetSelf?: boolean;
    hitCount?: number[];
    energyCost?: number[];
    manaCost?: number[];
    targetEffects?: SkillEffectDraft[];
    selfEffects?: SkillEffectDraft[];
    targetProperties?: SkillPropertyDraft[];
    selfProperties?: SkillPropertyDraft[];
    requirements?: SkillRequirement[];
};

export type SkillEffectDraft = {
    type: SkillEffectType;
    values: number[];
    chances: number[];
    durations: number[];
};

export type SkillPropertyDraft = {
    effect?: SkillPropertyEffect;
    type: SkillPropertyType;
    values: number[];
    duration?: number;
};
