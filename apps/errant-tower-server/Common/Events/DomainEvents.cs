namespace ErrantTowerServer.Common.Events;

public interface IDomainEvent
{
    DateTime OccurredAt { get; }
}

public record UserCreatedEvent : IDomainEvent
{
    public required string UserId { get; init; }
    public required string Username { get; init; }
    public DateTime OccurredAt { get; init; } = DateTime.UtcNow;
}
