export type BattleStatistics = {
    speed: number;
    maxHealthPoints: number;
    healthPoints: number;
    maxManaPoints: number;
    manaPoints: number;
    maxEnergyPoints: number;
    energyPoints: number;
    physicalAttack: number;
    magicalAttack: number;
    physicalDefense: number;
    magicalDefense: number;
    physicalAbsorption: number;
    magicalAbsorption: number;
    criticalChance: number;
    physicalCriticalPower: number;
    magicalCriticalPower: number;
    punctureChance: number;
    dodgeChance: number;
    parryChance: number;
    blockChance: number;
    blockPower: number;
    counterChance: number;
    healthRegen: number;
    manaRegen: number;
    energyRegen: number;
};

export type UserAttributes = {
    strength: number;
    dexterity: number;
    constitution: number;
    spirit: number;
};

export enum UserAttribute {
    Strength = "Strength",
    Dexterity = "Dexterity",
    Constitution = "Constitution",
    Spirit = "Spirit",
}
