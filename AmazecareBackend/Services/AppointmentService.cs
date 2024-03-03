using AmazeCare.Exceptions;
using AmazeCare.Interfaces;
using AmazeCare.Models;
using AmazeCare.Models.DTOs;

namespace AmazeCare.Services
{
    public class AppointmentService : IAppointmentAdminService, IAppointmentUserService
    {

        private readonly IPatientAdminService _patientService;
        private readonly IDoctorAdminService _doctorService;


        IRepository<int, Appointments> _repo;


        public AppointmentService(IRepository<int, Appointments> repo, IPatientAdminService patientService, IDoctorAdminService doctorService)
        {
            _repo = repo;
            _patientService = patientService;
            _doctorService = doctorService;
        }

        /// <summary>
        /// Method to Add Appointment
        /// </summary>
        /// <param name="appointments">Object of Appointments</param>
        /// <returns>Appointments Object</returns>
        //public async Task<Appointments> AddAppointment(Appointments appointments)
        //{
        //    appointments = await _repo.Add(appointments);
        //    return appointments;
        //}

        public async Task<Appointments> AddAppointment(Appointments appointments)
        {
            // Check if the appointment date is in the past
            if (appointments.AppointmentDate <= DateTime.Now)
            {
                throw new InvalidAppointmentDateTimeException();
            }
            // Fetch existing appointments
            var existingAppointments = await _repo.GetAsync();
            // Check for any existing appointments for the same doctor within a 15-minute window
            var conflictingAppointments = existingAppointments
                .Where(a => a.DoctorId == appointments.DoctorId &&
                            Math.Abs((a.AppointmentDate - appointments.AppointmentDate).TotalMinutes) < 15)
                .ToList();
            //If there are any conflicting appointments, throw an exception
            if (conflictingAppointments.Any())
            {
                throw new ConflictingAppointmentsException();
            }
            // If there are no conflicts, add the new appointment
            appointments = await _repo.Add(appointments);
            return appointments;
        }

        /// <summary>
        /// Method to Delete Appointment
        /// </summary>
        /// <param name="id">AppointmentId in int</param>
        /// <returns>appointments object</returns>
        public async Task<Appointments> DeleteAppointment(int id)
        {
            var appointments = await _repo.Delete(id);
            return appointments;
        }

        /// <summary>
        /// Method to Get Appointment using AppointmentId
        /// </summary>
        /// <param name="id">Appointment Id in int</param>
        /// <returns>Appointments object</returns>
        public async Task<Appointments> GetAppointment(int id)
        {
            var appointments = await _repo.GetAsync(id);
            return appointments;
        }

        /// <summary>
        /// Method to get all Appointments
        /// </summary>
        /// <returns>Appointment Object</returns>
        public async Task<List<Appointments>> GetAppointmentList()
        {
            var appointments = await _repo.GetAsync();
            return appointments;
        }

        /// <summary>
        /// Method to Update DoctorId using AppointmentId
        /// </summary>
        /// <param name="appointmentId">Appointment Id as int</param>
        /// <param name="doctorId">Doctor Id as int</param>
        /// <returns>Appointments object</returns>
        public async Task<Appointments> UpdateAppointmentDoctor(int appointmentId, int doctorId)
        {
            var appointment = await _repo.GetAsync(appointmentId);
            if (appointment != null)
            {
                appointment.DoctorId = doctorId;
                appointment = await _repo.Update(appointment);
                return appointment;
            }
            return null;
        }

        /// <summary>
        /// Method to update PatientId using AppointmentId
        /// </summary>
        /// <param name="appointmentId">Appointment Id as int</param>
        /// <param name="patientId">PatientId as int</param>
        /// <returns>Appointments object</returns>
        public async Task<Appointments> UpdateAppointmentPatient(int appointmentId, int
       patientId)
        {
            var appointment = await _repo.GetAsync(appointmentId);
            if (appointment != null)
            {
                appointment.PatientId = patientId;
                appointment = await _repo.Update(appointment);
                return appointment;
            }
            return null;
        }

        /// <summary>
        /// Method to Update Appointment Date and Time
        /// </summary>
        /// <param name="appointmentId">Appointment Id as int</param>
        /// <param name="appointmentDate">Appointment Date as DATETIME</param>
        /// <returns>Appointments Object</returns>
        public async Task<Appointments> UpdateAppointmentDate(int appointmentId, DateTime appointmentDate)
        {
            try
            {
                var appointment = await _repo.GetAsync(appointmentId);
                if (appointment != null && appointmentDate >= DateTime.Now)
                {
                    appointment.AppointmentDate = appointmentDate;

                    appointment = await _repo.Update(appointment);
                }
                return appointment;

            }
            catch (Exception e)
            {
                throw new Exception("Can't select previous Date: " + e.Message);

            }
        }

