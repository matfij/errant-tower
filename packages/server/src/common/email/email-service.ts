import { Resend } from "resend";

export class EmailService {
    private readonly resend: Resend;
    private readonly from: string;

    constructor(options: { apiKey: string; fromAddress: string; fromName: string }) {
        this.resend = new Resend(options.apiKey);
        this.from = `${options.fromName} <${options.fromAddress}>`;
    }

    async send(to: string, subject: string, html: string): Promise<void> {
        const result = await this.resend.emails.send({
            from: this.from,
            to,
            subject,
            html,
        });
        if (result.error) {
            throw new Error(result.error.message);
        }
    }
}
