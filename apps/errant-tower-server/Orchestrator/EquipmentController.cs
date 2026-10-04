using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ErrantTowerServer.Orchestrator;

[Authorize]
[ApiController]
[Route("equipment")]
public class EquipmentController(IEquipmentOrchestrator equipmentOrchestrator) : ControllerBase
{
    [HttpGet]
    [EndpointName("getEquipment")]
    [ProducesResponseType(typeof(GetEquipmentResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetEquipment()
    {
        var userId = User.GetUserId();
        var equipment = await equipmentOrchestrator.GetEquipment(userId);
        return Ok(equipment);
    }

    [HttpPost]
    [EndpointName("equipItem")]
    [ProducesResponseType(typeof(EquipItemResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> EquipItem([FromBody] EquipItemRequest request)
    {
        var userId = User.GetUserId();
        var equipment = await equipmentOrchestrator.EquipItem(userId, request);
        return Ok(equipment);
    }

    [HttpPost]
    [EndpointName("unequipItem")]
    [ProducesResponseType(typeof(UnequipItemResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> UnequipItem([FromBody] UnequipItemRequest request)
    {
        var userId = User.GetUserId();
        var equipment = await equipmentOrchestrator.UnequipItem(userId, request);
        return Ok(equipment);
    }

}
