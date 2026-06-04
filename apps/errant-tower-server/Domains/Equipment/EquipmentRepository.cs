using ErrantTowerServer.Common;
using MongoDB.Driver;

namespace ErrantTowerServer.Domains.Equipment;

public interface IEquipmentRepository
{
    Task CreateOne(EquipmentEntity entity);
    Task<EquipmentEntity> FindByUserId(string userId);
    Task<EquipmentEntity> UpdateOne(EquipmentEntity equipment);
}

public class EquipmentRepository(IMongoDatabase database) : IEquipmentRepository
{
    private readonly IMongoCollection<EquipmentEntity> _collection
        = database.GetCollection<EquipmentEntity>("Equipments");

    public async Task CreateOne(EquipmentEntity equipment)
    {
        await _collection.InsertOneAsync(equipment);
    }

    public async Task<EquipmentEntity> FindByUserId(string userId)
    {
        var filter = Builders<EquipmentEntity>.Filter.Eq(e => e.UserId, userId);
        var equipment = await _collection.Find(filter).FirstOrDefaultAsync();
        return equipment ?? throw new ApiException("errors.equipmentNotFound");
    }

    public async Task<EquipmentEntity> UpdateOne(EquipmentEntity equipment)
    {
        var filter = Builders<EquipmentEntity>.Filter.Eq(e => e.Id, equipment.Id);
        var result = await _collection.ReplaceOneAsync(filter, equipment);
        if (result.MatchedCount == 0)
        {
            throw new ApiException("errors.equipmentNotFound");
        }
        return equipment;
    }
}
