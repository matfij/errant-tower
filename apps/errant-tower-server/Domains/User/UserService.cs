using ErrantTowerServer.Common;

namespace ErrantTowerServer.Domains.User;

public interface IUserService
{
    Task StartSignUp(StartSignUpRequest request);
    Task<CompleteSignUpResponse> CompleteSignUp(CompleteSignUpRequest request);
    Task StartSignIn(StartSignInRequest request);
    Task<CompleteSignInResponse> CompleteSignIn(CompleteSignInRequest request);
}

public class UserService(
    IUserRepository userRepository,
    IEmailService emailService,
    ILogger<UserService> logger) : IUserService
{
    public async Task StartSignUp(StartSignUpRequest request)
    {
        var userByEmail = await userRepository.FindByEmailAsync(request.Email);
        var restartSignUp = userByEmail is not null
            && userByEmail.IsConfirmed == false
            && userByEmail.ActionCodeExpiresAt < Utils.GetCurrentTimestamp();
        if (restartSignUp == false && userByEmail is not null)
        {
            throw new ApiException(userByEmail.IsConfirmed
                ? "errors.emailInUse"
                : "errors.signUpStarted");
        }

        var userByUsername = await userRepository.FindByUsernameAsync(request.Username);
        if (userByUsername is not null && userByUsername.Id != userByEmail?.Id)
        {
            throw new ApiException("errors.usernameInUse");
        }

        if (restartSignUp)
        {
            await userRepository.DeleteAsync(userByEmail!.Id);
        }

        var userId = Utils.GenerateGuid();
        var actionCode = Utils.GenerateSecureNumberString(6);
        var hashedActionCode = Utils.HashString(actionCode);

        var user = new UserEntity
        {
            Id = userId,
            Email = request.Email,
            Username = request.Username,
            ActionCodeHash = hashedActionCode,
            ActionCodeAttempts = 0,
            ActionCodeExpiresAt = Utils.GetFutureTimestamp(15),
            IsConfirmed = false,
        };

        await userRepository.CreateAsync(user);

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
            await userRepository.DeleteAsync(userId);
            throw new ApiException("errors.emailSendFailed");
        }
    }

    public async Task<CompleteSignUpResponse> CompleteSignUp(CompleteSignUpRequest request)
    {
        var user = await userRepository.FindByEmailAsync(request.Email) 
            ?? throw new ApiException("errors.userNotFound");
        if (user.IsConfirmed)
        {
            throw new ApiException("errors.userAlreadyConfirmed");
        }

        await VerifyActionCode(user, request.ActionCode);

        user.IsConfirmed = true;
        user.ActionCodeHash = null;
        user.ActionCodeAttempts = null;
        user.ActionCodeExpiresAt = null;

        await userRepository.UpdateAsync(user);

        return new CompleteSignUpResponse { UserId = user.Id, Username = user.Username };
    }

    public async Task StartSignIn(StartSignInRequest request)
    {
        var user = await GetUserByEmail(request.Email);

        var actionCode = Utils.GenerateSecureNumberString(6);

        user.ActionCodeHash = Utils.HashString(actionCode);
        user.ActionCodeAttempts = 0;
        user.ActionCodeExpiresAt = Utils.GetFutureTimestamp(15);

        await userRepository.UpdateAsync(user);

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

    public async Task<CompleteSignInResponse> CompleteSignIn(CompleteSignInRequest request)
    {
        var user = await GetUserByEmail(request.Email);

        await VerifyActionCode(user, request.ActionCode);
        
        user.ActionCodeHash = null;
        user.ActionCodeAttempts = null;
        user.ActionCodeExpiresAt = null;

        await userRepository.UpdateAsync(user);

        return new CompleteSignInResponse { UserId = user.Id, Username = user.Username };
    }

    private async Task<UserEntity> GetUserByEmail(string email)
    {
        var user = await userRepository.FindByEmailAsync(email);
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
            await userRepository.UpdateAsync(user);
            throw new ApiException("errors.invalidActionCode");
        }
    }
}
