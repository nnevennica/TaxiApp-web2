using AutoMapper;
using Metadata;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Remoting.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using System.Fabric;

namespace UDService
{
    internal sealed class UDService(StatelessServiceContext context, IMapper mp) : StatelessService(context), IUDContract
    {
        IMapper mapper_profiler = mp;

        public async Task<User?> AddUser(User user)
        {
            return await new EFDatabaseSqliteRepository().CreateAsync(user);
        }

        public async Task AddUserRating(int driver, int rating)
        {
            User? user = await new EFDatabaseSqliteRepository().GetOneByConditionAsync(x => x.Id == driver);

            if (user != null)
            {
                if (user.UserRatings <= 0)
                    user.UserRatings = rating;
                else
                    user.UserRatings = (user.UserRatings + rating) / 2.0f;

                await new EFDatabaseSqliteRepository().UpdateAsync(user);
            }
        }

        public async Task<bool> BlockDriver(int driver)
        {
            User? user = await new EFDatabaseSqliteRepository().GetOneByConditionAsync(x => x.Id == driver);

            if (user != null)
            {
                user.Blocked = !user.Blocked;
                return await new EFDatabaseSqliteRepository().UpdateAsync(user) != null;
            }

            return false;
        }

        public async Task<List<UserDto>> GetAllDrivers()
        {
            return mapper_profiler.Map<List<UserDto>>((await new EFDatabaseSqliteRepository().GetByConditionAsync(x => x.Role == "Driver")).ToList());
        }

        public async Task<UserDto?> GetUser(int id)
        {
            UserDto? user = mapper_profiler.Map<UserDto>(await new EFDatabaseSqliteRepository().GetByIdAsync(id));
            user.ProfileImage = await Tools.IToolImageWww(user.ProfileImage);
            return user;
        }

        public async Task<User?> GetUserByEmail(string email)
        {
            return await new EFDatabaseSqliteRepository().GetOneByConditionAsync(x => x.Email == email);
        }

        public async Task<UserDto?> UpdateUser(UserDto user)
        {
            User? user_find = await new EFDatabaseSqliteRepository().GetOneByConditionAsync(x => x.Id == user.Id);

            if (user_find != null)
            {
                if (user.ProfileImage != "keep")
                    user_find.ProfileImage = await Tools.IToolImageMedia(user.ProfileImage);
                else
                    user.ProfileImage = user_find.ProfileImage;

                if (user.Password != "keep")
                    user_find.Password = Tools.IToolPasswordHash(user.Password);
                else
                    user_find.Password = user_find.Password;

                try
                {
                    user_find.Email = user.Email;
                    user_find.FullName = user.FullName;
                    user_find.Address = user.Address;
                    user_find.DateOfBirth = user.DateOfBirth;
                    user_find.Username = user.Username;
                    user_find = await new EFDatabaseSqliteRepository().UpdateAsync(user_find);

                }
                catch (Exception)
                {
                    return null;
                }
                return mapper_profiler.Map<UserDto?>(user_find);
            }

            return null;
        }

        public async Task<bool> VerifyDriver(int driver, string ver)
        {
            User? user = await new EFDatabaseSqliteRepository().GetOneByConditionAsync(x => x.Id == driver);

            if (user != null)
            {
                user.AccountStatus = ver;
                return await new EFDatabaseSqliteRepository().UpdateAsync(user) != null
                    && await Tools.SendEmailAsync(user.Email, ver);
            }

            return false;
        }

        protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
        {
            return this.CreateServiceRemotingInstanceListeners();
        }
    }
}
