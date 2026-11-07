import {
    SkillPath,
    SkillPropertyEffect,
    SkillType,
    type GetSkillTreeResponse,
    type SkillEffect,
    type SkillGuid,
    type SkillProperty,
    type UserSkill,
} from "@errant/shared";
import { useTranslation } from "react-i18next";

import { toLowerFirst, toPercentLabel } from "../../common/utils";

export const SKILL_MAX_LEVEL = 10;

export const SKILL_FILLS = {
    [SkillPath.None]: [],
    [SkillPath.Blade]: ["#7a1f1f", "#b3242c", "#e63946", "#ff4d5e", "#ffdf6c"],
    [SkillPath.Tenacity]: ["#2f5d34", "#3f8e42", "#5cbf5f", "#8ef28f", "#d4ffb8"],
    [SkillPath.Hammer]: ["#6b4423", "#a1662f", "#d38e3f", "#ffb84d", "#ffe8b0"],
    [SkillPath.Bellicosity]: ["#5c1a2b", "#8a2740", "#c23a5c", "#ff5f8f", "#ffb3c9"],
    [SkillPath.Lance]: ["#1f3a5c", "#2f5a8a", "#4a83c2", "#7ec2ff", "#dbf0ff"],
    [SkillPath.Vivacity]: ["#6b1f5c", "#9c2f8a", "#d349c2", "#ff8fe0", "#ffe0f9"],
    [SkillPath.Bow]: ["#3f5c2f", "#5f8a3f", "#82bf52", "#b6ff7e", "#eaffd4"],
    [SkillPath.Perspicacity]: ["#3a1f5c", "#5a2f8a", "#8349c2", "#b98fff", "#e8dbff"],
    [SkillPath.Staff]: ["#1f5c56", "#2f8a80", "#49c2b5", "#8ffff2", "#dbfffa"],
    [SkillPath.Sagacity]: ["#5c4a1f", "#8a712f", "#c2a049", "#ffe98f", "#fff8db"],
} as const satisfies Record<SkillPath, string[]>;

const SKILL_BASE_ATTRIBUTES = [
    "physicalAttackFactor",
    "magicalAttackFactor",
    "physicalDefenseFactor",
    "magicalDefenseFactor",
] as const;

const PATH_KEYS = [
    "blade",
    "tenacity",
    "hammer",
    "bellicosity",
    "lance",
    "vivacity",
    "bow",
    "perspicacity",
    "staff",
    "sagacity",
] as const;

type PathKey = (typeof PATH_KEYS)[number];

export const PATH_TO_PATH_KEY: Record<SkillPath, PathKey | null> = {
    [SkillPath.None]: null,
    [SkillPath.Blade]: "blade",
    [SkillPath.Tenacity]: "tenacity",
    [SkillPath.Hammer]: "hammer",
    [SkillPath.Bellicosity]: "bellicosity",
    [SkillPath.Lance]: "lance",
    [SkillPath.Vivacity]: "vivacity",
    [SkillPath.Bow]: "bow",
    [SkillPath.Perspicacity]: "perspicacity",
    [SkillPath.Staff]: "staff",
    [SkillPath.Sagacity]: "sagacity",
};

interface PathData {
    name: string;
    skillTiers: Record<number, UserSkill[]>;
    level: number;
}

type Paths = Record<PathKey, PathData>;

export const getSkillColor = (path: SkillPath, tier?: number) => SKILL_FILLS[path][tier ?? 2];

export const skillPathToLabel = (path: SkillPath) => `skills.paths.${toLowerFirst(path)}`;

export const skillTypeToLabel = (type: SkillType) => `skills.types.${toLowerFirst(type)}`;

export const skillPassiveToLabel = (isPassive: boolean) => (isPassive ? `skills.passive` : `skills.active`);

export const skillEffectToLabel = (effect: SkillEffect) => `skills.effects.${toLowerFirst(effect.type)}`;

export const skillPropertyToLabel = (property: SkillProperty) =>
    `skills.properties.${toLowerFirst(property.type)}`;

const toPropertyPercent = (property: SkillProperty, level: number) => {
    const value = property.values[level];
    if (property.effect === SkillPropertyEffect.Multiplicative) {
        return value - 1;
    }
    return value;
};

export const toPaths = (skillTree: GetSkillTreeResponse): Paths => {
    return PATH_KEYS.reduce((all, key) => {
        all[key] = {
            name: `skills.paths.${key}`,
            skillTiers: skillTree.paths[key].reduce<Record<number, UserSkill[]>>((tiers, skill) => {
                (tiers[skill.tier] ??= []).push(skill);
                return tiers;
            }, {}),
            level: skillTree.paths[key].reduce((level, skill) => level + skill.level, 0),
        };
        return all;
    }, {} as Paths);
};

export const findSkill = (skillTree: GetSkillTreeResponse, guid: SkillGuid): UserSkill | null => {
    for (const key of PATH_KEYS) {
        const skill = skillTree.paths[key].find((item) => item.guid === guid) ?? null;
        if (skill !== null) {
            return skill;
        }
    }
    return null;
};

export const useSkillLabels = (skill: UserSkill) => {
    const { t } = useTranslation();

    const isLearned = skill.level > 0;
    const currentLevel = isLearned ? skill.level - 1 : 0;

    const skillMeta =
        t(skillPassiveToLabel(skill.isPassive)) +
        ", " +
        skill.types.map((type) => t(skillTypeToLabel(type))).join(", ");

    const isRelevant = (attribute: unknown) =>
        attribute instanceof Array && attribute.some((item) => item !== 0);
    const relevantAttributes = SKILL_BASE_ATTRIBUTES.map((attribute) => ({
        name: attribute,
        levels: skill[attribute],
    })).filter((attribute) => isRelevant(attribute.levels));

    const hasSelfSection = skill.selfEffects.length > 0 || skill.selfProperties.length > 0;

    const hasTargetSection = skill.targetEffects.length > 0 || skill.targetProperties.length > 0;

    const getAttributeLabel = (name: string, value: number) =>
        t(`skills.attributes.${name}`) + ": " + toPercentLabel(value);

    const getEffectLabel = (effect: SkillEffect, level: number, skipName?: boolean) =>
        (skipName ? "" : t(skillEffectToLabel(effect)) + ": ") +
        (effect.values[level] !== 0 ? toPercentLabel(effect.values[level]) : t("skills.notApplicable")) +
        (effect.chance > 0 ? ", " + t("skills.chance", { chance: toPercentLabel(effect.chance) }) : "") +
        (effect.duration > 0 ? ", " + t("skills.duration", { count: effect.duration }) : "");

    const getPropertyLabel = (property: SkillProperty, level: number, skipName?: boolean) =>
        (skipName ? "" : t(skillPropertyToLabel(property)) + ": ") +
        toPercentLabel(toPropertyPercent(property, level)) +
        (property.duration > 0 ? ", " + t("skills.duration", { count: property.duration }) : "");

    return {
        currentLevel,
        skillMeta,
        relevantAttributes,
        hasSelfSection,
        hasTargetSection,
        getAttributeLabel,
        getEffectLabel,
        getPropertyLabel,
    };
};
