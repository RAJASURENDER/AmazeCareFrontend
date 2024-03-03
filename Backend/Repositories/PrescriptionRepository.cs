using AmazeCare.Contexts;
using AmazeCare.Exceptions;
using AmazeCare.Interfaces;
using AmazeCare.Models;
using Microsoft.EntityFrameworkCore;

namespace AmazeCare.Repositories
{
    public class PrescriptionRepository :IRepository<int, Prescriptions>, IPrescriptionRepository
    {

        RequestTrackerContext _context;
        ILogger<PrescriptionRepository> _logger;

        /// <summary>
        /// Initializes a new instance of the PrescriptionRepository class with the specified database context and logger.
        /// </summary>
        /// <param name="context">The database context.</param>
        /// <param name="logger">The logger.</param>

        public PrescriptionRepository(RequestTrackerContext context, ILogger<PrescriptionRepository>
       logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Adds a new prescription to the database.
        /// </summary>
        /// <param name="item">The prescription to add.</param>
        /// <returns>The added prescription.</returns>

        public async  Task<Prescriptions> Add(Prescriptions item)
        {
            _context.Add(item);
            _context.SaveChanges();
            _logger.LogInformation("Prescription added " + item.PrescriptionId);
            return item;
        }

        /// <summary>
        /// Deletes a prescription from the database based on the specified key.
        /// </summary>
        /// <param name="key">The key of the prescription to delete.</param>
        /// <returns>The deleted prescription.</returns>

        public async Task<Prescriptions> Delete(int key)
        {
            var prescription = await GetAsync(key);
            _context.Prescriptions.Remove(prescription);
            _context.SaveChanges();
            _logger.LogInformation("Prescription deleted " + key);
            return prescription;
        }

        /// <summary>
        /// Retrieves a prescription from the database based on the specified key.
        /// </summary>
        /// <param name="key">The key of the prescription to retrieve.</param>
        /// <returns>The retrieved prescription.</returns>
        /// <exception cref="NoSuchPrescriptionException">Thrown when the prescription with the specified key does not exist.</exception>

        public async Task<Prescriptions> GetAsync(int key)
        {
            var prescriptions = await GetAsync();
            var prescription = prescriptions.FirstOrDefault(e => e.PrescriptionId == key);
            if (prescriptions!= null)
            {
                
                return prescription;

            }
            throw new NoSuchPrescriptionException();
        }

        /// <summary>
        /// Retrieves all prescriptions from the database.
        /// </summary>
        /// <returns>A list of all prescriptions.</returns>

        public async Task<List<Prescriptions>> GetAsync()
        {
            var prescriptions = _context.Prescriptions.ToList();
            return prescriptions;
        }

        /// <summary>
        /// Retrieves all prescriptions by RecordId
        /// </summary>
        /// <param name="recordId">Record id in int</param>
        /// <returns> A list of prescriptions</returns>
        public async Task<List<Prescriptions>> GetByRecordIdAsync(int recordId)
        {
            var prescriptions = _context.Prescriptions
                            .Where(p => p.RecordId == recordId)
                            .ToList();

            return prescriptions;
        }

        /// <summary>
        /// Updates the information of a prescription in the database.
        /// </summary>
        /// <param name="item">The prescription object with updated information.</param>
        /// <returns>The updated prescription.</returns>


        public async Task<Prescriptions> Update(Prescriptions item)
        {
            var prescription = await GetAsync(item.PrescriptionId);
            _context.Entry<Prescriptions>(item).State = EntityState.Modified;
            _context.SaveChanges();
            _logger.LogInformation("Prescription updated " + item.PrescriptionId);
            return prescription;
        }
    }

}

