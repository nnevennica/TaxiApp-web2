using AutoMapper;
using Metadata;
using Microsoft.ServiceFabric.Data.Collections;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using Microsoft.ServiceFabric.Services.Remoting.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using System.Fabric;

namespace IdService
{
    internal sealed class IdService(StatefulServiceContext context, IMapper mapper_profiler) : StatefulService(context), IDContract
    {
        IMapper mapper_profiler = mapper_profiler;
        IUDContract udc = ServiceProxy.Create<IUDContract>(new Uri("fabric:/TaxiSF/UDService"));
        IDDContract ddc = ServiceProxy.Create<IDDContract>(new Uri("fabric:/TaxiSF/DDService"));
        IReliableDictionary<int, DriveState> ReliableDictionary;

        public async Task<UserIdDto?> Login(LoginDto loginDto)
        {
            loginDto.Password = Tools.IToolPasswordHash(loginDto.Password);
            User? user = await udc.GetUserByEmail(loginDto.Email);

            if (user != null && user.Password == loginDto.Password)
                return mapper_profiler.Map<UserIdDto>(user);
            return null;
        }

        public async Task<UserIdDto?> Register(RegisterDto registerDto)
        {
            if (registerDto.OAuth == true)
            {
                registerDto.Password = Tools.IToolPasswordHash(registerDto.Password);
                User? user = await udc.GetUserByEmail(registerDto.Email);

                if (user != null)
                    return mapper_profiler.Map<UserIdDto>(user);
                else
                {
                    registerDto.ProfileImage = await Tools.IToolHttpClient(registerDto.ProfileImage);
                    User? usernew = mapper_profiler.Map<User>(registerDto);
                    usernew.AccountStatus = "Allowed";
                    usernew = await udc.AddUser(usernew);
                    return mapper_profiler.Map<UserIdDto>(usernew);
                }
            }
            else
            {
                registerDto.Password = Tools.IToolPasswordHash(registerDto.Password);
                registerDto.ProfileImage = await Tools.IToolImageMedia(registerDto.ProfileImage);
                User? usernew = mapper_profiler.Map<User>(registerDto);
                usernew.AccountStatus = registerDto.Role != "Driver" ? "Allowed" : "Non allowed";
                usernew = await udc.AddUser(usernew);
                return mapper_profiler.Map<UserIdDto>(usernew);
            }
        }

        public async Task<bool> Add(DriveDto driveDto)
        {
            DriveState state = new()
            {
                Drive = driveDto.Id,
                UserId = driveDto.UserId,
                DriverId = driveDto.DriverId ?? -1,
                WaitingTime = driveDto.WaitingTime,
                TravelTime = driveDto.TravelTime ?? -1
            };

            try
            {
                // Accepting drive
                if (driveDto.DriverId.HasValue)
                {
                    using var tx = StateManager.CreateTransaction();
                    var result = await ReliableDictionary.TryGetValueAsync(tx, driveDto.UserId);

                    if (result.HasValue && driveDto.TravelTime.HasValue)
                    {
                        result.Value.DriverId = driveDto.DriverId.Value;
                        result.Value.TravelTime = driveDto.TravelTime.Value;
                        result.Value.Started = true;
                        await tx.CommitAsync();
                        return true;
                    }
                    else
                        return false;
                }
                // Creating new drive
                else
                {
                    await ReliableDictionary.ClearAsync();
                    using var tx = StateManager.CreateTransaction();
                    bool success = await ReliableDictionary.TryAddAsync(tx, state.UserId, state);
                    await tx.CommitAsync();
                    return success;
                }
            }
            catch (Exception e)
            {
                ServiceEventSource.Current.Message(e.Message);
                return false;
            }
        }

        public async Task<DriveState?> Get(int user, bool driver)
        {
            if (driver)
                return await IsDriver(user);
            else
                return await IsUser(user);
        }

        protected override IEnumerable<ServiceReplicaListener> CreateServiceReplicaListeners()
        {
            return this.CreateServiceRemotingReplicaListeners();
        }

        protected override async Task RunAsync(CancellationToken cancellationToken)
        {
            ReliableDictionary = await StateManager.GetOrAddAsync<IReliableDictionary<int, DriveState>>("ReliableDictionary");
            await ReliableDictionary.ClearAsync();

            while (true)
            {
                cancellationToken.ThrowIfCancellationRequested();

                using var tx = StateManager.CreateTransaction();
                var @enum = await ReliableDictionary.CreateEnumerableAsync(tx);
                var iterate = @enum.GetAsyncEnumerator();

                while (await iterate.MoveNextAsync(new CancellationToken()))
                {
                    var stateObject = iterate.Current;
                    var state = stateObject.Value;

                    if (state.Started)
                    {
                        if (state.WaitingTime > 0)
                        {
                            state.WaitingTime--;
                            await ReliableDictionary.SetAsync(tx, state.UserId, stateObject.Value);
                        }

                        if (state.WaitingTime == 0 && state.TravelTime > 0)
                        {
                            state.TravelTime--;
                            await ReliableDictionary.SetAsync(tx, state.UserId, stateObject.Value);
                        }

                        if (state.WaitingTime == 0 && state.TravelTime == 0)
                        {
                            await ReliableDictionary.TryRemoveAsync(tx, state.UserId);
                            await ddc.Finish(state.Drive);
                            await tx.CommitAsync();
                        }
                    }
                }

                await Task.Delay(TimeSpan.FromSeconds(1), cancellationToken);
            }
        }

        public async Task<DriveState?> IsUser(int user)
        {
            try
            {
                using var tx = StateManager.CreateTransaction();
                var result = await ReliableDictionary.TryGetValueAsync(tx, user);
                if (result.HasValue)
                    return result.Value;
                return null;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<DriveState?> IsDriver(int driver)
        {
            try
            {
                using var tx = StateManager.CreateTransaction();
                var @enum = await ReliableDictionary.CreateEnumerableAsync(tx);
                var iterate = @enum.GetAsyncEnumerator();

                while (await iterate.MoveNextAsync(new CancellationToken()))
                {
                    var stateObject = iterate.Current;
                    var drive = stateObject.Value;

                    if (drive.DriverId == driver)
                        return drive;
                }

                return null;
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}
