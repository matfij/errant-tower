const env = (name: string): string => {
    const value = process.env[name];
    if (value === undefined || value === "") {
        throw new Error(`Missing environment variable ${name}`);
    }
    return value;
};

export const config = {
    port: Number(process.env.PORT) || 4000,
    host: env("HOST"),
    mongodbUri: env("MONGODB_URI"),
    mongodbDatabase: env("MONGODB_DATABASE"),
    resendApiKey: env("RESEND_API_KEY"),
    emailFromAddress: env("EMAIL_FROM_ADDRESS"),
    emailFromName: env("EMAIL_FROM_NAME"),
    corsOrigins: env("CORS_ORIGINS")
        .split(",")
        .map((origin) => origin.trim())
        .filter((origin) => origin !== ""),
    cookieSecret: env("COOKIE_SECRET"),
    sessionTtlSeconds: 7 * 24 * 60 * 60,
    sessionTtlMs: 7 * 24 * 60 * 60 * 1000,
    actionCodeTtlMs: 15 * 60 * 1000,
    actionCodeAttempts: 3,
} as const;
