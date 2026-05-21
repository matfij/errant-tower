using ErrantTowerServer.Domains.Progress;
using ErrantTowerServer.Domains.Statistics;
using ErrantTowerServer.Domains.User;

namespace ErrantTowerServer.Orchestrator;

public interface IAuthService
{
    public Task StartSignUp(StartSignUpRequest request);
    public Task<CompleteSignUpResponse> CompleteSignUp(CompleteSignUpRequest request);
    public Task StartSignIn(StartSignInRequest request);
    public Task<CompleteSignInResponse> CompleteSignIn(CompleteSignInRequest request);
}
public class AuthService(
    IUserService userService,
    IProgressService progressService,
    IStatisticsService statisticsService
    ) : IAuthService
{
    public async Task StartSignUp(StartSignUpRequest request)
    {
        await userService.StartSignUp(request.Email, request.Username);
    }

    public async Task<CompleteSignUpResponse> CompleteSignUp(CompleteSignUpRequest request)
    {
        var user = await userService.CompleteSignUp(request.Email, request.ActionCode);
        await progressService.CreateInitial(user.Id);
        await statisticsService.CreateInitial(user.Id);
        return new CompleteSignUpResponse
        {
            UserId = user.Id,
            Username = user.Username
        };
    }

    public async Task StartSignIn(StartSignInRequest request)
    {
        await userService.StartSignIn(request.Email);
    }

    public async Task<CompleteSignInResponse> CompleteSignIn(CompleteSignInRequest request)
    {
        var user = await userService.CompleteSignIn(request.Email, request.ActionCode);
        return new CompleteSignInResponse
        {
            UserId = user.Id,
            Username = user.Username
        };
    }
}
