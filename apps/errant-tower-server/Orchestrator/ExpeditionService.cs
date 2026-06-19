using ErrantTowerServer.Domains.Progress;

namespace ErrantTowerServer.Orchestrator;

public interface IExpeditionService
{
    public Task<GetFloorsResponse> GetFloors();
    public Task StartExpedition();
}

public class ExpeditionService(IProgressService progressService) : IExpeditionService
{
    public Task<GetFloorsResponse> GetFloors()
    {
        throw new NotImplementedException();
    }

    public Task StartExpedition()
    {
        throw new NotImplementedException();
    }
}
