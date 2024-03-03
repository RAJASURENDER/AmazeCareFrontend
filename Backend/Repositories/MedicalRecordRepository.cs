using AmazeCare.Contexts;
using AmazeCare.Exceptions;
using AmazeCare.Interfaces;
using AmazeCare.Models;
using Microsoft.EntityFrameworkCore;

namespace AmazeCare.Repositories
{
    public class MedicalRecordRepository : IRepository<int,MedicalRecords>
    {

        RequestTrackerContext _context;
        ILogger<MedicalRecordRepository> _logger;

        /// <summary>
        /// Initializes a new instance of the MedicalRecordRepository class with the specified database context and logger.
        /// </summary>
        /// <param name="context">The database context.</param>
        /// <param name="logger">The logger.</param>

        public MedicalRecordRepository(RequestTrackerContext context, ILogger<MedicalRecordRepository>
       logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Adds a new medical record to the database.
        /// </summary>
        /// <param name="item">The medical record to add.</param>
        /// <returns>The added medical record.</returns>

        public async  Task<MedicalRecords> Add(MedicalRecords item)
        {
            _context.Add(item);
            _context.SaveChanges();
            _logger.LogInformation("MedicalRecord added " + item.RecordId);
            return item;
        }

        /// <summary>
        /// Retrieves all medical records from the database.
        /// </summary>
        /// <returns>A list of all medical records.</returns>

        public async Task<List<MedicalRecords>> GetAsync()
        {
            var medicalRecords = _context.MedicalRecords.ToList();
            return medicalRecords;
        }

        /// <summary>
        /// Deletes a medical record from the database based on the specified key.
        /// </summary>
        /// <param name="key">The key of the medical record to delete.</param>
        /// <returns>The deleted medical record.</returns>

        public async Task<MedicalRecords> Delete(int key)
        {
            var medicalRecord = await GetAsync(key);
            _context.MedicalRecords.Remove(medicalRecord);
            _context.SaveChanges();
            _logger.LogInformation("MedicalRecord deleted " + key);
            return medicalRecord ;
        }

        /// <summary>
        /// Retrieves a medical record from the database based on the specified key.
        /// </summary>
        /// <param name="key">The key of the medical record to retrieve.</param>
        /// <returns>The retrieved medical record.</returns>
        /// <exception cref="NoSuchMedicalRecordException">Thrown when the medical record with the specified key does not exist.</exception>

        public async Task<MedicalRecords> GetAsync(int key)
        {
            var medicalRecords = await GetAsync();
            var medicalRecord = medicalRecords.FirstOrDefault(e => e.RecordId == key);
            if (medicalRecord != null)
            {
                return medicalRecord;
            }
            throw new NoSuchMedicalRecordException();
        }

        /// <summary>
        /// Updates the information of a medical record in the database.
        /// </summary>
        /// <param name="item">The medical record object with updated information.</param>
        /// <returns>The updated medical record.</returns>

        public async Task<MedicalRecords> Update(MedicalRecords item)
        {
            var medicalRecords = await GetAsync(item.RecordId);
            _context.Entry<MedicalRecords>(item).State = EntityState.Modified;
            _context.SaveChanges();
            _logger.LogInformation("MedicalRecords updated " + item.RecordId);
            return medicalRecords;
        }
    }
}
