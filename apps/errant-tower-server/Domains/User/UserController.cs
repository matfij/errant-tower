using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;

namespace ErrantTowerServer.Domains.User;

[ApiController]
[Route("users")]
public class UserController(IUserService userService) : ControllerBase
{
    [HttpPost("startSignUp")]
    public async Task<IActionResult> StartSignUp([FromBody] StartSignUpRequest request)
    {
        await userService.StartSignUp(request);
        return Ok();
    }

    [HttpPost("completeSignUp")]
    public async Task<IActionResult> CompleteSignUp([FromBody] CompleteSignUpRequest request)
    {
        var result = await userService.CompleteSignUp(request);
        await SetSession(result.UserId);
        return Ok(result);
    }

    [HttpPost("startSignIn")]
    public async Task<IActionResult> StartSignIn([FromBody] StartSignInRequest request)
    {
        await userService.StartSignIn(request);
        return Ok();
    }

    [HttpPost("completeSignIn")]
    public async Task<IActionResult> CompleteSignIn([FromBody] CompleteSignInRequest request)
    {
        var result = await userService.CompleteSignIn(request);
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
