namespace Metadata
{
    [Serializable]
    public class LoginDto
    {
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
    }

    [Serializable]
    public class RegisterDto
    {
        public string Username { get; set; } = "";
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
        public string FullName { get; set; } = "";
        public DateTime DateOfBirth { get; set; }
        public string Address { get; set; } = "";
        public string Role { get; set; } = "";
        public bool OAuth { get; set; }
        public string ProfileImage { get; set; } = "";
    }

    [Serializable]
    public class UserIdDto
    {
        public int Id { get; set; }
        public string Role { get; set; } = "";
    }

    [Serializable]
    public class UserDto : RegisterDto
    {
        public int Id { get; set; }
        public bool Blocked { get; set; }
        public string AccountStatus { get; set; } = "";
        public float UserRatings { get; set; }
    }

    [Serializable]
    public class AddDriveDto
    {
        public int UserId { get; set; }
        public string StartAddress { get; set; } = "";
        public string EndAddress { get; set; } = "";
        public int Wait { get; set; }
        public float Price { get; set; }
    }

    [Serializable]
    public class DriveDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int? DriverId { get; set; }
        public string StartAddress { get; set; } = "";
        public string EndAddress { get; set; } = "";
        public decimal Price { get; set; }
        public int WaitingTime { get; set; }
        public int? TravelTime { get; set; }
        public string DriveStatus { get; set; } = "";
    }

    [Serializable]
    public class DriveState
    {
        public int Drive { get; set; }
        public int UserId { get; set; }
        public int DriverId { get; set; } = -1;
        public int WaitingTime { get; set; }
        public int TravelTime { get; set; } = -1;
        public bool Started { get; set; } = false;
    }
}
