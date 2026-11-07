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
}
