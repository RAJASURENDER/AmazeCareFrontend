using AmazeCare.Interfaces;
using AmazeCare.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;

namespace AmazeCare.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("ReactPolicy")]
    public class PrescriptionController : ControllerBase
    {
        IPrescriptionService _prescriptionService;

        public PrescriptionController(IPrescriptionService prescriptionService)
        {

            _prescriptionService = prescriptionService;
        }

        [Authorize(Roles = "Admin,Patient")]
        [Route("ViewAllPrescriptions")]
        [HttpGet]
        public async Task<List<Prescriptions>> GetPrescription()
        {
            var prescriptions = await _prescriptionService.GetPrescriptionList();
            return prescriptions;
        }


        [Authorize(Roles = "Doctor")]
        [Route("AddPrescription")]
        [HttpPost]
        public async Task<Prescriptions> PostMedicalRecord(Prescriptions prescriptions)
        {
            prescriptions = await _prescriptionService.AddPrescription(prescriptions);
            return prescriptions;
        }
       


        [Authorize(Roles = "Doctor")]
        [Route("/UpdatewholePrescription")]

        [HttpPut]
        public async Task<Prescriptions> UpdatePrescription(Prescriptions prescriptions)
        {
            var prescription= await _prescriptionService.UpdatePrescription(prescriptions);
            return prescription;
        }


        [Authorize]
        [Route("/ViewPrescriptionByRecordId")]
 
        [HttpGet]
        public async Task<List<Prescriptions>> GetPrescriptionsByRecordId(int recordId)
        {
            var prescriptions = await _prescriptionService.GetPrescriptionsByRecordId(recordId);
            return prescriptions;
        }
    }
}
