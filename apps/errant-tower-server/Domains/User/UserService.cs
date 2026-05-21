using ErrantTowerServer.Common;

namespace ErrantTowerServer.Domains.User;

public interface IUserService
{
    Task StartSignUp(string email, string username);
    Task<UserEntity> CompleteSignUp(string email, string actionCode);
    Task StartSignIn(string email);
    Task<UserEntity> CompleteSignIn(string email, string actionCode);
}

public class UserService(
    IUserRepository userRepository,
    IEmailService emailService,
    ILogger<UserService> logger
    ) : IUserService
{
    public async Task StartSignUp(string email, string username)
    {
        var userByEmail = await userRepository.FindOneByEmail(email);
        var restartSignUp = userByEmail is not null
            && userByEmail.IsConfirmed == false
            && userByEmail.ActionCodeExpiresAt < Utils.GetCurrentTimestamp();
        if (restartSignUp == false && userByEmail is not null)
        {
            throw new ApiException(userByEmail.IsConfirmed
                ? "errors.emailInUse"
                : "errors.signUpStarted");
        }

        var userByUsername = await userRepository.FindOneByUsername(username);
        if (userByUsername is not null && userByUsername.Id != userByEmail?.Id)
        {
            throw new ApiException("errors.usernameInUse");
        }

        if (restartSignUp)
        {
            await userRepository.DeleteOne(userByEmail!.Id);
        }

        var userId = Utils.GenerateGuid();
        var actionCode = Utils.GenerateSecureNumberString(6);
        var hashedActionCode = Utils.HashString(actionCode);

        var user = new UserEntity
        {
            Id = userId,
            Email = email,
            Username = username,
            ActionCodeHash = hashedActionCode,
            ActionCodeAttempts = 0,
            ActionCodeExpiresAt = Utils.GetFutureTimestamp(15),
            IsConfirmed = false,
        };

        await userRepository.CreateOne(user);

        try
        {
            await emailService.SendEmailAsync(
                user.Email,
                "Welcome to Errant Tower",
                UserEmailTemplate.GetSignUpTemplate(user.Username, actionCode));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to send sign-up email to {Email}", user.Email);
            await userRepository.DeleteOne(userId);
            throw new ApiException("errors.emailSendFailed");
        }
    }

    public async Task<UserEntity> CompleteSignUp(string email, string actionCode)
    {
        var user = await userRepository.FindOneByEmail(email)
            ?? throw new ApiException("errors.userNotFound");
        if (user.IsConfirmed)
        {
            throw new ApiException("errors.userAlreadyConfirmed");
        }

        await VerifyActionCode(user, actionCode);

        user.IsConfirmed = true;
        user.ActionCodeHash = null;
        user.ActionCodeAttempts = null;
        user.ActionCodeExpiresAt = null;

        await userRepository.UpdateOne(user);

        return user;
    }

    public async Task StartSignIn(string email)
    {
        var user = await GetUserByEmail(email);

        var actionCode = Utils.GenerateSecureNumberString(6);

        user.ActionCodeHash = Utils.HashString(actionCode);
        user.ActionCodeAttempts = 0;
        user.ActionCodeExpiresAt = Utils.GetFutureTimestamp(15);

        await userRepository.UpdateOne(user);

        try
        {
            await emailService.SendEmailAsync(
                user.Email,
                "Errant Tower Sign-In Code",
                UserEmailTemplate.GetSignInTemplate(user.Username, actionCode));

        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to send sign-in email to {Email}", user.Email);
            throw new ApiException("errors.emailSendFailed");
        }
    }

    public async Task<UserEntity> CompleteSignIn(string email, string actionCode)
    {
        var user = await GetUserByEmail(email);

        await VerifyActionCode(user, actionCode);
        
        user.ActionCodeHash = null;
        user.ActionCodeAttempts = null;
        user.ActionCodeExpiresAt = null;

        await userRepository.UpdateOne(user);

        return user;
    }

    private async Task<UserEntity> GetUserByEmail(string email)
    {
        var user = await userRepository.FindOneByEmail(email);
        if (user is null)
        {
            throw new ApiException("errors.userNotFound");
        }
        if (!user.IsConfirmed)
        {
            throw new ApiException("errors.userNotConfirmed");
        }
        return user;
    }

    private async Task VerifyActionCode(UserEntity user, string actionCode)
    {
        if (user.ActionCodeHash is null)
        {
            throw new ApiException("errors.actionCodeNotSet");
        }
        if (user.ActionCodeExpiresAt < Utils.GetCurrentTimestamp())
        {
            throw new ApiException("errors.actionCodeExpired");
        }
        if (user.ActionCodeAttempts >= 3)
        {
            throw new ApiException("errors.actionCodeAttemptsExceeded");
        }
        if (Utils.VerifyHash(actionCode, user.ActionCodeHash) == false)
        {
            user.ActionCodeAttempts++;
            await userRepository.UpdateOne(user);
            throw new ApiException("errors.actionCodeInvalid");
        }
    }
}
