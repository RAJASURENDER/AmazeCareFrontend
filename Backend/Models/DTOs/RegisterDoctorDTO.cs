namespace AmazeCare.Models.DTOs
{
    public class RegisterDoctorDTO
    {
        /// <summary>
        /// DTO for Registering Doctor by providing below mentioned Details
        /// </summary>
        public string Username { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public string DoctorName { get; set; }

        public string Speciality { get; set; }

        public float Experience { get; set; }

        public string Qualification { get; set; }

        public string Designation { get; set; }
    }
}
