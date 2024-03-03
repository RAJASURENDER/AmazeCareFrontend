using AmazeCare.Models;

namespace AmazeCare.Interfaces
{
    public interface IPrescriptionRepository 
    {
        public  Task<List<Prescriptions>> GetByRecordIdAsync(int recordId);
    }
}
