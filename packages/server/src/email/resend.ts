import { Resend } from "resend";

export type EmailSender = {
    send(to: string, subject: string, html: string): Promise<void>;
};

export function createResendSender(options: {
    apiKey: string;
    fromAddress: string;
    fromName: string;
}): EmailSender {
    const resend = new Resend(options.apiKey);
    const from = `${options.fromName} <${options.fromAddress}>`;

    return {
        async send(to, subject, html) {
            const result = await resend.emails.send({
                from,
                to,
                subject,
                html,
            });
            if (result.error) {
                throw new Error(result.error.message);
            }
        },
    };
}
