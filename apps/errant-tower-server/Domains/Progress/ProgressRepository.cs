using ErrantTowerServer.Common;
using MongoDB.Driver;

namespace ErrantTowerServer.Domains.Progress;

public interface IProgressRepository
{
    Task CreateAsync(ProgressEntity progress);
    Task<ProgressEntity> FindByUserIdAsync(string userId);
    Task<ProgressEntity> UpdateAsync(ProgressEntity progress);
}

public class ProgressRepository(IMongoDatabase database) : IProgressRepository
{
    private readonly IMongoCollection<ProgressEntity> _collection 
        = database.GetCollection<ProgressEntity>("progress");

    public async Task CreateAsync(ProgressEntity progress)
    {
        await _collection.InsertOneAsync(progress);
    }

    public async Task<ProgressEntity> FindByUserIdAsync(string userId)
    {
        var filter = Builders<ProgressEntity>.Filter.Eq(p => p.UserId, userId);
        return await _collection.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<ProgressEntity> UpdateAsync(ProgressEntity progress)
    {
        var filter = Builders<ProgressEntity>.Filter.Eq(p => p.Id, progress.Id);
        var result = await _collection.ReplaceOneAsync(filter, progress);
        if (result.MatchedCount == 0)
        {
            throw new ApiException("errors.progressNotFound");
        }
        return progress;
    }
}
