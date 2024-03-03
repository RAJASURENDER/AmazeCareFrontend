using AmazeCare.Exceptions;
using AmazeCare.Interfaces;
using AmazeCare.Models;
using System.Numerics;

namespace AmazeCare.Services
{
    public class DoctorService : IDoctorAdminService, IDoctorUserService
    {
        IRepository<int, Doctors> _repo;
        public DoctorService(IRepository<int, Doctors> repo)
        {
            _repo = repo;
        }

        /// <summary>
        /// Method to Add a DOCTOR
        /// </summary>
        /// <param name="doctor">Object of Doctors </param>
        /// <returns>Doctors Object</returns>
        public async Task<Doctors> AddDoctor(Doctors doctor)
        {
            doctor = await _repo.Add(doctor);
            return doctor;
        }

        /// <summary>
        /// Method to Delete a Doctor
        /// </summary>
        /// <param name="id">Doctor id as int</param>
        /// <returns>Doctor Object</returns>
        /// <exception cref="NoSuchDoctorException"> when doctor is not present</exception>
        public async Task<Doctors> DeleteDoctor(int id)
        {
            var doctor = await GetDoctor(id);
            if (doctor != null)
            {
                doctor = await _repo.Delete(id);
                return doctor;
            }
            throw new NoSuchDoctorException();
        }

        /// <summary>
        /// Method to Get Doctor Details By Doctor Id
        /// </summary>
        /// <param name="id"> Doctor Id as int</param>
        /// <returns>Doctor object</returns>
        public async Task<Doctors> GetDoctor(int id)
        {
            var doctor = await _repo.GetAsync(id);
            return doctor;
        }


        /// <summary>
        /// Method to Get all the Doctors
        /// </summary>
        /// <returns>Doctors Object</returns>
        public async Task<List<Doctors>> GetDoctorList()
        {
            var doctor = await _repo.GetAsync();
            return doctor;
        }


        /// <summary>
        /// Method to Update Doctor's Experience
        /// </summary>
        /// <param name="id">DoctorId in int</param>
        /// <param name="experience">Experience in float</param>
        /// <returns>Doctor Object</returns>
        public async Task<Doctors> UpdateDoctorExperience(int id, float experience)
        {
            var doctor = await _repo.GetAsync(id);
            if (doctor != null)
            {
                doctor.Experience = experience;
                doctor = await _repo.Update(doctor);
                return doctor;
            }
            return null;
        }

        /// <summary>
        /// Method to Update Doctor's Qualification
        /// </summary>
        /// <param name="id">Doctor id in int</param>
        /// <param name="qualification"> Qualification in string</param>
        /// <returns>Doctor Object</returns>
        public async Task<Doctors> UpdateDoctorQualification(int id, string qualification)
        {
            var doctor = await _repo.GetAsync(id);
            if (doctor != null)
            {
                doctor.Qualification = qualification;
                doctor = await _repo.Update(doctor);
                return doctor;
            }
            return null;
        }

        /// <summary>
        /// Method to Update All details Of Doctor
        /// </summary>
        /// <param name="item">Object of Doctor</param>
        /// <returns>Doctor's Object</returns>
        /// <exception cref="NoSuchDoctorException">Excepption When there is no doctor</exception>
        public async Task<Doctors> UpdateDoctor(Doctors item)
        {
            Doctors existingDoctor = await _repo.GetAsync(item.DoctorId);

            if (existingDoctor != null)
            {

                existingDoctor.DoctorName = item.DoctorName;
                existingDoctor.Qualification = item.Qualification;
                existingDoctor.Speciality = item.Speciality;
                existingDoctor.Designation = item.Designation;
                existingDoctor.Experience = item.Experience;

                await _repo.Update(existingDoctor);

                return existingDoctor;
            }
            throw new NoSuchDoctorException();
        }

        public async Task<List<Doctors>> GetDoctorsBySpeciality(string speciality)
        {
            var allDoctors = await _repo.GetAsync();

            var doctorsBySpeciality = allDoctors.Where(doctor => doctor.Speciality == speciality).ToList();

            return doctorsBySpeciality;
        }


        public async Task<int> GetDoctorIdByUsername(string username)
        {
            var doctors = await _repo.GetAsync();
            var doctor = doctors.FirstOrDefault(p => p.Username == username);

            return doctor?.DoctorId ?? -1;
        }
    }
}
