export enum SkillGuid {
    // Beast
    Scratch = "Scratch",
    Bite = "Bite",
    TailWhip = "TailWhip",
    Tackle = "Tackle",
    Cut = "Cut",
    Peck = "Peck",

    // Blade
    Slash = "Slash",
    SwiftStrike = "SwiftStrike",
    TwinEdge = "TwinEdge",
    CrusherBlow = "CrusherBlow",
    FlashStrike = "FlashStrike",
    TriEdge = "TriEdge",
    BloodthirstyBlade = "BloodthirstyBlade",

    // Tenacity
    GreatVigor = "GreatVigor",
    Armorer = "Armorer",
    Resistance = "Resistance",
    Energizer = "Energizer",
    Deflect = "Deflect",
    HeartsResolve = "HeartsResolve",
}

export type Skill = {
    guid: SkillGuid;
    name: string;
    description?: string;
    imageUrl: string;
    path: SkillPath;
    tier: number;
    types: SkillType[];
    physicalAttackFactor: number[];
    magicalAttackFactor: number[];
    physicalDefenseFactor: number[];
    magicalDefenseFactor: number[];
    isPassive: boolean;
    targetSelf: boolean;
    hitCount: number[];
    energyCost: number[];
    manaCost: number[];
    targetEffects: SkillEffect[][];
    selfEffects: SkillEffect[][];
    targetProperties: SkillProperty[][];
    selfProperties: SkillProperty[][];
    requirements: SkillRequirement[];
};

export type BattleSkill = {
    guid: SkillGuid;
    name: string;
    description?: string;
    imageUrl: string;
    path: SkillPath;
    types: SkillType[];
    physicalAttackFactor: number;
    magicalAttackFactor: number;
    physicalDefenseFactor: number;
    magicalDefenseFactor: number;
    isPassive: boolean;
    targetSelf: boolean;
    hitCount: number;
    energyCost: number;
    manaCost: number;
    targetEffects: SkillEffect[];
    selfEffects: SkillEffect[];
    targetProperties: SkillProperty[];
    selfProperties: SkillProperty[];
    requirements: SkillRequirement[];
};

export type SkillEffect = {
    type: SkillEffectType;
    value: number;
    chance: number;
    duration: number;
};

export type SkillProperty = {
    effect: SkillPropertyEffect;
    type: SkillPropertyType;
    value: number;
    duration: number;
};

export type SkillRequirement = {
    path: SkillPath;
    points: number;
};

export enum SkillPath {
    None = "None",
    Blade = "Blade",
    Tenacity = "Tenacity",
    Hammer = "Hammer",
    Bellicosity = "Bellicosity",
    Lance = "Lance",
    Vivacity = "Vivacity",
    Bow = "Bow",
    Perspicacity = "Perspicacity",
    Staff = "Staff",
    Sagacity = "Sagacity",
}

export enum SkillType {
    None = "None",
    Slash = "Slash",
    Pierce = "Pierce",
    Blunt = "Blunt",
    Fire = "Fire",
    Water = "Water",
    Earth = "Earth",
    Wind = "Wind",
    Electric = "Electric",
    Light = "Light",
    Dark = "Dark",
    Heal = "Heal",
    Buff = "Buff",
}

export enum SkillEffectType {
    Initiative = "Initiative",
    PhysicalAttack = "PhysicalAttack",
    MagicalAttack = "MagicalAttack",
    PhysicalDefense = "PhysicalDefense",
    MagicalDefense = "MagicalDefense",
    HealthPoints = "HealthPoints",
    ManaPoints = "ManaPoints",
    EnergyPoints = "EnergyPoints",
    Stun = "Stun",
    Freeze = "Freeze",
    Paralyze = "Paralyze",
    Bleeding = "Bleeding",
    Poison = "Poison",
    Barrier = "Barrier",
}

export enum SkillPropertyType {
    Initiative = "Initiative",
    PhysicalAttack = "PhysicalAttack",
    MagicalAttack = "MagicalAttack",
    PhysicalDefense = "PhysicalDefense",
    MagicalDefense = "MagicalDefense",
    HealthPoints = "HealthPoints",
    ManaPoints = "ManaPoints",
    EnergyPoints = "EnergyPoints",
    CriticalChance = "CriticalChance",
    PhysicalCriticalPower = "PhysicalCriticalPower",
    MagicalCriticalPower = "MagicalCriticalPower",
    PunctureChance = "PunctureChance",
    DodgeChance = "DodgeChance",
    ParryChance = "ParryChance",
    BlockChance = "BlockChance",
    BlockPower = "BlockPower",
    CounterChance = "CounterChance",
    HealthRegen = "HealthRegen",
    ManaRegen = "ManaRegen",
    PhysicalDeflect = "PhysicalDeflect",
    MagicalDeflect = "MagicalDeflect",
}

export enum SkillPropertyEffect {
    Additive = "Additive",
    Multiplicative = "Multiplicative",
}
