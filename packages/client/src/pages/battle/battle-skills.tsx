import type { GetBattleResponse } from "@errant/shared";

import { SkillItem } from "../skills/skill-item";
import { toUserSkill } from "./battle-utils";

import styles from "./battle-skills.module.scss";

interface BattleSkillsProps {
    skills: GetBattleResponse["skills"];
}

export const BattleSkills = (props: BattleSkillsProps) => {
    return (
        <section className={styles.skillsWrapper}>
            {props.skills.map((skill) => (
                <div key={skill.guid} className={styles.skillItem}>
                    <SkillItem skill={toUserSkill(skill)} />
                </div>
            ))}
        </section>
    );
};
