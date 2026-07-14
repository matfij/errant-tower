using ErrantTowerServer.Common;
using ErrantTowerServer.Domains.Expeditions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace ErrantTowerServer.Orchestrator;

[Authorize]
public class ExpeditionHub(
    ILogger<ExpeditionHub> logger,
    IExpeditionService expeditionService,
    IExpeditionSessionManager expeditionSessionManager) : Hub
{
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.User?.GetUserId()
            ?? throw new ApiException("errors.unauthorized");
        await expeditionSessionManager.Persist(userId);
        expeditionSessionManager.Remove(userId);
        await base.OnDisconnectedAsync(exception);
    }

    public async Task Move(MoveRequest command)
    {
        var userId = Context.User?.GetUserId()
            ?? throw new ApiException("errors.unauthorized");
        try
        {
            var response = await expeditionService.Move(userId, command.Direction);
            await Clients.Caller.SendAsync(
                "Moved",
                new MoveResponse()
                {
                    X = response.X,
                    Y = response.Y,
                    BattleId = response.BattleId,
                    Silver = response.Silver,
                    Items = response.Loots,
                    Summary = response.Summary,
                });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Move failed for user {UserId}", userId);
            var key = ex is ApiException apiEx ? apiEx.Message : "errors.expeditionMoveFailed";
            await Clients.Caller.SendAsync("Error", new { key });
        }
    }
}
