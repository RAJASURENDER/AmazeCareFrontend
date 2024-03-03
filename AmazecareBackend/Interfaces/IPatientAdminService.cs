using AmazeCare.Models;

namespace AmazeCare.Interfaces
{
    public interface IPatientAdminService : IPatientUserService
    {


        public Task<List<Patients>> GetPatientList();
        public Task<Patients> AddPatient(Patients patients);

        public Task<Patients> DeletePatient(int id);

        public Task<Patients> UpdatePatientMobile(int id, string mobile);
        public Task<Patients> UpdatePatientAge(int id, int age);
        public Task<int> GetPatientIdByUsername(string username);
        public Task<Patients> UpdatePatient(Patients patients);

    }
}
