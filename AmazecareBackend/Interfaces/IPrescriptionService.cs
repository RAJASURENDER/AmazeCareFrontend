using AmazeCare.Models;

namespace AmazeCare.Interfaces
{
    public interface IPrescriptionService
    {
        public Task<Prescriptions> AddPrescription(Prescriptions prescriptions);

        public Task<List<Prescriptions>> GetPrescriptionList();

        public Task<Prescriptions> GetPrescriptionById(int id);

        public Task<Prescriptions> UpdatePrescription(Prescriptions prescriptions);

        public Task<List<Prescriptions>> GetPrescriptionsByRecordId(int recordId);

        
    }
}
