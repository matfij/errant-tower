using ErrantTowerServer.Common;

namespace ErrantTowerServer.Domains.User;

public interface IUserService
{
    Task<Result> StartSignUp(StartSignUpRequest request);
    Task<Result<CompleteSignUpResponse>> CompleteSignUp(CompleteSignUpRequest request);
}

public class UserService(IUserRepository userRepository, IEmailService emailService) : IUserService
{
    public async Task<Result> StartSignUp(StartSignUpRequest request)
    {
        if (await userRepository.FindByEmailAsync(request.Email) is not null)
        {
            return Result.Failure([new ApiError { Key = "errors.emailInUse" }]);
        }
        if (await userRepository.FindByUsernameAsync(request.Username) is not null)
        {
            return Result.Failure([new ApiError { Key = "errors.usernameInUse" }]);
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
        catch
        {
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
