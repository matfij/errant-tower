import { createHash, randomInt, timingSafeEqual } from "node:crypto";

export class UserUtilsService {
    static actionCodeExpired(expiresAt: number | null, now: number): boolean {
        return expiresAt !== null && expiresAt < now;
    }

    static generateActionCode(): string {
        let code = "";
        for (let index = 0; index < 6; index += 1) {
            code += randomInt(0, 10).toString();
        }
        return code;
    }

    static hashActionCode(value: string): string {
        return createHash("sha256").update(value, "utf8").digest("base64");
    }

    static actionCodeMatches(value: string, hash: string): boolean {
        const computed = createHash("sha256").update(value, "utf8").digest();
        const stored = Buffer.from(hash, "base64");
        if (stored.length !== computed.length) {
            return false;
        }
        return timingSafeEqual(computed, stored);
    }
}
