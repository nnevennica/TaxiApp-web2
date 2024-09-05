using AutoMapper;

namespace Metadata
{
    public class EFDatabaseMappers : Profile
    {
        public EFDatabaseMappers()
        {
            CreateMap<RegisterDto, User>();
            CreateMap<User, UserDto>();
            CreateMap<User, UserIdDto>();
            CreateMap<Drive, DriveDto>();
            CreateMap<DriveDto, Drive>();
            CreateMap<AddDriveDto, Drive>();
        }
    }
}
