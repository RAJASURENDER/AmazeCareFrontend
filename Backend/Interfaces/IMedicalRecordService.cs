using AmazeCare.Models;
using AmazeCare.Models.DTOs;

namespace AmazeCare.Interfaces
{
    public interface IMedicalRecordService
    {
        public Task<MedicalRecords> AddMedicalRecord(MedicalRecords medicalRecords);

        public Task<List<MedicalRecords>> GetMedicalRecordList();

        public Task<MedicalRecords> GetMedicalRecordById(int id);

        public Task<List<PatientViewMedicalRecordDTO>> GetMedicalRecordByAppointment(int Id);

        public Task<List<PatientViewMedicalRecordDTO>> GetMedicalRecordByPatientId(int patientId);
        public Task<List<DoctorViewMedicalRecordDTO>> GetMedicalRecordByDoctorId(int doctorId);

    }
}
