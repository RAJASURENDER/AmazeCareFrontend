using AmazeCare.Contexts;
using AmazeCare.Exceptions;
using AmazeCare.Interfaces;
using AmazeCare.Models;
using Microsoft.EntityFrameworkCore;
using System.Numerics;

namespace AmazeCare.Repositories
{
    public class DoctorRepository : IRepository<int, Doctors>
    {
     
        RequestTrackerContext _context;
        ILogger<DoctorRepository> _logger;

        /// <summary>
        /// Initializes a new instance of the DoctorRepository class with the specified context and logger.
        /// </summary>
        /// <param name="context">The database context.</param>
        /// <param name="logger">The logger instance.</param>

        public DoctorRepository(RequestTrackerContext context, ILogger<DoctorRepository>
       logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Adds a new doctor to the database.
        /// </summary>
        /// <param name="item">The doctor to add.</param>
        /// <returns>The added doctor.</returns>

        public async Task<Doctors> Add(Doctors item)
        {
            _context.Add(item);
            _context.SaveChanges();
            _logger.LogInformation("Doctor added " + item.DoctorId);
            return item;
        }


        /// <summary>
        /// Deletes a doctor from the database based on the specified key.
        /// </summary>
        /// <param name="key">The key of the doctor to delete.</param>
        /// <returns>The deleted doctor.</returns>

        public async Task<Doctors> Delete(int key)
        {
            var doctor = await GetAsync(key);
            _context?.Doctors.Remove(doctor);
            _context?.SaveChanges();
            _logger.LogInformation("Doctor deleted " + key);
            return doctor;
        }

        /// <summary>
        /// Retrieves a doctor from the database based on the specified key.
        /// </summary>
        /// <param name="key">The key of the doctor to retrieve.</param>
        /// <returns>The retrieved doctor.</returns>
        /// <exception cref="NoSuchDoctorException">Thrown when the doctor with the specified key does not exist.</exception>

        public async Task<Doctors> GetAsync(int key)
        {
            var doctors = await GetAsync();
            var doctor = doctors.FirstOrDefault(e => e.DoctorId == key);
            if (doctor != null)
            {
                return doctor;
            }
            throw new NoSuchDoctorException();
        }

        /// <summary>
        /// Retrieves all doctors from the database.
        /// </summary>
        /// <returns>A list of all doctors.</returns>

        public async Task<List<Doctors>> GetAsync()
        {
            var doctors = _context.Doctors.ToList();
            return doctors;
        }

        /// <summary>
        /// Updates the information of a doctor in the database.
        /// </summary>
        /// <param name="item">The doctor object with updated information.</param>
        /// <returns>The updated doctor.</returns>

        public async Task<Doctors> Update(Doctors item)
        {
            var doctor = await GetAsync(item.DoctorId);
            _context.Entry<Doctors>(item).State = EntityState.Modified;
            _context.SaveChanges();
            _logger.LogInformation("Doctor updated " + item.DoctorId);
            return doctor;
        }
    }
}
