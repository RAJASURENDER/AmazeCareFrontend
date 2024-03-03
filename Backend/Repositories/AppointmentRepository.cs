using AmazeCare.Contexts;
using AmazeCare.Exceptions;
using AmazeCare.Interfaces;
using AmazeCare.Models;
using Microsoft.EntityFrameworkCore;

namespace AmazeCare.Repositories
{
    public class AppointmentRepository : IRepository<int, Appointments>
    {
        RequestTrackerContext _context;
        private readonly ILogger<AppointmentRepository> _logger;

        /// <summary>
        /// Initializes a new instance of the AppointmentRepository class with the specified database context.
        /// </summary>
        /// <param name="context">The database context.</param>
        /// <param name="logger">The logger instance for logging.</param>

        public AppointmentRepository(RequestTrackerContext context,
       ILogger<AppointmentRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Adds a new appointment to the database.
        /// </summary>
        /// <param name="item">The appointment to be added.</param>
        /// <returns>The added appointment.</returns>

        public async Task<Appointments> Add(Appointments item)
        {
            item.Status = "upcoming"; // Set status to "upcoming" by default
            _context.Add(item);
            _context.SaveChanges();
            _logger.LogInformation("Appointment added " + item.AppointmentId);
            return item;
        }

        /// <summary>
        /// Deletes an appointment from the database.
        /// </summary>
        /// <param name="key">The ID of the appointment to be deleted.</param>
        /// <returns>The deleted appointment.</returns>
        
        public async Task<Appointments> Delete(int key)
        {
            var appointment = await GetAsync(key);
            _context.Appointments.Remove(appointment);
            _context.SaveChanges();
            _logger.LogInformation("Appointment deleted " + key);
            return appointment;
        }

        /// <summary>
        /// Retrieves an appointment from the database by its ID.
        /// </summary>
        /// <param name="key">The ID of the appointment to retrieve.</param>
        /// <returns>The appointment with the specified ID.</returns>
        /// <exception cref="NoSuchAppointmentException">Thrown when no appointment with the specified ID is found.</exception>

        public async Task<Appointments> GetAsync(int key)
        {
            var appointments = await GetAsync();
            var appointment = appointments.FirstOrDefault(e => e.AppointmentId == key);
            if (appointment != null)
            {
                return appointment;
            }
            throw new NoSuchAppointmentException();
        }

        /// <summary>
        /// Retrieves all appointments from the database.
        /// </summary>
        /// <returns>A list of all appointments.</returns>

        public async Task<List<Appointments>> GetAsync()
        {
            var appointment = _context.Appointments.Include(e => e.Patients).
                Include(d => d.Doctors).ToList();
            return appointment;
        }

        /// <summary>
        /// Updates an existing appointment in the database.
        /// </summary>
        /// <param name="item">The updated appointment object.</param>
        /// <returns>The updated appointment object.</returns>

        public async Task<Appointments> Update(Appointments item)
        {
            var appointment = await GetAsync(item.AppointmentId);
            _context.Entry<Appointments>(item).State = EntityState.Modified;
            _context.SaveChanges();
            _logger.LogInformation("Appointment updated " + item.AppointmentId);
            return appointment;
        }
    }
}
