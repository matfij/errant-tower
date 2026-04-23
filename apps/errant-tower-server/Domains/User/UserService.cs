using ErrantTowerServer.Common;

namespace ErrantTowerServer.Domains.User;

public interface IUserService
{
    Task<Result> StartSignUp(StartSignUpRequest request);
    Task<Result<CompleteSignUpResponse>> CompleteSignUp(CompleteSignUpRequest request);
}

public class UserService(
    IUserRepository userRepository, 
    IEmailService emailService,
    ILogger<UserService> logger) : IUserService
{
    public async Task<Result> StartSignUp(StartSignUpRequest request)
    {
        var userByEmail = await userRepository.FindByEmailAsync(request.Email);
        var restartSignUp = userByEmail is not null 
            && userByEmail.IsConfirmed == false 
            && userByEmail.ActionCodeExpiresAt < Utils.GetCurrentTimestamp();
        if (restartSignUp == false && userByEmail is not null)
        {
            return userByEmail.IsConfirmed 
                ? Result.Failure([new ApiError { Key = "errors.emailInUse" }])
                : Result.Failure([new ApiError { Key = "errors.signUpStarted" }]);
        }

        var userByUsername = await userRepository.FindByUsernameAsync(request.Username);
        if (userByUsername is not null && userByUsername.Id != userByEmail?.Id)
        {
            return Result.Failure([new ApiError { Key = "errors.usernameInUse" }]);
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
                UserEmailTemaplte.GetSignUpTemplate(user.Username, actionCode));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to send sign-up email to {Email}", user.Email);
            await userRepository.DeleteAsync(userId);
            return Result.Failure([new ApiError { Key = "errors.emailSendFailed" }]);
        }


        return Result.Success();
    }

    public async Task<Result<CompleteSignUpResponse>> CompleteSignUp(CompleteSignUpRequest request)
    {
        var user = await userRepository.FindByEmailAsync(request.Email);

        if (user is null)
        {
            return Result<CompleteSignUpResponse>.Failure([new ApiError { Key = "errors.userNotFound" }]);
        }
        if (user.IsConfirmed)
        {
            return Result<CompleteSignUpResponse>.Failure([new ApiError { Key = "errors.userAlreadyConfirmed" }]);
        }

        if (user.ActionCodeHash is null)
        {
            return Result<CompleteSignUpResponse>.Failure([new ApiError { Key = "errors.actionCodeNotSet" }]);
        }
        if (user.ActionCodeExpiresAt < Utils.GetCurrentTimestamp())
        {
            return Result<CompleteSignUpResponse>.Failure([new ApiError { Key = "errors.actionCodeExpired" }]);
        }
        if (user.ActionCodeAttempts >= 3)
        {
            return Result<CompleteSignUpResponse>.Failure([new ApiError { Key = "errors.actionCodeAttemptsExceeded" }]);
        }
        if (Utils.VerifyHash(request.ActionCode, user.ActionCodeHash) == false)
        {
            user.ActionCodeAttempts++;
            await userRepository.UpdateAsync(user);
            return Result<CompleteSignUpResponse>.Failure([new ApiError { Key = "errors.invalidActionCode" }]);
        }

        user.IsConfirmed = true;
        user.ActionCodeHash = null;
        user.ActionCodeAttempts = null;
        user.ActionCodeExpiresAt = null;

        await userRepository.UpdateAsync(user);

        return Result<CompleteSignUpResponse>.Success(new CompleteSignUpResponse { Username = user.Username });
    }

}
