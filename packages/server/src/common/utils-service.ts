import { randomUUID } from "node:crypto";

export class UtilsService {
    static timeNow(): number {
        return Date.now();
    }

    static newId(): string {
        return randomUUID();
    }

    static round(value: number, precision: number) {
        const factor = 10 ** precision;
        return Math.round(factor * value) / factor;
    }

    static checkChance(chance: number): boolean {
        return chance > Math.random();
    }

    static randomInt(min: number, max: number): number {
        return min + Math.floor(Math.random() * (max - min + 1));
    }

    static randomFloat(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    static pickWeighted<TGuid>(items: { guid: TGuid; chance: number }[]): TGuid {
        const totalChance = items.reduce((total, item) => total + item.chance, 0);
        let targetChance = Math.random() * totalChance;
        for (const item of items) {
            targetChance -= item.chance;
            if (targetChance <= 0) {
                return item.guid;
            }
        }
        return items[items.length - 1].guid;
    }
}
