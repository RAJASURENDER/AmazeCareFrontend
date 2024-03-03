using AmazeCare.Interfaces;
using AmazeCare.Models;
using AmazeCare.Models.DTOs;
using AmazeCare.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;

namespace AmazeCare.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("ReactPolicy")]
    public class MedicalRecordController : ControllerBase
    {
        IMedicalRecordService _medicalRecordService;

        public MedicalRecordController(IMedicalRecordService medicalRecordService)
        {

            _medicalRecordService = medicalRecordService;
        }

        [Authorize]
        [Route("/ViewAllMedicalRecords")]
        [HttpGet]
        public async Task<List<MedicalRecords>> GetMedicalRecord()
        {
            var medicalRecords = await _medicalRecordService.GetMedicalRecordList();
            return medicalRecords;
        }




        [Authorize]
        [Route("/ViewMedicalRecordById")]
        [HttpGet]
        public async Task<MedicalRecords> GetMedicalRecordById(int id)
        {
            var medicalRecord = await _medicalRecordService.GetMedicalRecordById(id);
            return medicalRecord;
        }

        [Authorize(Roles = "Doctor")]
        [Route("AddMedicalRecord")]
        [HttpPost]
        public async Task<MedicalRecords> PostMedicalRecord(MedicalRecords medicalRecords)
        {
            medicalRecords = await _medicalRecordService.AddMedicalRecord(medicalRecords);
            return medicalRecords;
        }

        [Authorize]
        [Route("/ViewMedicalRecordByAppointmentId")]
        [HttpGet]
        public async Task<List<PatientViewMedicalRecordDTO>> GetMedicalRecordByAppointment(int Id)
        {

            var medicalRecordDetailsList = await _medicalRecordService.GetMedicalRecordByAppointment(Id);
            return medicalRecordDetailsList;


        }

        [Authorize]
        [Route("/ViewAllMedicalRecordsByPatientId")]
        [HttpGet]
        public async Task<List<PatientViewMedicalRecordDTO>> GetMedicalRecordByPatientId(int Id)
        {

            var medicalRecordDetailsList = await _medicalRecordService.GetMedicalRecordByPatientId(Id);
            return medicalRecordDetailsList;
        }

        [Authorize]
        [Route("/ViewAllMedicalRecordsByDoctorId")]
        [HttpGet]
        public async Task<ActionResult<List<DoctorViewMedicalRecordDTO>>> GetMedicalRecordByDoctorId(int doctorId)
        {

            var medicalRecords = await _medicalRecordService.GetMedicalRecordByDoctorId(doctorId);
            return medicalRecords;


        }
    }
}
