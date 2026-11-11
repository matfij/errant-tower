import { buildApp } from "./app.ts";
import { EmailService } from "./common/email/email-service.ts";
import { config } from "./config.ts";
import { MongoConnector } from "./db/mongo-connector.ts";

const mongo = await MongoConnector.connect({
    uri: config.mongodbUri,
    database: config.mongodbDatabase,
});

const emailService = new EmailService({
    apiKey: config.resendApiKey,
    fromAddress: config.emailFromAddress,
    fromName: config.emailFromName,
});

const app = await buildApp({
    logger: true,
    corsOrigins: config.corsOrigins,
    cookieSecret: config.cookieSecret,
    userRepository: mongo.userRepository,
    statisticsRepository: mongo.statisticsRepository,
    equipmentRepository: mongo.equipmentRepository,
    expeditionRepository: mongo.expeditionRepository,
    battleRepository: mongo.battleRepository,
    emailService,
});

for (const signal of ["SIGINT", "SIGTERM"] as const) {
    process.on(signal, () => {
        void app.close().finally(() => mongo.close());
    });
}

await app.listen({ port: config.port, host: config.host });
