using Microsoft.ServiceFabric.Services.Remoting;

namespace Metadata
{
    // Id Service
    public interface IDContract : IService
    {
        public Task<UserIdDto?> Login(LoginDto loginDto);
        public Task<UserIdDto?> Register(RegisterDto registerDto);
        public Task<bool> Add(DriveDto driveDto);
        public Task<DriveState?> Get(int user, bool driver);
    }

    // User Data Service
    public interface IUDContract : IService
    {
        public Task<User?> GetUserByEmail(string email);
        public Task<User?> AddUser(User user);
        public Task<UserDto?> GetUser(int id);
        public Task<UserDto?> UpdateUser(UserDto user);
        public Task<bool> VerifyDriver(int driver, string ver);
        public Task<bool> BlockDriver(int driver);
        public Task<List<UserDto>> GetAllDrivers();
        public Task AddUserRating(int driver, int rating);
    }

    // Drive Data Service 
    public interface IDDContract : IService
    {
        public Task<bool> AddDrive(AddDriveDto addDriveDto);
        public Task<bool> AcceptDrive(DriveDto driveDto);
        public Task<List<DriveDto>> GetDrives(string role, int user);
        public Task<List<DriveDto>> GetNewDrives();
        public Task Finish(int drive);
    }
}
