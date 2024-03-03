using AmazeCare.Interfaces;
using AmazeCare.Models;
using AmazeCare.Models.DTOs;
using AmazeCare.Repositories;
using System.Numerics;

namespace AmazeCare.Services
{
    public class MedicalRecordService : IMedicalRecordService
    {

        private readonly IPatientAdminService _patientService;
        private readonly IDoctorAdminService _doctorService;
        private readonly IAppointmentAdminService _appointmentService;


        IRepository<int, MedicalRecords> _repo;


        public MedicalRecordService(IRepository<int, MedicalRecords> repo,
            IPatientAdminService patientService, IDoctorAdminService doctorService, IAppointmentAdminService appointmentService
           )
        {
            _repo = repo;
            _patientService = patientService;
            _doctorService = doctorService;
            _appointmentService = appointmentService;


        }

        /// <summary>
        /// Method for Adding Medical Record
        /// </summary>
        /// <param name="medicalRecords">Object of medicalRecords</param>
        /// <returns>medicalRecords Object</returns>
        public async Task<MedicalRecords> AddMedicalRecord(MedicalRecords medicalRecords)
        {
            medicalRecords = await _repo.Add(medicalRecords);
            return medicalRecords;
        }

        /// <summary>
        /// Method to get medical Record By RecordId
        /// </summary>
        /// <param name="id">MedicalRecordId in int</param>
        /// <returns>medicalRecords Object</returns>
        public async Task<MedicalRecords> GetMedicalRecordById(int id)
        {
            var medicalRecords = await _repo.GetAsync(id);
            return medicalRecords;
        }


        /// <summary>
        /// Method to get All the MedicalRecords
        /// </summary>
        /// <returns>MedicalRecords Object</returns>
        public async Task<List<MedicalRecords>> GetMedicalRecordList()
        {

            var medicalRecords = await _repo.GetAsync();
            return medicalRecords;
        }


        /// <summary>
        /// Method to get MedicalRecord by AppointmentId
        /// </summary>
        /// <param name="appointmentId">AppointmentId in int</param>
        /// <returns>MedicalRecords Object</returns>
        public async Task<List<PatientViewMedicalRecordDTO>> GetMedicalRecordByAppointment(int appointmentId)
        {
            var medicalRecords = await _repo.GetAsync();

            medicalRecords = medicalRecords.Where(a => a.AppointmentId == appointmentId).ToList();


            List<PatientViewMedicalRecordDTO> medicalRecordDetailsList = new List<PatientViewMedicalRecordDTO>();

            foreach (var medicalRecord in medicalRecords)
            {
                var appointment = await _appointmentService.GetAppointment(medicalRecord.AppointmentId);
                if (appointment != null)
                {
                    var patient = await _patientService.GetPatient(appointment.PatientId);
                    var doctor = await _doctorService.GetDoctor(appointment.DoctorId);

                    var medicalRecordDetails = new PatientViewMedicalRecordDTO
                    {

                        PatientName = patient.PatientName,
                        DoctorName = doctor.DoctorName,
                        RecordId = medicalRecord.RecordId,
                        CurrentSymptoms = medicalRecord.CurrentSymptoms,
                        PhysicalExamination = medicalRecord.PhysicalExamination,
                        TreatmentPlan = medicalRecord.TreatmentPlan,
                        RecommendedTests = medicalRecord.RecommendedTests,
                        AppointmentId = medicalRecord.AppointmentId

                    };

                    medicalRecordDetailsList.Add(medicalRecordDetails);
                }


            }
            return medicalRecordDetailsList;
        }

        /// <summary>
        /// Method to get MedicalRecord By PatientId
        /// </summary>
        /// <param name="patientId">PatientId in int</param>
        /// <returns>MedicalRecords Object</returns>
        public async Task<List<PatientViewMedicalRecordDTO>> GetMedicalRecordByPatientId(int patientId)
        {

            var appointments = await _appointmentService.GetAppointmentByPatient(patientId);


            List<PatientViewMedicalRecordDTO> medicalRecordDetailsList = new List<PatientViewMedicalRecordDTO>();

            foreach (var appointment in appointments)
            {

                var medicalRecords = await GetMedicalRecordByAppointment(appointment.AppointmentId);

                foreach (var medicalRecord in medicalRecords)
                {
                    var patient = await _patientService.GetPatient(patientId);
                    var doctor = await _doctorService.GetDoctor(appointment.DoctorId);



                    var medicalRecordDetails = new PatientViewMedicalRecordDTO
                    {
                        PatientName = patient.PatientName,
                        DoctorName = doctor.DoctorName,
                        RecordId = medicalRecord.RecordId,
                        CurrentSymptoms = medicalRecord.CurrentSymptoms,
                        PhysicalExamination = medicalRecord.PhysicalExamination,
                        TreatmentPlan = medicalRecord.TreatmentPlan,
                        RecommendedTests = medicalRecord.RecommendedTests,
                        AppointmentId = appointment.AppointmentId

                    };

                    medicalRecordDetailsList.Add(medicalRecordDetails);
                }
            }

            return medicalRecordDetailsList;
        }

        public async Task<List<DoctorViewMedicalRecordDTO>> GetMedicalRecordByDoctorId(int doctorId)
        {
            // Get appointments by DoctorId
            var appointments = await _appointmentService.GetAppointmentByDoctor(doctorId);

            List<DoctorViewMedicalRecordDTO> medicalRecordDetailsList = new List<DoctorViewMedicalRecordDTO>();

            // Fetch doctor details outside the loop since it does not depend on appointments
            var doctor = await _doctorService.GetDoctor(doctorId);

            foreach (var appointment in appointments)
            {
                // Get medical records by AppointmentId
                var medicalRecords = await GetMedicalRecordByAppointment(appointment.AppointmentId);

                // Fetch patient details outside the loop since it does not depend on medical records
                var patient = await _patientService.GetPatient(appointment.PatientId);

                foreach (var medicalRecord in medicalRecords)
                {
                    // Create the medical record details DTO
                    var medicalRecordDetails = new DoctorViewMedicalRecordDTO
                    {
                        PatientName = patient.PatientName,
                        DoctorName = doctor.DoctorName,
                        RecordId = medicalRecord.RecordId,
                        CurrentSymptoms = medicalRecord.CurrentSymptoms,
                        PhysicalExamination = medicalRecord.PhysicalExamination,
                        TreatmentPlan = medicalRecord.TreatmentPlan,
                        RecommendedTests = medicalRecord.RecommendedTests,
                        AppointmentId = appointment.AppointmentId
                    };

                    medicalRecordDetailsList.Add(medicalRecordDetails);
                }
            }

            return medicalRecordDetailsList;
        }


    }
}












