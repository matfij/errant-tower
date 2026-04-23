using Microsoft.AspNetCore.Mvc;

namespace ErrantTowerServer.Domains.User;

[ApiController]
[Route("user")]
public class UserController(IUserService userService) : ControllerBase
{
    [HttpPost("startSignUp")]
    public async Task<IActionResult> StartSignUp([FromBody] StartSignUpRequest request)
    {
        var result = await userService.StartSignUp(request);
        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }
        return Ok(result);
    }

    [HttpPost("completeSignUp")]
    public async Task<IActionResult> CompleteSignUp([FromBody] CompleteSignUpRequest request)
    {
        var result = await userService.CompleteSignUp(request);
        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }
        return Ok(result);
    }

}