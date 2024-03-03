using AmazeCare.Exceptions;
using AmazeCare.Interfaces;
using AmazeCare.Models;

namespace AmazeCare.Services
{
    public class PatientService : IPatientAdminService, IPatientUserService
    {

        IRepository<int, Patients> _repository;
        public PatientService(IRepository<int, Patients> repository)
        {
            _repository = repository;
        }

        /// <summary>
        /// Method for Adding Patient
        /// </summary>
        /// <param name="patient">Object Of Patients</param>
        /// <returns>Patients Object</returns>
        public async Task<Patients> AddPatient(Patients patient)
        {
            patient = await _repository.Add(patient);
            return patient;
        }

        /// <summary>
        /// Method to delete Patient
        /// </summary>
        /// <param name="id">Patient Id in int</param>
        /// <returns>Patients Object</returns>
        /// <exception cref="NoSuchPatientException">Exception When Patient is not present</exception>
        public async Task<Patients> DeletePatient(int id)
        {
            var patient = await GetPatient(id);
            if (patient != null)
            {
                patient = await _repository.Delete(id);
                return patient;
            }
            throw new NoSuchPatientException();
        }

        /// <summary>
        /// Method To get patient by id
        /// </summary>
        /// <param name="id">PatientId in int</param>
        /// <returns>Patient Object</returns>
        public async Task<Patients> GetPatient(int id)
        {
            var patient = await _repository.GetAsync(id);
            return patient;
        }

        /// <summary>
        /// Method to get all Patients
        /// </summary>
        /// <returns>Patients Object</returns>
        public async Task<List<Patients>> GetPatientList()
        {
            var patients = await _repository.GetAsync();
            return patients;
        }

        /// <summary>
        /// Method to Update Patient Age
        /// </summary>
        /// <param name="id">Patientid in int</param>
        /// <param name="age">Age in int</param>
        /// <returns>Patients Object</returns>
        public async Task<Patients> UpdatePatientAge(int id, int age)
        {
            var patient = await _repository.GetAsync(id);
            if (patient != null)
            {
                patient.Age = age;
                _repository.Update(patient);
                return patient;
            }
            return null;
        }

        /// <summary>
        /// Method to Update Patient Mobile Number
        /// </summary>
        /// <param name="id">PatientId in int</param>
        /// <param name="mobile">Patient Mobile number in string</param>
        /// <returns>The updated patients object</returns>
        public async Task<Patients> UpdatePatientMobile(int id, string mobile)
        {
            var patient = await _repository.GetAsync(id);
            if (patient != null)
            {
                patient.ContactNumber = mobile;
                _repository.Update(patient);
                return patient;
            }
            return null;
        }

        /// <summary>
        /// Method to update all records of Patient
        /// </summary>
        /// <param name="item">Object of Patients</param>
        /// <returns>Patients Object</returns>
        /// <exception cref="NoSuchPatientException">When Patient is not present</exception>
        public async Task<Patients> UpdatePatient(Patients item)
        {
            Patients existingPatient = await _repository.GetAsync(item.PatientId);

            if (existingPatient != null)
            {

                existingPatient.PatientName = item.PatientName;
                existingPatient.Age = item.Age;
                existingPatient.Gender = item.Gender;
                existingPatient.DateOfBirth = item.DateOfBirth;
                existingPatient.ContactNumber = item.ContactNumber;

                await _repository.Update(existingPatient);

                return existingPatient;
            }
            throw new NoSuchPatientException();
        }

        public async Task<int> GetPatientIdByUsername(string username)
        {
            var patients = await _repository.GetAsync();
            var patient = patients.FirstOrDefault(p => p.Username == username);

            return patient?.PatientId ?? -1;
        }


    }
}
