using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;

namespace ErrantTowerServer.Orchestrator;

[ApiController]
[Route("auth")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("sign-up/start")]
    [EndpointName("startSignUp")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> StartSignUp([FromBody] StartSignUpRequest request)
    {
        await authService.StartSignUp(request);
        return Ok();
    }

    [HttpPost("sign-up/complete")]
    [EndpointName("completeSignUp")]
    [ProducesResponseType(typeof(CompleteSignUpResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> CompleteSignUp([FromBody] CompleteSignUpRequest request)
    {
        var result = await authService.CompleteSignUp(request);
        await SetSession(result.UserId);
        return Ok(result);
    }

    [HttpPost("sign-in/start")]
    [EndpointName("startSignIn")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> StartSignIn([FromBody] StartSignInRequest request)
    {
        await authService.StartSignIn(request);
        return Ok();
    }

    [HttpPost("sign-in/complete")]
    [EndpointName("completeSignIn")]
    [ProducesResponseType(typeof(CompleteSignInResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> CompleteSignIn([FromBody] CompleteSignInRequest request)
    {
        var result = await authService.CompleteSignIn(request);
        await SetSession(result.UserId);
        return Ok(result);
    }

    private async Task SetSession(string userId)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, userId)
        };

        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

        var principal = new ClaimsPrincipal(identity);

        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            principal,
            new AuthenticationProperties { IsPersistent = true });
    }
}

public static class ClaimsPrincipalExtensions
{
    public static string GetUserId(this ClaimsPrincipal user)
    {
        return user.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException();
    }
}
