export enum UserAttribute {
    Strength = "Strength",
    Dexterity = "Dexterity",
    Constitution = "Constitution",
    Spirit = "Spirit",
}

export type GetAttributesResponse = {
    strength: number;
    dexterity: number;
    constitution: number;
    spirit: number;
    attributePoints: number;
};

export type ExtendAttributeRequest = {
    attribute: UserAttribute;
};

export type ExtendAttributeResponse = GetAttributesResponse;
