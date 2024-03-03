using AmazeCare.Models;

namespace AmazeCare.Interfaces
{
    public interface IDoctorUserService
    {
        public Task<Doctors> GetDoctor(int id);

        public Task<List<Doctors>> GetDoctorsBySpeciality(string speciality);

    }
}
