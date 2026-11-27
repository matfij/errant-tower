import { SkillGuid, SkillType } from "@errant/shared";

import { defineSkill } from "../skill-utils";

export const autoSkills = {
    punch: defineSkill({
        guid: SkillGuid.Punch,
        name: "Punch",
        imageUrl: "auto/punch.svg",
        physicalAttackFactor: [1.0],
        physicalDefenseFactor: [1.0],
        types: [SkillType.Blunt],
    }),
};
