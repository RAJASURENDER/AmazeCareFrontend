using AmazeCare.Contexts;
using AmazeCare.Exceptions;
using AmazeCare.Interfaces;
using AmazeCare.Models;
using Microsoft.EntityFrameworkCore;

namespace AmazeCare.Repositories
{ 
    public class PatientRepository : IRepository<int, Patients>
    {
        RequestTrackerContext _context;
        ILogger<PatientRepository> _logger;

        /// <summary>
        /// Initializes a new instance of the PrescriptionRepository class with the specified database context and logger.
        /// </summary>
        /// <param name="context">The database context.</param>
        /// <param name="logger">The logger.</param>

        public PatientRepository(RequestTrackerContext context, ILogger<PatientRepository>
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

        public async Task<Patients> Add(Patients item)
        {
            _context.Add(item);
            _context.SaveChanges();
            _logger.LogInformation("Patient added " + item.PatientId);
            return item;
        }

        /// <summary>
        /// Deletes a prescription from the database based on the specified key.
        /// </summary>
        /// <param name="key">The key of the prescription to delete.</param>
        /// <returns>The deleted prescription.</returns>

        public async Task<Patients> Delete(int key)
        {
            var patient = await GetAsync(key);
            _context.Patients.Remove(patient);
            _context.SaveChanges();
            _logger.LogInformation("Patient deleted " + key);
            return patient;
        }

        /// <summary>
        /// Retrieves a prescription from the database based on the specified key.
        /// </summary>
        /// <param name="key">The key of the prescription to retrieve.</param>
        /// <returns>The retrieved prescription.</returns>
        /// <exception cref="NoSuchPrescriptionException">Thrown when the prescription with the specified key does not exist.</exception>

        public async Task<Patients> GetAsync(int key)
        {
            var patients = await GetAsync();
            var patient = patients.SingleOrDefault(e => e.PatientId == key);
            if (patient != null)
            {
                return patient;
            }
            throw new NoSuchPatientException();
        }

        /// <summary>
        /// Retrieves all prescriptions from the database.
        /// </summary>
        /// <returns>A list of all prescriptions.</returns>

        public async Task<List<Patients>> GetAsync()
        {
            var patient = _context.Patients.ToList();
            return patient;
        }

        /// <summary>
        /// Updates the information of a prescription in the database.
        /// </summary>
        /// <param name="item">The prescription object with updated information.</param>
        /// <returns>The updated prescription.</returns>

        public async Task<Patients> Update(Patients item)
        {
            var patient = await GetAsync(item.PatientId);
            _context.Entry<Patients>(item).State = EntityState.Modified;
            _context.SaveChanges();
            _logger.LogInformation("Patient updated " + item.PatientId);
            return patient;
        }
    }
}


