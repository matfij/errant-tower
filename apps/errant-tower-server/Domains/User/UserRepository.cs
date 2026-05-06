using ErrantTowerServer.Common;
using MongoDB.Driver;

namespace ErrantTowerServer.Domains.User;

public interface IUserRepository
{
    Task CreateAsync(UserEntity user);
    Task<UserEntity?> FindByIdAsync(string id);
    Task<UserEntity?> FindByEmailAsync(string email);
    Task<UserEntity?> FindByUsernameAsync(string username);
    Task<UserEntity> UpdateAsync(UserEntity user);
    Task DeleteAsync (string id);
}

public class UserRepository(IMongoDatabase database) : IUserRepository
{
    private readonly IMongoCollection<UserEntity> _collection = database.GetCollection<UserEntity>("users");

    public async Task CreateAsync(UserEntity user)
    {
        await _collection.InsertOneAsync(user);
    }

    public async Task<UserEntity?> FindByIdAsync(string id)
    {
        var filter = Builders<UserEntity>.Filter.Eq(u => u.Id, id);
        return await _collection.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<UserEntity?> FindByEmailAsync(string email)
    {
        var filter = Builders<UserEntity>.Filter.Eq(u => u.Email, email);
        return await _collection.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<UserEntity?> FindByUsernameAsync(string username)
    {
        var filter = Builders<UserEntity>.Filter.Eq(u => u.Username, username);
        return await _collection.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<UserEntity> UpdateAsync(UserEntity user)
    {
        var filter = Builders<UserEntity>.Filter.Eq(u => u.Id, user.Id);
        var result = await _collection.ReplaceOneAsync(filter, user);
        if (result.MatchedCount == 0)
        {
            throw new ApiException("errors.userUpdateFailed");
        }
        return user;
    }

    public async Task DeleteAsync(string id)
    {
        var filter = Builders<UserEntity>.Filter.Eq(u => u.Id, id);
        var result = await _collection.DeleteOneAsync(filter);
        if (result.DeletedCount == 0)
        {
            throw new ApiException("errors.userDeleteFailed");
        }
    }
}
