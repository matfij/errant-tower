const ROMAN_NUMERALS: [number, string][] = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
];

export const arabicToRoman = (value: number) => {
    let result = '';
    let remaining = value;

    for (const [value, symbol] of ROMAN_NUMERALS) {
        while (remaining >= value) {
            result += symbol;
            remaining -= value;
        }
    }

    return result;
};

export const toLowerFirst = (value: string) => {
    if (typeof value !== 'string' || value.length === 0) {
        return '';
    }
    return value[0].toLowerCase() + value.slice(1);
};

export const toPercentLabel = (value: number) => `${Math.round(100 * value)}%`;
