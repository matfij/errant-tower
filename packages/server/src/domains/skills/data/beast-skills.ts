import { SkillEffectType, SkillGuid, SkillType } from "@errant/shared";

import { defineSkill } from "../skill-utils.ts";

export const beastSkills = {
    scratch: defineSkill({
        guid: SkillGuid.Scratch,
        name: "Scratch",
        physicalAttackFactor: [1.1],
        physicalDefenseFactor: [0.8],
        types: [SkillType.Slash],
    }),
    bite: defineSkill({
        guid: SkillGuid.Bite,
        name: "Bite",
        physicalAttackFactor: [1.2],
        physicalDefenseFactor: [0.8],
        types: [SkillType.Pierce],
        targetEffects: [{ type: SkillEffectType.Bleeding, values: [0.25], chance: 0.25, duration: 3 }],
    }),
    tailWhip: defineSkill({
        guid: SkillGuid.TailWhip,
        name: "Tail Whip",
        physicalAttackFactor: [0.8],
        physicalDefenseFactor: [1.2],
        types: [SkillType.Blunt],
        targetEffects: [{ type: SkillEffectType.Stun, values: [0], chance: 0.1, duration: 1 }],
    }),
    tackle: defineSkill({
        guid: SkillGuid.Tackle,
        name: "Tackle",
        physicalAttackFactor: [1.0],
        physicalDefenseFactor: [1.0],
        types: [SkillType.Blunt],
        targetEffects: [{ type: SkillEffectType.Stun, values: [0], chance: 0.2, duration: 1 }],
    }),
    cut: defineSkill({
        guid: SkillGuid.Cut,
        name: "Cut",
        physicalAttackFactor: [1.2],
        physicalDefenseFactor: [0.8],
        types: [SkillType.Slash],
        targetEffects: [{ type: SkillEffectType.Bleeding, values: [0.3], chance: 0.3, duration: 3 }],
    }),
    peck: defineSkill({
        guid: SkillGuid.Peck,
        name: "Peck",
        physicalAttackFactor: [1.3],
        physicalDefenseFactor: [0.8],
        types: [SkillType.Pierce],
    }),
};
