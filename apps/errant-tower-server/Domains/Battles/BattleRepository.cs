using ErrantTowerServer.Common;
using MongoDB.Driver;

namespace ErrantTowerServer.Domains.Battles;

public interface IBattleRepository
{
    Task CreateOne(BattleEntity battle);
    Task<BattleEntity> FindByUserId(string userId);
    Task<BattleEntity> UpdateOne(BattleEntity battle);
}

public class BattleRepository(IMongoDatabase database) : IBattleRepository
{
    private readonly IMongoCollection<BattleEntity> _collection
        = database.GetCollection<BattleEntity>("Battles");

    public async Task CreateOne(BattleEntity battle)
    {
        await _collection.InsertOneAsync(battle);
    }

    public async Task<BattleEntity> FindByUserId(string userId)
    {
        var filter = Builders<BattleEntity>.Filter.Eq(b => b.UserId, userId);
        var battle = await _collection.Find(filter).FirstOrDefaultAsync();
        return battle ?? throw new ApiException("errors.battleNotFound");
    }

    public async Task<BattleEntity> UpdateOne(BattleEntity battle)
    {
        var filter = Builders<BattleEntity>.Filter.Eq(b => b.Id, battle.Id);
        var result = await _collection.ReplaceOneAsync(filter, battle);
        if (result.MatchedCount == 0)
        {
            throw new ApiException("errors.battleNotFound");
        }
        return battle;
    }
}
