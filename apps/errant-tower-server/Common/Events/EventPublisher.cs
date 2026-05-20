using Microsoft.AspNetCore.Razor.TagHelpers;

namespace ErrantTowerServer.Common.Events;

public interface IEventPublisher
{
    Task PublishAsync<TEvent>(TEvent domainEvent) where TEvent : IDomainEvent;
}

public interface IEventHandler<TEvent> where TEvent : IDomainEvent
{
    Task HandleAsync(TEvent domainEvent);
}

public class EventPublisher(IServiceProvider serviceProvider) : IEventPublisher
{
    public Task PublishAsync<TEvent>(TEvent domainEvent) where TEvent : IDomainEvent
    {
        var handlers = serviceProvider.GetServices<IEventHandler<TEvent>>();
        var tasks = handlers.Select(handler => handler.HandleAsync(domainEvent));
        return Task.WhenAll(tasks);
    }
}
