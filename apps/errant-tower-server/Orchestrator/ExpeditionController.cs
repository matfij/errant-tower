using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ErrantTowerServer.Orchestrator;

[ApiController]
[Route("expedition")]
public class ExpeditionController(IExpeditionService expeditionService) : ControllerBase
{
    [HttpGet]
    [Authorize]
    [EndpointName("getFloors")]
    [ProducesResponseType(typeof(GetFloorsResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetFloors()
    {
        var result = await expeditionService.GetFloors();
        return Ok(result);
    }
}
