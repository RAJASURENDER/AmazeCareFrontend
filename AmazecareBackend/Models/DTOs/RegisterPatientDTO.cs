namespace AmazeCare.Models.DTOs
{
    public class RegisterPatientDTO
    {
        /// <summary>
        /// DTO for Registering Patient with below mentioned Details
        /// </summary>
        public string Username { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public string? PatientName { get; set; }
        public int Age { get; set; }
        public string? Gender { get; set; }

        public DateTime DateOfBirth { get; set; }
        public string? ContactNumber { get; set; }
    }
}
