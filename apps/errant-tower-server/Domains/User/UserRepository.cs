using MongoDB.Driver;

namespace ErrantTowerServer.Domains.User;

public interface IUserRepository
{
    Task CreateAsync(UserEntity user);
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

    public async Task<UserEntity?> FindByEmailAsync(string email)
    {
        return await _collection.Find(u => u.Email == email).FirstOrDefaultAsync();
    }

    public async Task<UserEntity?> FindByUsernameAsync(string username)
    {
        return await _collection.Find(u => u.Username == username).FirstOrDefaultAsync();
    }

    public async Task<UserEntity> UpdateAsync(UserEntity user)
    {
        var filter = Builders<UserEntity>.Filter.Eq(u => u.Id, user.Id);
        await _collection.ReplaceOneAsync(filter, user);
        return user;
    }

    public async Task DeleteAsync(string id)
    {
        var filter = Builders<UserEntity>.Filter.Eq(u => u.Id, id);
        await _collection.DeleteOneAsync(filter);
    }
}
