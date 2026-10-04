using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ErrantTowerServer.Orchestrator;

[Authorize]
[ApiController]
[Route("battles")]
public class BattleController(IBattleOrchestrator battleOrchestrator) : ControllerBase
{
    [HttpGet("get-battle")]
    [EndpointName("getBattle")]
    [ProducesResponseType(typeof(GetBattleResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetBattle()
    {
        var userId = User.GetUserId();
        var battle = await battleOrchestrator.GetBattle(userId);
        return Ok(battle);
    }
}
