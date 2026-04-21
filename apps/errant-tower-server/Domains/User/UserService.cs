namespace ErrantTowerServer.Domains.User;

public interface IUserService
{
    Task StartSignUp(CreateUserRequest request);
}

public class UserService(IUserRepository userRepository) : IUserService
{
    private readonly IUserRepository _userRepository = userRepository;

    public async Task StartSignUp(CreateUserRequest request)
    {
        // TODO #7 - validation, real implementation of password hashing, etc.
        var passwordHash = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(request.Password));
        var user = new UserEntity
        {
            Id = Guid.NewGuid().ToString(),
            Email = request.Email,
            PasswordHash = passwordHash,
            Username = request.Username
        };
        await _userRepository.CreateAsync(user);
    }
}   
