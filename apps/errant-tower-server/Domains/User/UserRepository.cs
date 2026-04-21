using MongoDB.Driver;

namespace ErrantTowerServer.Domains.User;

public interface IUserRepository
{
    Task CreateAsync(UserEntity user);
}

public class UserRepository(IMongoDatabase database) : IUserRepository
{
    private readonly IMongoCollection<UserEntity> _collection = database.GetCollection<UserEntity>("users");

    public async Task CreateAsync(UserEntity user)
    {
        await _collection.InsertOneAsync(user);
    }
}
