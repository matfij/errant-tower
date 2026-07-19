using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ErrantTowerServer.Orchestrator;

[Authorize]
[ApiController]
[Route("statistics")]
public class StatisticsController(IStatisticsOrchestrator statisticsOrchestrator) : ControllerBase
{
    [HttpGet("get-skill-tree")]
    [EndpointName("getSkillTree")]
    [ProducesResponseType(typeof(GetSkillTreeResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSkillTree()
    {
        var userId = User.GetUserId();
        var result = await statisticsOrchestrator.GetSkillTree(userId);
        return Ok(result);
    }

    [HttpPost("learn-skill")]
    [EndpointName("learnSkill")]
    [ProducesResponseType(typeof(LearnSkillResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> LearnSkill([FromBody] LearnSkillRequest request)
    {
        var userId = User.GetUserId();
        var result = await statisticsOrchestrator.LearnSkill(userId, request);
        return Ok(result);
    }

    [HttpPost("reset-skills")]
    [EndpointName("resetSkills")]
    [ProducesResponseType(typeof(ResetSkillsResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> ResetSkills()
    {
        var userId = User.GetUserId();
        var result = await statisticsOrchestrator.ResetSkills(userId);
        return Ok(result);
    }
}
