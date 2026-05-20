using ErrantTowerServer.Common;
using ErrantTowerServer.Common.Events;

namespace ErrantTowerServer.Domains.Progress;

public interface IProgressService { }

public class ProgressService(IProgressRepository progressRepository) 
    : IProgressService, IEventHandler<UserCreatedEvent>
{
    public async Task HandleAsync(UserCreatedEvent userCreatedEvent)
    {
        var newProgress = new ProgressEntity
        {
            Id = Utils.GenerateGuid(),
            UserId = userCreatedEvent.UserId,
            Username = userCreatedEvent.Username,
        };
        await progressRepository.CreateAsync(newProgress);
    }
}
