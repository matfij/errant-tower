import {
    SkillPath,
    SkillPropertyEffect,
    type Skill,
    type SkillEffect,
    type SkillEffectType,
    type SkillGuid,
    type SkillProperty,
    type SkillPropertyType,
    type SkillRequirement,
    type SkillType,
} from "@errant/shared";

const skillLevel = {
    min: 1,
    max: 10,
} as const;

type SkillDraft = {
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
    targetEffects?: SkillEffectDraft[][];
    selfEffects?: SkillEffectDraft[][];
    targetProperties?: SkillPropertyDraft[][];
    selfProperties?: SkillPropertyDraft[][];
    requirements?: SkillRequirement[];
};

type SkillEffectDraft = {
    type: SkillEffectType;
    value?: number;
    chance?: number;
    duration?: number;
};

type SkillPropertyDraft = {
    effect?: SkillPropertyEffect;
    type: SkillPropertyType;
    value?: number;
    duration?: number;
};

export const defineSkill = (draft: SkillDraft): Skill => {
    return {
        guid: draft.guid,
        name: draft.name,
        description: draft.description ?? null,
        imageUrl: draft.imageUrl ?? "blank.png",
        path: draft.path ?? SkillPath.None,
        tier: draft.tier ?? 1,
        types: draft.types,
        physicalAttackFactor: draft.physicalAttackFactor ?? zeroFactors(),
        magicalAttackFactor: draft.magicalAttackFactor ?? zeroFactors(),
        physicalDefenseFactor: draft.physicalDefenseFactor ?? zeroFactors(),
        magicalDefenseFactor: draft.magicalDefenseFactor ?? zeroFactors(),
        isPassive: draft.isPassive ?? false,
        targetSelf: draft.targetSelf ?? false,
        hitCount: draft.hitCount ?? oneFactors(),
        energyCost: draft.energyCost ?? zeroFactors(),
        manaCost: draft.manaCost ?? zeroFactors(),
        targetEffects: fillEffects(draft.targetEffects),
        selfEffects: fillEffects(draft.selfEffects),
        targetProperties: fillProperties(draft.targetProperties),
        selfProperties: fillProperties(draft.selfProperties),
        requirements: draft.requirements ?? [],
    };
};

const fillEffects = (levels: SkillEffectDraft[][] | undefined): SkillEffect[][] => {
    if (levels === undefined) {
        return emptyEffects();
    }
    return levels.map((level) =>
        level.map((effect) => ({
            type: effect.type,
            value: effect.value ?? 0,
            chance: effect.chance ?? 0,
            duration: effect.duration ?? 0,
        })),
    );
};

const fillProperties = (levels: SkillPropertyDraft[][] | undefined): SkillProperty[][] => {
    if (levels === undefined) {
        return emptyProperties();
    }
    return levels.map((level) =>
        level.map((property) => ({
            effect: property.effect ?? SkillPropertyEffect.Additive,
            type: property.type,
            value: property.value ?? 0,
            duration: property.duration ?? 0,
        })),
    );
};

const zeroFactors = (): number[] => Array.from({ length: skillLevel.max }, () => 0);

const oneFactors = (): number[] => Array.from({ length: skillLevel.max }, () => 1);

const emptyEffects = (): SkillEffect[][] => Array.from({ length: skillLevel.max }, () => []);

const emptyProperties = (): SkillProperty[][] => Array.from({ length: skillLevel.max }, () => []);
