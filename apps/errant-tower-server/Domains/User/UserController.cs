using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ErrantTowerServer.Domains.User;

[ApiController]
[Route("users")]
public class UserController(IUserService userService) : ControllerBase
{
    [HttpPost("sign-up/start")]
    [EndpointName("startSignUp")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> StartSignUp([FromBody] StartSignUpRequest request)
    {
        await userService.StartSignUp(request);
        return Ok();
    }

    [HttpPost("sign-up/complete")]
    [EndpointName("completeSignUp")]
    [ProducesResponseType(typeof(CompleteSignUpResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> CompleteSignUp([FromBody] CompleteSignUpRequest request)
    {
        var result = await userService.CompleteSignUp(request);
        await SetSession(result.UserId);
        return Ok(result);
    }

    [HttpPost("sign-in/start")]
    [EndpointName("startSignIn")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> StartSignIn([FromBody] StartSignInRequest request)
    {
        await userService.StartSignIn(request);
        return Ok();
    }

    [HttpPost("sign-in/complete")]
    [EndpointName("completeSignIn")]
    [ProducesResponseType(typeof(CompleteSignInResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> CompleteSignIn([FromBody] CompleteSignInRequest request)
    {
        var result = await userService.CompleteSignIn(request);
        await SetSession(result.UserId);
        return Ok(result);
    }

    [Authorize]
    [HttpGet]
    [EndpointName("getCurrentUser")]
    [ProducesResponseType(typeof(GetCurrentUserResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var user = await userService.GetCurrentUser(userId);
        return user is null ? NotFound() : Ok(user);
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
