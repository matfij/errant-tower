using Microsoft.AspNetCore.Mvc;

namespace ErrantTowerServer.Domains.User;

[ApiController]
[Route("user")]
public class UserController(IUserService userService) : ControllerBase
{
    private readonly IUserService _userService = userService;

    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] CreateUserRequest request)
    {
        await _userService.StartSignUp(request);
        return Ok();
    }
}
