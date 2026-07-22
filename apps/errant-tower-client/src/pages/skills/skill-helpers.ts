import { SkillPath, SkillType, type SkillEffect, type SkillProperty } from '../../api/generated/definitions';
import { toLowerFirst } from '../../common/utils';

export const SKILL_FILLS = {
    [SkillPath.None]: [],
    [SkillPath.Blade]: ['#7a1f1f', '#b3242c', '#e63946', '#ff4d5e', '#ffdf6c'],
    [SkillPath.Tenacity]: ['#2f5d34', '#3f8e42', '#5cbf5f', '#8ef28f', '#d4ffb8'],
    [SkillPath.Hammer]: ['#6b4423', '#a1662f', '#d38e3f', '#ffb84d', '#ffe8b0'],
    [SkillPath.Bellicosity]: ['#5c1a2b', '#8a2740', '#c23a5c', '#ff5f8f', '#ffb3c9'],
    [SkillPath.Lance]: ['#1f3a5c', '#2f5a8a', '#4a83c2', '#7ec2ff', '#dbf0ff'],
    [SkillPath.Vivacity]: ['#6b1f5c', '#9c2f8a', '#d349c2', '#ff8fe0', '#ffe0f9'],
    [SkillPath.Bow]: ['#3f5c2f', '#5f8a3f', '#82bf52', '#b6ff7e', '#eaffd4'],
    [SkillPath.Perspicacity]: ['#3a1f5c', '#5a2f8a', '#8349c2', '#b98fff', '#e8dbff'],
    [SkillPath.Staff]: ['#1f5c56', '#2f8a80', '#49c2b5', '#8ffff2', '#dbfffa'],
    [SkillPath.Sagacity]: ['#5c4a1f', '#8a712f', '#c2a049', '#ffe98f', '#fff8db'],
} as const satisfies Record<SkillPath, string[]>;

export const getSkillColor = (path: SkillPath, tier?: number) => SKILL_FILLS[path][tier ?? 2];

export const skillTypeToLabel = (type: SkillType) => `skills.types.${toLowerFirst(type)}`;

export const skillPassiveToLabel = (isPassive: boolean) => (isPassive ? `skills.passive` : `skills.active`);

export const skillEffectToLabel = (effect: SkillEffect) => `skills.effects.${toLowerFirst(effect.type)}`;

export const skillPropertyToLabel = (property: SkillProperty) =>
    `skills.properties.${toLowerFirst(property.type)}`;
