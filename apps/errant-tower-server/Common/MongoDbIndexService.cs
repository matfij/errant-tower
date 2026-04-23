using ErrantTowerServer.Domains.User;
using MongoDB.Driver;

namespace ErrantTowerServer.Common;

public class MongoDbIndexService(IMongoDatabase database) : IHostedService
{
    public async Task StartAsync(CancellationToken cancellationToken)
    {
        var users = database.GetCollection<UserEntity>("users");

        await users.Indexes.CreateManyAsync([
            new CreateIndexModel<UserEntity>(
                Builders<UserEntity>.IndexKeys.Ascending(u => u.Email),
                new CreateIndexOptions { Unique = true }),
            new CreateIndexModel<UserEntity>(
                Builders<UserEntity>.IndexKeys.Ascending(u => u.Username),
                new CreateIndexOptions { Unique = true })
        ], cancellationToken);
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
