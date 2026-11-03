import { Int32, Long } from "mongodb";

export const dbErrorCodes = {
    duplicatedKey: 11000,
};

export const readNumber = (value: number | Long | Int32 | null): number | null => {
    if (value === null) {
        return null;
    }
    if (typeof value === "number") {
        return value;
    }
    if (value instanceof Long) {
        return value.toNumber();
    }
    return value.valueOf();
};

export const toInt32 = (value: number): Int32 => new Int32(value);
