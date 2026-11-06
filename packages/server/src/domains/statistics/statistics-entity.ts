import type { SkillGuid } from "../skills/skill-definition.ts";

export type StatisticsEntity = {
    id: string;
    userId: string;
    attributePoints: number;
    skillPoints: number;
    strength: number;
    dexterity: number;
    constitution: number;
    spirit: number;
    learnedSkills: LearnedSkill[];
};

export type LearnedSkill = {
    guid: SkillGuid;
    level: number;
};
