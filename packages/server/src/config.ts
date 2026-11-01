import { existsSync, readFileSync } from "node:fs";

export type ServerConfig = {
    port: number;
    mongodbUri: string;
    mongodbDatabase: string;
    resendApiKey: string;
    emailFromAddress: string;
    emailFromName: string;
    corsOrigins: string[];
    cookieSecret: string;
};

const WEEK_SECONDS = 7 * 24 * 60 * 60;

export const SESSION_TTL_SECONDS = WEEK_SECONDS;
export const SESSION_TTL_MS = WEEK_SECONDS * 1000;
export const ACTION_CODE_TTL_MS = 15 * 60 * 1000;
export const ACTION_CODE_ATTEMPTS = 3;

export function loadEnvFile(path: string): void {
    if (!existsSync(path)) {
        return;
    }

    const text = readFileSync(path, "utf8");
    for (const line of text.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (trimmed === "" || trimmed.startsWith("#")) {
            continue;
        }

        const stripped = trimmed.startsWith("export ") ? trimmed.slice("export ".length).trim() : trimmed;
        const separator = stripped.indexOf("=");
        if (separator === -1) {
            continue;
        }

        const key = stripped.slice(0, separator).trim();
        let value = stripped.slice(separator + 1).trim();
        if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
        ) {
            value = value.slice(1, -1);
        }

        if (key !== "" && process.env[key] === undefined) {
            process.env[key] = value;
        }
    }
}

export function loadConfig(env: NodeJS.ProcessEnv): ServerConfig {
    const port = readPort(env.PORT);
    const corsOrigins = required(env, "CORS_ORIGINS")
        .split(",")
        .map((origin) => origin.trim())
        .filter((origin) => origin !== "");
    if (corsOrigins.length === 0) {
        throw new Error("CORS_ORIGINS must list at least one origin");
    }

    const cookieSecret = required(env, "COOKIE_SECRET");
    if (cookieSecret.length < 32) {
        throw new Error("COOKIE_SECRET must be at least 32 characters");
    }

    return {
        port,
        mongodbUri: required(env, "MONGODB_URI"),
        mongodbDatabase: required(env, "MONGODB_DATABASE"),
        resendApiKey: required(env, "RESEND_API_KEY"),
        emailFromAddress: required(env, "EMAIL_FROM_ADDRESS"),
        emailFromName: required(env, "EMAIL_FROM_NAME"),
        corsOrigins,
        cookieSecret,
    };
}

function required(env: NodeJS.ProcessEnv, name: string): string {
    const value = env[name];
    if (value === undefined || value === "") {
        throw new Error(`Missing environment variable ${name}`);
    }
    return value;
}

function readPort(value: string | undefined): number {
    if (value === undefined || value === "") {
        return 4000;
    }

    const port = Number(value);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error("PORT must be a TCP port");
    }
    return port;
}
