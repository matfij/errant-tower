using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace ErrantTowerServer.Orchestrator;

[Authorize]
public class ExpeditionHub(IExpeditionService expeditionService) : Hub
{
    public async Task Move(MoveRequest command)
    {
        var userId = Context.User!.GetUserId();
        var response = await expeditionService.Move(userId, command);
        await Clients.Caller.SendAsync("Moved", new MoveResponse() { X = response.X, Y = response.Y });
    }
}
