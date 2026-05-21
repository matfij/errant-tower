using ErrantTowerServer.Common;

namespace ErrantTowerServer.Domains.Progress;

public interface IProgressService
{ 
    public Task CreateInitial(string userId);
}

public class ProgressService(IProgressRepository progressRepository) : IProgressService
{
    public async Task CreateInitial(string userId)
    {
        var newProgress = new ProgressEntity
        {
            Id = Utils.GenerateGuid(),
            UserId = userId,
        };
        await progressRepository.CreateOne(newProgress);
    }
}
