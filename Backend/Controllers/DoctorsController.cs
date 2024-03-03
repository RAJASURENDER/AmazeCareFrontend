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
    public class DoctorsController : ControllerBase
    {
        private readonly IDoctorAdminService _adminService;
        private readonly IDoctorUserService _userService;
        public DoctorsController(IDoctorAdminService adminService, IDoctorUserService
       userService)
        {
            _adminService = adminService;
            _userService = userService;
        }

        [Authorize]
        [Route("/ViewAllDoctors")]
        [HttpGet]
        public async Task<List<Doctors>> GetDoctor()
        {
            var doctor = await _adminService.GetDoctorList();
            return doctor;
        }

        [Authorize]
        [Route("/ViewDoctorById")]
        [HttpGet]
        public async Task<Doctors> GetDoctorById(int id)
        {
            var doctor = await _userService.GetDoctor(id);
            return doctor;
        }


        [Authorize(Roles = "Admin")]
        [Route("/UpdateExperienceOfTheDoctor")]
        [HttpPut]
        public async Task<Doctors> UpdateDoctorExperience(DoctorExperienceDTO doctorDTO)
        {
            var doctor = await _adminService.UpdateDoctorExperience(doctorDTO.Id, doctorDTO.Experience);
            return doctor;
        }

        [Authorize(Roles = "Admin")]
        [Route("/UpdateQualificationOfTheDoctor")]
        [HttpPut]
        public async Task<Doctors> UpdateDoctorQualification(DoctorQualificationDTO
       doctorDTO)
        {
            var doctor = await _adminService.UpdateDoctorQualification(doctorDTO.Id,
           doctorDTO.Qualification);
            return doctor;
        }

        [Authorize(Roles = "Admin")]
        [Route("/UpdatewholeOfTheDoctor")]

        [HttpPut]
        public async Task<Doctors> UpdateDoctor(Doctors doctors)
        {
            var doctor = await _adminService.UpdateDoctor(doctors);
            return doctor;
        }

        [Authorize(Roles = "Admin")]
        [Route("/DeleteDoctor")]
        [HttpDelete]
        public async Task<Doctors> DeleteDoctor(int id)
        {
            var doctor = await _adminService.DeleteDoctor(id);
            return doctor;
        }

        [HttpGet("DoctorsBySpeciality")]
        public async Task<ActionResult<List<Doctors>>> GetDoctorsBySpeciality(string speciality)
        {
            try
            {
                var doctors = await _adminService.GetDoctorsBySpeciality(speciality);

                if (doctors == null || doctors.Count == 0)
                {
                    return NotFound("No doctors found for the specified speciality.");
                }

                return Ok(doctors);
            }
            catch (Exception ex)
            {

                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("GetDoctorIdByUsername")]
        public async Task<ActionResult<int>> GetDoctorIdByUsername(string username)
        {
            var patientId = await _adminService.GetDoctorIdByUsername(username);
            if (patientId != -1)
            {
                return Ok(patientId);
            }
            return NotFound(); // Return 404 if no patient found with the given username
        }

    }
}
