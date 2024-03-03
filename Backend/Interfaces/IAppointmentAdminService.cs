
using AmazeCare.Models;
using AmazeCare.Models.DTOs;

namespace AmazeCare.Interfaces
{
    public interface IAppointmentAdminService : IAppointmentUserService
    {

        public Task<List<Appointments>> GetAppointmentList();
        public Task<Appointments> AddAppointment(Appointments appointment);
        public Task<Appointments> UpdateAppointmentPatient(int appointmentId, int patientId);
        public Task<Appointments> UpdateAppointmentDoctor(int appointmentId, int doctorId);

        public Task<Appointments> DeleteAppointment(int id);

        // viewing appointment by doctor
        public Task<List<DoctorViewAppointmentDTO>> GetAppointmentByDoctor(int doctorId);

        public Task<List<PatientViewAppointmentDTO>> GetAppointmentByPatient(int patientId);

        public Task<Appointments> UpdateAppointmentDate(int appointmentId, DateTime appointmentDate);

        public Task<Appointments> UpdateAppointmentStatus(int appointmentId, string Status);

        public Task<List<Appointments>> GetUpcomingAppointments();

        public Task<Appointments> CancelAppointment(int appointmentId);
        public Task<Appointments> RescheduleAppointment(int appointmentId);
        public Task<Appointments> CompleteAppointment(int appointmentId);

    }
}
