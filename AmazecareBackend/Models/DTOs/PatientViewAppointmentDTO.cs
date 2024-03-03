namespace AmazeCare.Models.DTOs
{
    public class PatientViewAppointmentDTO
    {
        /// <summary>
        /// DTO for View Appointment By patient  with Required Details mentioned below
        /// </summary>
        public int AppointmentId { get; set; }
        public string? PatientName { get; set; }
        public string? ContactNumber { get; set; }
        public string? Symptoms { get; set; }

        public DateTime AppointmentDate { get; set; }

        public string Status { get; set; }

        public string DoctorName { get; set; }
        public int DoctorId { get; internal set; }
    }
}
