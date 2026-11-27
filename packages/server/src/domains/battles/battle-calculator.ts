import { SkillGuid, type BattleCharacter, type BattleSkill } from "@errant/shared";

import { HttpError } from "../../common/http/errors";
import { BattleEntity } from "./battle-entity";

export class BattleCalculator {
    public static act(battle: BattleEntity, skillGuid: SkillGuid) {
        const user = battle.user;
        const enemy = battle.enemy;

        const skill = user.skills.find((s) => s.guid === skillGuid);

        if (!skill) {
            throw new HttpError("errors.skillNotFound");
        }
        if (skill.manaCost > user.statistics.manaPoints) {
            throw new HttpError("errors.notEnoughMana");
        }
        if (skill.energyCost > user.statistics.energyPoints) {
            throw new HttpError("errors.notEnoughEnergy");
        }

        user.statistics.energyPoints -= skill.energyCost;
        user.statistics.manaPoints -= skill.manaCost;

        user.initiative -= enemy.statistics.speed;
        battle.turnNumber += 1;
        this.actSkill(user, enemy, skill);

        while (
            enemy.initiative > user.initiative &&
            enemy.statistics.healthPoints > 0 &&
            user.statistics.healthPoints > 0
        ) {
            enemy.initiative -= user.statistics.speed;
            battle.turnNumber += 1;
            this.actSkill(enemy, user, enemy.skills[battle.enemySkillIndex]);
            battle.enemySkillIndex += 1;
            if (battle.enemySkillIndex >= enemy.skills.length) {
                battle.enemySkillIndex = 0;
            }
        }
    }

    public static actSkill(actor: BattleCharacter, opponent: BattleCharacter, skill: BattleSkill) {
        if (skill.targetSelf) {
            const heal =
                skill.physicalAttackFactor * actor.statistics.physicalAttack +
                skill.magicalAttackFactor * actor.statistics.magicalAttack;

            actor.statistics.healthPoints = Math.min(
                actor.statistics.maxHealthPoints,
                actor.statistics.healthPoints + heal,
            );
        } else {
            const baseDamage =
                skill.physicalAttackFactor * actor.statistics.physicalAttack +
                skill.magicalAttackFactor * actor.statistics.magicalAttack;
            const damageReduction =
                skill.physicalDefenseFactor * opponent.statistics.physicalDefense +
                skill.magicalDefenseFactor * opponent.statistics.magicalDefense;

            const damage = baseDamage - damageReduction;
            opponent.statistics.healthPoints = Math.max(0, opponent.statistics.healthPoints - damage);
        }
    }
}
