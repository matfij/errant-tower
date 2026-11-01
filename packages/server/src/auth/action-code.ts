import { createHash, randomInt, timingSafeEqual } from "node:crypto";

export function generateActionCode(): string {
    let code = "";
    for (let index = 0; index < 6; index += 1) {
        code += randomInt(0, 10).toString();
    }
    return code;
}

export function hashActionCode(value: string): string {
    return createHash("sha256").update(value, "utf8").digest("base64");
}

export function actionCodeMatches(value: string, hash: string): boolean {
    const computed = createHash("sha256").update(value, "utf8").digest();
    const stored = Buffer.from(hash, "base64");
    if (stored.length !== computed.length) {
        return false;
    }
    return timingSafeEqual(computed, stored);
}
