using AmazeCare.Models;

namespace AmazeCare.Interfaces
{
    public interface IPatientUserService
    {
        public Task<Patients> GetPatient(int id);

    }
}