        /// <summary>
        /// Method to get Appointment By DoctorID
        /// </summary>
        /// <param name="doctorId">DoctorId as int</param>
        /// <returns>Appointments object</returns>
        public async Task<List<DoctorViewAppointmentDTO>> GetAppointmentByDoctor(int doctorId)
        {
            var appointments = await _repo.GetAsync();
            appointments = appointments.Where(a => a.DoctorId == doctorId).ToList();
            List<DoctorViewAppointmentDTO> appointmentDetailsList = new List<DoctorViewAppointmentDTO>();
            foreach (var appointment in appointments)
            {
                var patient = await _patientService.GetPatient(appointment.PatientId);
                var appointmentDetails = new DoctorViewAppointmentDTO
                {
                    AppointmentId = appointment.AppointmentId,
                    PatientName = patient.PatientName,
                    ContactNumber = patient.ContactNumber,
                    Symptoms = appointment.SymptomsDescription,
                    AppointmentDate = appointment.AppointmentDate,
                    Status = appointment.Status,
                    PatientId = patient.PatientId
                };
                appointmentDetailsList.Add(appointmentDetails);
            }
            return appointmentDetailsList;
        }

        /// <summary>
        /// Method to get Appointment By PatientId
        /// </summary>
        /// <param name="patientId">Patient Id in int</param>
        /// <returns>Appointments object</returns>
        public async Task<List<PatientViewAppointmentDTO>> GetAppointmentByPatient(int patientId)
        {
            var appointments = await _repo.GetAsync();
            appointments = appointments.Where(a => a.PatientId == patientId).ToList();


            List<PatientViewAppointmentDTO> appointmentDetailsList = new List<PatientViewAppointmentDTO>();

            foreach (var appointment in appointments)
            {
                var patient = await _patientService.GetPatient(appointment.PatientId);
                var doctor = await _doctorService.GetDoctor(appointment.DoctorId);

                var appointmentDetails = new PatientViewAppointmentDTO
                {
                    AppointmentId = appointment.AppointmentId,
                    PatientName = patient.PatientName,
                    ContactNumber = patient.ContactNumber,
                    Symptoms = appointment.SymptomsDescription,
                    AppointmentDate = appointment.AppointmentDate,
                    Status = appointment.Status,
                    DoctorName = doctor.DoctorName,
                    DoctorId = doctor.DoctorId
                };

                appointmentDetailsList.Add(appointmentDetails);
            }

            return appointmentDetailsList;
        }

        /// <summary>
        /// Method to get All the upcoming Appointments
        /// </summary>
        /// <returns>Appointments Object</returns>
        public async Task<List<Appointments>> GetUpcomingAppointments()
        {
            var currentDate = DateTime.Now;

            var upcomingAppointments = await _repo.GetAsync();
            upcomingAppointments = upcomingAppointments
                .Where(appointment => appointment.AppointmentDate > currentDate && (appointment.Status == "upcoming" || appointment.Status == "RESCHEDULED"))
                .ToList();

            return upcomingAppointments;
        }


        /// <summary>
        /// Method to Change the  Status of an Appointment
        /// </summary>
        /// <param name="appointmentId">AppointmentId in int</param>
        /// <param name="Status">Status in string</param>
        /// <returns>Appointment Object</returns>
        public async Task<Appointments> UpdateAppointmentStatus(int appointmentId, string Status)
        {
            var appointment = await _repo.GetAsync(appointmentId);
            if (appointment != null)
            {
                appointment.Status = Status;

                appointment = await _repo.Update(appointment);
                return appointment;
            }
            return null;
        }

        /// <summary>
        /// Method to cancel the Appointment
        /// </summary>
        /// <param name="appointmentId">Appointment Id as int</param>
        /// <returns>Appointment Object</returns>
        public async Task<Appointments> CancelAppointment(int appointmentId)
        {
            var appointment = await _repo.GetAsync(appointmentId);
            if (appointment != null)
            {
                appointment.Status = "Cancelled";

                appointment = await _repo.Update(appointment);
                return appointment;
            }
            return null;
        }

        public async Task<Appointments> RescheduleAppointment(int appointmentId)
        {
            var appointment = await _repo.GetAsync(appointmentId);
            if (appointment != null)
            {
                if (appointment.AppointmentDate >= DateTime.Now)
                {
                    appointment.Status = "Rescheduled";

                    appointment = await _repo.Update(appointment);
                    return appointment;
                }
            }
            return null;
        }

        public async Task<Appointments> CompleteAppointment(int appointmentId)
        {
            var appointment = await _repo.GetAsync(appointmentId);
            if (appointment != null)
            {
                appointment.Status = "Completed";

                appointment = await _repo.Update(appointment);
                return appointment;
            }
            return null;
        }
    }
}