import { randomUUID } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { buildApp } from "./app.ts";
import { generateActionCode } from "./auth/action-code.ts";
import { loadConfig, loadEnvFile } from "./config.ts";
import { connectMongo } from "./db/mongo-store.ts";
import { createResendSender } from "./email/resend.ts";

loadEnvFile(resolve(dirname(fileURLToPath(import.meta.url)), "../.env"));

const config = loadConfig(process.env);
const mongo = await connectMongo({
    uri: config.mongodbUri,
    database: config.mongodbDatabase,
});

const app = await buildApp({
    logger: true,
    corsOrigins: config.corsOrigins,
    cookieSecret: config.cookieSecret,
    users: mongo.users,
    emails: createResendSender({
        apiKey: config.resendApiKey,
        fromAddress: config.emailFromAddress,
        fromName: config.emailFromName,
    }),
    now: () => Date.now(),
    newId: () => randomUUID(),
    newActionCode: generateActionCode,
});

app.addHook("onClose", async () => {
    await mongo.close();
});

for (const signal of ["SIGINT", "SIGTERM"] as const) {
    process.on(signal, () => {
        void app.close();
    });
}

await app.listen({ port: config.port, host: "0.0.0.0" });
