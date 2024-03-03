using AmazeCare.Interfaces;
using AmazeCare.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AmazeCare.Models.DTOs;
using Microsoft.AspNetCore.Cors;

namespace AmazeCare.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("ReactPolicy")]
    public class PatientController : ControllerBase
    {
        IPatientAdminService _adminService;
        IPatientUserService _userService;
        public PatientController(IPatientAdminService adminService, IPatientUserService
       userService)
        {
            _adminService = adminService;
            _userService = userService;
        }

        [Authorize(Roles = "Admin")]
        [Route("/ViewAllPatients")]
        [HttpGet]

        public async Task<List<Patients>> GetPatient()
        {
            var patient = await _adminService.GetPatientList();
            return patient;
        }


      
        [Authorize]
        [Route("/ViewPatientById")]
        [HttpGet]
        public async Task<Patients> GetPatientById(int id)
        {
            var patient = await _userService.GetPatient(id);
            return patient;
        }


        

        [Authorize(Roles = "Patient,Admin")]
        [Route("/Update Patient Age")]
        [HttpPut]
        public async Task<Patients> UpdatePatientAge(PatientAgeDTO patientDTO)
        {
            var patient = await _adminService.UpdatePatientAge(patientDTO.Id, patientDTO.Age);
            return patient;
        }

        [Authorize(Roles = "Patient,Admin")]
        [Route("Update Mobile Number")]
        [HttpPut]
        public async Task<Patients> UpdatePatientMobile(PatientMobileDTO patientDTO)
        {
            var patient = await _adminService.UpdatePatientMobile(patientDTO.Id,
           patientDTO.Mobile);
            return patient;
        }

        [Authorize(Roles = "Patient,Admin")]
        [Route("DeletePatient")]
        [HttpDelete]
        public async Task<Patients> DeletePatient(int id)
        {
            var patient = await _adminService.DeletePatient(id);
            return patient;
        }


        [Authorize(Roles = "Patient,Admin")]
        [Route("/UpdateAllDetailsOfThePatient")]

        [HttpPut]
        public async Task<Patients> UpdatePatient(Patients patients)
        {
            var doctor = await _adminService.UpdatePatient(patients);
            return doctor;
        }

        [HttpGet("GetPatientIdByUsername")]
  public async Task<ActionResult<int>> GetPatientIdByUsername(string username)
  {
      var patientId = await _adminService.GetPatientIdByUsername(username);
      if (patientId != -1)
      {
          return Ok(patientId);
      }
      return NotFound(); // Return 404 if no patient found with the given username
  }
  
    }
}
