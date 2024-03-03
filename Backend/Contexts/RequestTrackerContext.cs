using Microsoft.EntityFrameworkCore;
using AmazeCare.Models;


namespace AmazeCare.Contexts
{
    public class RequestTrackerContext : DbContext
    {

        public RequestTrackerContext(DbContextOptions options) : base(options)
        {

        }


        public DbSet<Doctors> Doctors { get; set; }

        public DbSet<Patients> Patients { get; set; }

        public DbSet<Appointments> Appointments { get; set; }
        public DbSet<MedicalRecords> MedicalRecords { get; set; }
        public DbSet<Prescriptions> Prescriptions { get; set; }

        public DbSet<User> Users { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure composite key for Appointments entity
            modelBuilder.Entity<Appointments>()
                .HasKey(a => new { a.AppointmentId });

            // Configure relationships for Appointments entity
            modelBuilder.Entity<Appointments>()
                .HasOne(a => a.Patients)
                .WithMany(p => p.Appointments)
                .HasForeignKey(a => a.PatientId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Appointments>()
                .HasOne(a => a.Doctors)
                .WithMany(d => d.Appointments)
                .HasForeignKey(a => a.DoctorId)
                .OnDelete(DeleteBehavior.NoAction);
        }

    }
}
