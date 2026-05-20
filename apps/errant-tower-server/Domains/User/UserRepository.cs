using ErrantTowerServer.Common;
using MongoDB.Driver;

namespace ErrantTowerServer.Domains.User;

public interface IUserRepository
{
    Task CreateOne(UserEntity user);
    Task<UserEntity?> FindOneById(string id);
    Task<UserEntity?> FindOneByEmail(string email);
    Task<UserEntity?> FindOneByUsername(string username);
    Task<UserEntity> UpdateOne(UserEntity user);
    Task DeleteOne (string id);
}

public class UserRepository(IMongoDatabase database) : IUserRepository
{
    private readonly IMongoCollection<UserEntity> _collection = database.GetCollection<UserEntity>("users");

    public async Task CreateOne(UserEntity user)
    {
        await _collection.InsertOneAsync(user);
    }

    public async Task<UserEntity?> FindOneById(string id)
    {
        var filter = Builders<UserEntity>.Filter.Eq(u => u.Id, id);
        return await _collection.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<UserEntity?> FindOneByEmail(string email)
    {
        var filter = Builders<UserEntity>.Filter.Eq(u => u.Email, email);
        return await _collection.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<UserEntity?> FindOneByUsername(string username)
    {
        var filter = Builders<UserEntity>.Filter.Eq(u => u.Username, username);
        return await _collection.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<UserEntity> UpdateOne(UserEntity user)
    {
        var filter = Builders<UserEntity>.Filter.Eq(u => u.Id, user.Id);
        var result = await _collection.ReplaceOneAsync(filter, user);
        if (result.MatchedCount == 0)
        {
            throw new ApiException("errors.userUpdateFailed");
        }
        return user;
    }

    public async Task DeleteOne(string id)
    {
        var filter = Builders<UserEntity>.Filter.Eq(u => u.Id, id);
        var result = await _collection.DeleteOneAsync(filter);
        if (result.DeletedCount == 0)
        {
            throw new ApiException("errors.userDeleteFailed");
        }
    }
}
