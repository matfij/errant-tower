using System.Security.Cryptography;

namespace ErrantTowerServer.Common;

public class Utils
{
    public static string GenerateGuid()
    {
        return Guid.NewGuid().ToString();
    }

    public static string GenerateSecureNumberString(int length)
    {
        var result = new char[length];
        for (int i = 0; i < length; i++)
        {
            result[i] = (char)('0' + RandomNumberGenerator.GetInt32(0, 10));
        }
        return new string(result);
    }

    public static long GetCurrentTimestamp()
    {
        return DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
    }

    public static long GetFutureTimestamp(int minutes)
    {
        return DateTimeOffset.UtcNow.AddMinutes(minutes).ToUnixTimeMilliseconds();
    }

    public static string HashString(string value)
    {
        var hash = SHA256.HashData(System.Text.Encoding.UTF8.GetBytes(value));
        return Convert.ToBase64String(hash);
    }

    public static bool VerifyHash(string value, string hash)
    {
        var computed = SHA256.HashData(System.Text.Encoding.UTF8.GetBytes(value));
        var stored = Convert.FromBase64String(hash);
        return CryptographicOperations.FixedTimeEquals(computed, stored);
    }

    public static bool CheckChance(double chance)
    {
        return chance > Random.Shared.NextDouble();
    }

    public static int RandRange(int min, int max)
    {
        return Random.Shared.Next(min, max + 1);
    }

    public static double RandRange(double min, double max)
    {
        return (Random.Shared.NextDouble() * (max - min)) + min;
    }

    public static TGuid GetWeightedRandomItem<TItem, TGuid>(IReadOnlyList<TItem> items)
        where TItem : IWeightedItem<TGuid>
    {
        var totalChances = items.Sum(x => x.Chance);
        var targetChance = RandRange(0, totalChances);

        foreach (var item in items)
        {
            targetChance -= item.Chance;
            if (targetChance <= 0)
            {
                return item.Guid;
            }
        }

        return items[^1].Guid;
    }
}

public interface IWeightedItem<out TGuid>
{
    public TGuid Guid { get; }
    public double Chance { get; }
}
