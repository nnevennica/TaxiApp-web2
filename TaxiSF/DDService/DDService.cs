using AutoMapper;
using Metadata;
using Microsoft.ServiceFabric.Services.Client;
using Microsoft.ServiceFabric.Services.Communication.Client;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using Microsoft.ServiceFabric.Services.Remoting.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using System.Fabric;

namespace DDService
{
    internal sealed class DDService(StatelessServiceContext context, IMapper map) : StatelessService(context), IDDContract
    {
        IMapper mapping_profiler = map;
        IDContract idc = ServiceProxy.Create<IDContract>(new Uri("fabric:/TaxiSF/IdService"), new ServicePartitionKey(0), TargetReplicaSelector.PrimaryReplica);

        public async Task<bool> AcceptDrive(DriveDto driveDto)
        {
            Drive? drive = await new EFDatabaseSqliteRepository().GetByIdAsync(driveDto.Id);

            if (drive == null)
                return false;

            drive.DriverId = driveDto.DriverId;
            drive.TravelTime = new Random().Next(10, 20);
            drive.DriveStatus = "Started";

            drive = await new EFDatabaseSqliteRepository().UpdateAsync(drive);

            if (drive == null)
                return false;

            return await idc.Add(mapping_profiler.Map<DriveDto>(drive));
        }

        public async Task<bool> AddDrive(AddDriveDto addDriveDto)
        {
            Drive drive = mapping_profiler.Map<Drive>(addDriveDto);
            drive.DriveStatus = "UserWaiting";
            drive.WaitingTime = addDriveDto.Wait;
            Drive? d = await new EFDatabaseSqliteRepository().CreateAsync(drive);

            if (d != null)
            {
                return await idc.Add(mapping_profiler.Map<DriveDto>(d));
            }

            return false;
        }

        public async Task Finish(int drive)
        {
            Drive? d = await new EFDatabaseSqliteRepository().GetByIdAsync(drive);
            if (d != null)
            {
                d.DriveStatus = "End";
                await new EFDatabaseSqliteRepository().UpdateAsync(d);
            }
        }

        public async Task<List<DriveDto>> GetDrives(string role, int user)
        {
            switch (role)
            {
                case "Admin": return mapping_profiler.Map<List<DriveDto>>(await new EFDatabaseSqliteRepository().GetAllAsync());
                case "User": return mapping_profiler.Map<List<DriveDto>>(await new EFDatabaseSqliteRepository().GetByConditionAsync(x => x.UserId == user));
                case "Driver": return mapping_profiler.Map<List<DriveDto>>(await new EFDatabaseSqliteRepository().GetByConditionAsync(x => x.DriverId == user));
                default: return [];
            }
        }

        public async Task<List<DriveDto>> GetNewDrives()
        {
            var drives = await new EFDatabaseSqliteRepository().GetByConditionAsync(x => x.DriveStatus == "UserWaiting");
            return mapping_profiler.Map<List<DriveDto>>(drives);
        }

        protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
        {
            return this.CreateServiceRemotingInstanceListeners();
        }
    }
}
