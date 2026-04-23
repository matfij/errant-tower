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
}
