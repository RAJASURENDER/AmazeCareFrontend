using AmazeCare.Models;
using System.Numerics;

namespace AmazeCare.Interfaces
{
    public interface IDoctorAdminService : IDoctorUserService
    {



        public Task<List<Doctors>> GetDoctorList();
        public Task<Doctors> AddDoctor(Doctors doctor);
        public Task<Doctors> UpdateDoctorQualification(int id, string qualification);
        public Task<Doctors> UpdateDoctorExperience(int id, float experience);
        public Task<Doctors> DeleteDoctor(int id);

        public Task<Doctors>? UpdateDoctor(Doctors item);

        public Task<int> GetDoctorIdByUsername(string username);


    }
}
