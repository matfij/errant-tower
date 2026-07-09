using System.Collections.Concurrent;
using ErrantTowerServer.Common;
using ErrantTowerServer.Domains.Progress;

namespace ErrantTowerServer.Orchestrator;

public interface IExpeditionSessionManager
{
    public Task<ExpeditionSession> Create(string userId);
    public Task Persist(string userId);
    public Task Remove(string userId);
}

public sealed class ExpeditionSession
{
    public required string UserId { get; init; }
    public required ProgressEntity Progress { get; init; }
}

public class ExpeditionSessionManager(IProgressRepository progressRepository) : IExpeditionSessionManager
{
    private readonly ConcurrentDictionary<string, ExpeditionSession> _sessions = new();

    public async Task<ExpeditionSession> Create(string userId)
    {
        if (_sessions.TryGetValue(userId, out var existingSession))
        {
            return existingSession;
        }

        var progress = await progressRepository.FindOneByUserId(userId);
        if (progress is null || !progress.IsInExpedition)
        {
            throw new ApiException("errors.expeditionNotStarted");
        }

        var session = new ExpeditionSession
        {
            UserId = userId,
            Progress = progress,
        };

        _sessions[userId] = session;
        return session;
    }

    public async Task Persist(string userId)
    {
        if (!_sessions.TryGetValue(userId, out var session))
        {
            return;
        }

        _ = await progressRepository.UpdateOne(session.Progress);
    }

    public Task Remove(string userId)
    {
        _ = _sessions.TryRemove(userId, out _);
        return Task.CompletedTask;
    }
}
