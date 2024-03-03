
using AmazeCare.Interfaces;
using AmazeCare.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AmazeCare.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;

namespace AmazeCare.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("ReactPolicy")]
    public class AppointmentController : ControllerBase
    {
        IAppointmentAdminService _appointmentAdminService;
        IAppointmentUserService _appointmentUserService;
        public AppointmentController(IAppointmentAdminService appointmentAdminService,
       IAppointmentUserService appointmentUserService)
        {
            _appointmentAdminService = appointmentAdminService;
            _appointmentUserService = appointmentUserService;
        }

        [Authorize(Roles = "Admin, Doctor")]
        [Route("/ViewAllTheAppointments")] //admin
        [HttpGet]
        public async Task<List<Appointments>> GetAppointment()
        {
            var appointment = await _appointmentAdminService.GetAppointmentList();
            return appointment;
        }

        [Authorize]
        [Route("/ViewAppointmentByAppointmentId")]
        [HttpGet]
        public async Task<Appointments> GetAppointmentById(int id)
        {
            var appointment = await _appointmentUserService.GetAppointment(id);
            return appointment;
        }

        [Authorize(Roles = "Patient")]
        [Route("/BookAnAppointment")]
        [HttpPost]
        public async Task<Appointments> PostAppointment(Appointments appointment)
        {
            appointment = await _appointmentAdminService.AddAppointment(appointment);
            return appointment;
        }

        /// <summary>
        /// This method is used to update DoctorId in Appointments
        /// </summary>
        /// <param name="appointmentDTO"></param>
        /// <returns> Appointment with updated DoctorId</returns>

        [Authorize(Roles = "Admin")]
        [Route("/UpdateDoctorIdInAppointments")]
        [HttpPut]
        public async Task<Appointments> UpdateAppointmentDoctor(AppointmentDoctorDTO
       appointmentDTO)
        {
            var appointment = await
           _appointmentAdminService.UpdateAppointmentDoctor(appointmentDTO.Id,
           appointmentDTO.DoctorId);
            return appointment;
        }

        [Authorize]
        [Route("/RescheduleAppointment")]
        [HttpPut]
        public async Task<Appointments> UpdateAppointmentDate(AppointmentDateDTO appointmentDTO)
        {
            var appointment = await
           _appointmentAdminService.UpdateAppointmentDate(appointmentDTO.Id, appointmentDTO.AppointmentDate);
            return appointment;
        }

        [Authorize]
        [Route("/StatusToCancelAppointment")]
        [HttpPut]
        public async Task<Appointments> CancelAppointment(int id)
        {
            var appointment = await _appointmentAdminService.CancelAppointment(id);
            return appointment;
        }

        [Authorize]
        [Route("/StatusToRescheduleAppointment")] //patient
        [HttpPut]
        public async Task<Appointments> RescheduleAppointment(int id)
        {
            var appointment = await _appointmentAdminService.RescheduleAppointment(id);
            return appointment;
        }

        [Authorize]
        [Route("/StatusToCompleteAppointment")] //patient
        [HttpPut]
        public async Task<Appointments> CompleteAppointment(int id)
        {
            var appointment = await _appointmentAdminService.CompleteAppointment(id);
            return appointment;
        }


        [Authorize(Roles = "Admin,Doctor")]
        [Route("/ViewAppointmentsByDoctorId")]
        [HttpGet]
        public async Task<List<DoctorViewAppointmentDTO>> GetAppointmentByDoctor(int doctorId)
        {

            var appointmentDetailsList = await _appointmentAdminService.GetAppointmentByDoctor(doctorId);
            return appointmentDetailsList;

        }

        [Authorize(Roles = "Admin,Patient")]
        [Route("/ViewAppointmentsByPatientId")]
        [HttpGet]
        public async Task<List<PatientViewAppointmentDTO>> GetAppointmentByPatient(int patientId)
        {

            var appointmentDetailsList = await _appointmentAdminService.GetAppointmentByPatient(patientId);
            return appointmentDetailsList;

        }

        [Authorize(Roles = "Admin,Doctor")]
        [Route("/ViewAllUpcomingAppointments")]
        [HttpGet]
        public async Task<List<Appointments>> GetUpcomingAppointments()
        {
            var appointment = await _appointmentAdminService.GetUpcomingAppointments();
            return appointment;
        }

        [Authorize(Roles = "Admin,Doctor")]
        [Route("/CHANGEAPPOINTMENTSTATUS")]
        [HttpPut]
        public async Task<Appointments> UpdateAppointmentStatus(AppointmentStatusDTO
     appointmentDTO)
        {
            var appointment = await _appointmentAdminService.UpdateAppointmentStatus(appointmentDTO.Id,
           appointmentDTO.Status);
            return appointment;
        }
    }
}