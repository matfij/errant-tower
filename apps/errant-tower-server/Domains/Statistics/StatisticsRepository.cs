using ErrantTowerServer.Common;
using MongoDB.Driver;

namespace ErrantTowerServer.Domains.Statistics;

public interface IStatisticsRepository
{
    Task CreateOne(StatisticsEntity statistics);
    Task<StatisticsEntity> FindOneByUserId(string userId);
    Task<StatisticsEntity> UpdateOne(StatisticsEntity statistics);
}

public class StatisticsRepository(IMongoDatabase database) : IStatisticsRepository
{
    private readonly IMongoCollection<StatisticsEntity> _collection
        = database.GetCollection<StatisticsEntity>("Statistics");

    public async Task CreateOne(StatisticsEntity statistics)
    {
        await _collection.InsertOneAsync(statistics);
    }

    public async Task<StatisticsEntity> FindOneByUserId(string userId)
    {
        var filter = Builders<StatisticsEntity>.Filter.Eq(s => s.UserId, userId);
        return await _collection.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<StatisticsEntity> UpdateOne(StatisticsEntity statistics)
    {
        var filter = Builders<StatisticsEntity>.Filter.Eq(s => s.Id, statistics.Id);
        var result = await _collection.ReplaceOneAsync(filter, statistics);
        if (result.MatchedCount == 0)
        {
            throw new ApiException("errors.statisticsNotFound");
        }
        return statistics;
    }
}
