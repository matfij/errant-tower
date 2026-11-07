import { SkillGuid, SkillPath, SkillPropertyEffect, SkillPropertyType, SkillType } from "@errant/shared";

import { defineSkill } from "../skill-utils.ts";

export const tenacitySkills = {
    greatVigor: defineSkill({
        guid: SkillGuid.GreatVigor,
        name: "Great Vigor",
        imageUrl: "tenacity/great-vigor.svg",
        path: SkillPath.Tenacity,
        tier: 0,
        types: [SkillType.Buff],
        isPassive: true,
        selfProperties: [
            {
                effect: SkillPropertyEffect.Multiplicative,
                type: SkillPropertyType.HealthPoints,
                values: [1.01, 1.02, 1.03, 1.04, 1.05, 1.06, 1.07, 1.08, 1.09, 1.1],
            },
        ],
    }),
    armorer: defineSkill({
        guid: SkillGuid.Armorer,
        name: "Armorer",
        imageUrl: "tenacity/armorer.svg",
        path: SkillPath.Tenacity,
        tier: 1,
        types: [SkillType.Buff],
        isPassive: true,
        selfProperties: [
            {
                effect: SkillPropertyEffect.Multiplicative,
                type: SkillPropertyType.PhysicalDefense,
                values: [1.01, 1.02, 1.03, 1.04, 1.05, 1.06, 1.07, 1.08, 1.09, 1.1],
            },
        ],
        requirements: [{ path: SkillPath.Tenacity, points: 3 }],
    }),
    resistance: defineSkill({
        guid: SkillGuid.Resistance,
        name: "Resistance",
        imageUrl: "tenacity/resistance.svg",
        path: SkillPath.Tenacity,
        tier: 1,
        types: [SkillType.Buff],
        isPassive: true,
        selfProperties: [
            {
                effect: SkillPropertyEffect.Multiplicative,
                type: SkillPropertyType.MagicalDefense,
                values: [1.01, 1.02, 1.03, 1.04, 1.05, 1.06, 1.07, 1.08, 1.09, 1.1],
            },
        ],
        requirements: [{ path: SkillPath.Tenacity, points: 3 }],
    }),
    energizer: defineSkill({
        guid: SkillGuid.Energizer,
        name: "Energizer",
        imageUrl: "tenacity/energizer.svg",
        path: SkillPath.Tenacity,
        tier: 2,
        types: [SkillType.Buff],
        isPassive: true,
        selfProperties: [
            {
                effect: SkillPropertyEffect.Multiplicative,
                type: SkillPropertyType.EnergyPoints,
                values: [1.02, 1.04, 1.06, 1.08, 1.1, 1.12, 1.14, 1.16, 1.18, 1.2],
            },
        ],
        requirements: [{ path: SkillPath.Tenacity, points: 3 }],
    }),
    deflect: defineSkill({
        guid: SkillGuid.Deflect,
        name: "Deflect",
        imageUrl: "tenacity/deflect.svg",
        path: SkillPath.Tenacity,
        tier: 2,
        types: [SkillType.Buff],
        isPassive: true,
        selfProperties: [
            {
                type: SkillPropertyType.BlockChance,
                values: [0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1],
            },
        ],
        requirements: [{ path: SkillPath.Tenacity, points: 12 }],
    }),
    heartsResolve: defineSkill({
        guid: SkillGuid.HeartsResolve,
        name: "Heart's Resolve",
        imageUrl: "tenacity/hearts-resolve.svg",
        path: SkillPath.Tenacity,
        tier: 2,
        types: [SkillType.Buff],
        isPassive: true,
        selfProperties: [
            {
                type: SkillPropertyType.HealthRegen,
                values: [0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1],
            },
        ],
        requirements: [{ path: SkillPath.Tenacity, points: 12 }],
    }),
};
