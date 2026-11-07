import type { BattleStatistics } from "@errant/shared";

export type BattleStatisticsDraft = {
    speed?: number;
    maxHealthPoints?: number;
    healthPoints?: number;
    maxManaPoints?: number;
    manaPoints?: number;
    maxEnergyPoints?: number;
    energyPoints?: number;
    physicalAttack?: number;
    magicalAttack?: number;
    physicalDefense?: number;
    magicalDefense?: number;
    physicalAbsorption?: number;
    magicalAbsorption?: number;
    criticalChance?: number;
    physicalCriticalPower?: number;
    magicalCriticalPower?: number;
    punctureChance?: number;
    dodgeChance?: number;
    parryChance?: number;
    blockChance?: number;
    blockPower?: number;
    counterChance?: number;
    healthRegen?: number;
    manaRegen?: number;
    energyRegen?: number;
};

export const defineBattleStatistics = (draft: BattleStatisticsDraft): BattleStatistics => {
    return {
        speed: draft.speed ?? 0,
        maxHealthPoints: draft.maxHealthPoints ?? 0,
        healthPoints: draft.healthPoints ?? 0,
        maxManaPoints: draft.maxManaPoints ?? 0,
        manaPoints: draft.manaPoints ?? 0,
        maxEnergyPoints: draft.maxEnergyPoints ?? 0,
        energyPoints: draft.energyPoints ?? 0,
        physicalAttack: draft.physicalAttack ?? 0,
        magicalAttack: draft.magicalAttack ?? 0,
        physicalDefense: draft.physicalDefense ?? 0,
        magicalDefense: draft.magicalDefense ?? 0,
        physicalAbsorption: draft.physicalAbsorption ?? 0,
        magicalAbsorption: draft.magicalAbsorption ?? 0,
        criticalChance: draft.criticalChance ?? 0,
        physicalCriticalPower: draft.physicalCriticalPower ?? 0,
        magicalCriticalPower: draft.magicalCriticalPower ?? 0,
        punctureChance: draft.punctureChance ?? 0,
        dodgeChance: draft.dodgeChance ?? 0,
        parryChance: draft.parryChance ?? 0,
        blockChance: draft.blockChance ?? 0,
        blockPower: draft.blockPower ?? 0,
        counterChance: draft.counterChance ?? 0,
        healthRegen: draft.healthRegen ?? 0,
        manaRegen: draft.manaRegen ?? 0,
        energyRegen: draft.energyRegen ?? 0,
    };
};
