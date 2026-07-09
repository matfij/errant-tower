using ErrantTowerServer.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace ErrantTowerServer.Orchestrator;

[Authorize]
public class ExpeditionHub(
    IExpeditionService expeditionService,
    IExpeditionSessionManager expeditionSessionManager) : Hub
{
    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.GetUserId()
            ?? throw new ApiException("errors.unauthorized");
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.User?.GetUserId()
            ?? throw new ApiException("errors.unauthorized");
        await expeditionSessionManager.Persist(userId);
        await expeditionSessionManager.Remove(userId);
        await base.OnDisconnectedAsync(exception);
    }

    public async Task Move(MoveRequest command)
    {
        var userId = Context.User?.GetUserId()
            ?? throw new ApiException("errors.unauthorized");
        var response = await expeditionService.Move(userId, command);
        await Clients.Caller.SendAsync("Moved", new MoveResponse() { X = response.X, Y = response.Y });
    }
}
