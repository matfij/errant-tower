import type { SkillGuid } from "@errant/shared";

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
