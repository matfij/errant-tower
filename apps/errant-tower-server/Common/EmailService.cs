using Resend;

namespace ErrantTowerServer.Common;

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string htmlContent);
}

public class EmailService(IConfiguration configuration, IResend resend) : IEmailService
{
    private readonly string _fromAddress = configuration["Email:FromAddress"]
        ?? throw new InvalidOperationException("Email:FromAddress configuration is required");
    private readonly string _fromName = configuration["Email:FromName"]
        ?? throw new InvalidOperationException("Email:FromName configuration is required");

    public async Task SendEmailAsync(string to, string subject, string htmlBody)
    {
        await resend.EmailSendAsync(new EmailMessage()
        {
            From = $"{_fromName} <{_fromAddress}>",
            To = to,
            Subject = subject,
            HtmlBody = htmlBody,
        });
    }
}
