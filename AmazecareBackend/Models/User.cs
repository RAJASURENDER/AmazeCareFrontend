using System.ComponentModel.DataAnnotations;
using System.Numerics;

namespace AmazeCare.Models
{
    public class User
    {
        [Key]

        [Required]
        public string Username { get; set; }

        [Required]
        public byte[] Password { get; set; }
        public string? Role { get; set; }
        public byte[]? Key { get; set; }

        public Patients? Patient { get; set; }

        public Doctors? Doctors { get; set; }
       
    }
}
