using AmazeCare.Exceptions;
using AmazeCare.Interfaces;
using AmazeCare.Models;
using Microsoft.EntityFrameworkCore;

namespace AmazeCare.Services
{

    public class PrescriptionService : IPrescriptionService
    {
        IRepository<int, Prescriptions> _repo;
        IPrescriptionRepository _repos;

       

        public PrescriptionService(IRepository<int, Prescriptions> repo, IPrescriptionRepository repos)
        {
            _repo = repo;
            _repos = repos;
        }

        /// <summary>
        /// Method to add Prescription
        /// </summary>
        /// <param name="prescriptions">Object of Prescriptions</param>
        /// <returns>Prescriptions Object</returns>
        public async Task<Prescriptions> AddPrescription(Prescriptions prescriptions)
        {
            prescriptions = await _repo.Add(prescriptions);
            return prescriptions;
        }


        /// <summary>
        /// Method to get All Prescriptions
        /// </summary>
        /// <returns>Prescription Object</returns>
        public async Task<List<Prescriptions>> GetPrescriptionList()
        {
            var prescription = await _repo.GetAsync();
            return prescription;

        }

        /// <summary>
        /// Method to get prescription by id
        /// </summary>
        /// <param name="id">id in int</param>
        /// <returns>Prescription Object</returns>
        public async Task<Prescriptions> GetPrescriptionById(int id)
        {
            var prescriptions = await _repo.GetAsync(id);
            return prescriptions;
        }

        /// <summary>
        /// Method to Update Prescription
        /// </summary>
        /// <param name="item"> Prescriptionid in int</param>
        /// <returns>Prescription Object</returns>
        /// <exception cref="NoSuchPrescriptionException">Exception When precription is not present</exception>

        public async Task<Prescriptions> UpdatePrescription(Prescriptions item)
        {
            Prescriptions existingPrescription = await _repo.GetAsync(item.PrescriptionId);

            if (existingPrescription != null)
            {
               
                existingPrescription.Medicine = item.Medicine;
                existingPrescription.RecordId = item.RecordId;
                existingPrescription.Instructions = item.Instructions;
                existingPrescription.Dosage = item.Dosage;


                await _repo.Update(existingPrescription); 

                return existingPrescription;
            }
            throw new NoSuchPrescriptionException();
        }

        /// <summary>
        /// Method to get prescription by record id
        /// </summary>
        /// <param name="recordId">recordid in int</param>
        /// <returns>Prescriptions Object</returns>
        public async Task<List<Prescriptions>> GetPrescriptionsByRecordId(int recordId)
        {
            var prescriptions = await _repos.GetByRecordIdAsync(recordId);
            return prescriptions;
        }



    }
}
