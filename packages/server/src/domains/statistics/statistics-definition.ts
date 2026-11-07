import type { Skill } from "@errant/shared";

export type UserAttributes = {
    strength: number;
    dexterity: number;
    constitution: number;
    spirit: number;
};

export type SkillTree = {
    skillPoints: number;
    paths: {
        blade: SkillTreeSkill[];
        tenacity: SkillTreeSkill[];
        hammer: SkillTreeSkill[];
        bellicosity: SkillTreeSkill[];
        lance: SkillTreeSkill[];
        vivacity: SkillTreeSkill[];
        bow: SkillTreeSkill[];
        perspicacity: SkillTreeSkill[];
        staff: SkillTreeSkill[];
        sagacity: SkillTreeSkill[];
    };
};

export type SkillTreeSkill = {
    skill: Skill;
    level: number;
};
