namespace AmazeCare.Models.DTOs
{
    public class DoctorQualificationDTO
    {
        /// <summary>
        /// DTO for DoctorId AND Qualification
        /// </summary>
        public int Id { get; set; }
        public string Qualification { get; set; } = string.Empty;
    }
}
