using ErrantTowerServer.Common;
using Microsoft.AspNetCore.Mvc;

namespace ErrantTowerServer.Domains.User;

[ApiController]
[Route("user")]
public class UserController(IUserService userService) : ControllerBase
{
    [HttpPost("startSignUp")]
    public async Task<IActionResult> StartSignUp([FromBody] StartSignUpRequest request)
    {
        return (await userService.StartSignUp(request)).ToActionResult();
    }

    [HttpPost("completeSignUp")]
    public async Task<IActionResult> CompleteSignUp([FromBody] CompleteSignUpRequest request)
    {
        return (await userService.CompleteSignUp(request)).ToActionResult();
    }

}
