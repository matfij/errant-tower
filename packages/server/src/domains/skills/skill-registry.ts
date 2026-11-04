import { HttpError } from "../../common/http/errors.ts";
import { beastSkills } from "./data/beast-skills.ts";
import { bladeSkills } from "./data/blade-skills.ts";
import { tenacitySkills } from "./data/tenacity-skills.ts";
import { SkillGuid, type Skill } from "./skill-definition.ts";

export const skills = {
    [SkillGuid.Scratch]: beastSkills.scratch,
    [SkillGuid.Bite]: beastSkills.bite,
    [SkillGuid.TailWhip]: beastSkills.tailWhip,
    [SkillGuid.Tackle]: beastSkills.tackle,
    [SkillGuid.Cut]: beastSkills.cut,
    [SkillGuid.Peck]: beastSkills.peck,
    [SkillGuid.Slash]: bladeSkills.slash,
    [SkillGuid.SwiftStrike]: bladeSkills.swiftStrike,
    [SkillGuid.TwinEdge]: bladeSkills.twinEdge,
    [SkillGuid.CrusherBlow]: bladeSkills.crusherBlow,
    [SkillGuid.FlashStrike]: bladeSkills.flashStrike,
    [SkillGuid.TriEdge]: bladeSkills.triEdge,
    [SkillGuid.BloodthirstyBlade]: bladeSkills.bloodthirstyBlade,
    [SkillGuid.GreatVigor]: tenacitySkills.greatVigor,
    [SkillGuid.Armorer]: tenacitySkills.armorer,
    [SkillGuid.Resistance]: tenacitySkills.resistance,
    [SkillGuid.Energizer]: tenacitySkills.energizer,
    [SkillGuid.Deflect]: tenacitySkills.deflect,
    [SkillGuid.HeartsResolve]: tenacitySkills.heartsResolve,
} satisfies Record<SkillGuid, Skill>;

export const getSkill = (guid: string): Skill => {
    if (!isSkillGuid(guid)) {
        throw new HttpError("errors.skillNotDefined");
    }
    return skills[guid];
};

const isSkillGuid = (guid: string): guid is SkillGuid => Object.hasOwn(skills, guid);
