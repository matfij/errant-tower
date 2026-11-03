import { randomUUID } from "node:crypto";

export class UtilsService {
    static timeNow(): number {
        return Date.now();
    }

    static newId(): string {
        return randomUUID();
    }
}
