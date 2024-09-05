using Microsoft.EntityFrameworkCore;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Metadata
{
    [Serializable]
    [Index(nameof(Username), IsUnique = true)]
    [Index(nameof(Email), IsUnique = true)]
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        public string Username { get; set; } = "";

        [Required]
        [StringLength(255)]
        public string Email { get; set; } = "";

        [Required]
        [StringLength(255)]
        public string Password { get; set; } = "";

        [Required]
        [StringLength(255)]
        public string FullName { get; set; } = "";

        [Required]
        public DateTime DateOfBirth { get; set; }

        [Required]
        [StringLength(255)]
        public string Address { get; set; } = "";

        [Required]
        public string Role { get; set; } = "";

        [StringLength(255)]
        public string ProfileImage { get; set; } = "";

        [Required]
        [DefaultValue("Pending")]
        public string AccountStatus { get; set; } = "";

        [Required]
        [DefaultValue(false)]
        public bool Blocked { get; set; }

        [Required]
        [DefaultValue(false)]
        public bool OAuth { get; set; }

        [DefaultValue(0)]
        public float UserRatings { get; set; }

        public User() => Id = 0;
    }

    [Serializable]
    public class Drive
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        public int? DriverId { get; set; }

        [Required]
        [StringLength(255)]
        public string StartAddress { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string EndAddress { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        [DefaultValue(0.0)]
        public decimal Price { get; set; }

        [Required]
        [DefaultValue(0)]
        public int WaitingTime { get; set; }

        public int? TravelTime { get; set; }

        [Required]
        [DefaultValue("UserWaiting")]
        public string DriveStatus { get; set; } = "";

        public Drive() => Id = 0;
    }
}
