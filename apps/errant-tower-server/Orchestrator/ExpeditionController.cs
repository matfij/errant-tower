using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ErrantTowerServer.Orchestrator;

[Authorize]
[ApiController]
[Route("expeditions")]
public class ExpeditionController(IExpeditionService expeditionService) : ControllerBase
{
    [HttpGet("/get-floors")]
    [EndpointName("getFloors")]
    [ProducesResponseType(typeof(GetFloorsResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetFloors()
    {
        var userId = User.GetUserId();
        var result = await expeditionService.GetFloors(userId);
        return Ok(result);
    }

    [HttpPost("/start-expedition")]
    [EndpointName("startExpedition")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> StartExpedition([FromBody] StartExpeditionRequest request)
    {
        var userId = User.GetUserId();
        await expeditionService.StartExpedition(userId, request);
        return Ok();
    }

    [HttpGet("/get-expedition")]
    [EndpointName("getExpedition")]
    [ProducesResponseType(typeof(GetExpeditionResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetExpedition()
    {
        var userId = User.GetUserId();
        var result = await expeditionService.GetExpedition(userId);
        return Ok(result);
    }

}
