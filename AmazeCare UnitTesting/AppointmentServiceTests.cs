using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Threading.Tasks;
using AmazeCare.Exceptions;
using AmazeCare.Interfaces;
using AmazeCare.Models;
using AmazeCare.Models.DTOs;
using AmazeCare.Services;
using Moq;
using NUnit.Framework;

namespace AmazeCare.Tests.Services
{
    [TestFixture]
    public class AppointmentServiceTests
    {
        private Mock<IRepository<int, Appointments>> _repoMock;
        private Mock<IPatientAdminService> _patientServiceMock;
        private Mock<IDoctorAdminService> _doctorServiceMock;

        private AppointmentService _appointmentService;

        [SetUp]
        public void Setup()
        {
            _repoMock = new Mock<IRepository<int, Appointments>>();
            _patientServiceMock = new Mock<IPatientAdminService>();
            _doctorServiceMock = new Mock<IDoctorAdminService>();

            _appointmentService = new AppointmentService(_repoMock.Object, _patientServiceMock.Object, _doctorServiceMock.Object);
        }

        [Test]
        public async Task AddAppointment_ValidAppointment_ReturnsAppointment()
        {
            // Arrange
            var validAppointment = new Appointments {
                AppointmentId = 1,
                DoctorId = 101,
                PatientId = 201,
                AppointmentDate = DateTime.Now.AddDays(3),
                SymptomsDescription = "Fever and Headache",
                Status = "Scheduled",
                NatureOfVisit = "Follow-up"
            };

            _repoMock.Setup(repo => repo.GetAsync()).ReturnsAsync(new List<Appointments>());
            _repoMock.Setup(repo => repo.Add(It.IsAny<Appointments>())).ReturnsAsync(validAppointment);

            // Act
            var result = await _appointmentService.AddAppointment(validAppointment);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(validAppointment, result);
        }

        [Test]
        public void AddAppointment_InvalidAppointmentDateTime_ThrowsException()
        {
            // Arrange
            var invalidAppointment = new Appointments { AppointmentDate = DateTime.Now.AddDays(-1) };

            // Act & Assert
            Assert.ThrowsAsync<InvalidAppointmentDateTimeException>(() => _appointmentService.AddAppointment(invalidAppointment));
        }

        [Test]
        public void AddAppointment_ConflictingAppointments_ThrowsException()
        {
            // Arrange
            var existingAppointments = new List<Appointments>
            {
                new Appointments { DoctorId = 1, AppointmentDate = DateTime.Now.AddMinutes(2) }
            };

            var conflictingAppointment = new Appointments { DoctorId = 1, AppointmentDate = DateTime.Now.AddMinutes(4) };

            _repoMock.Setup(repo => repo.GetAsync()).ReturnsAsync(existingAppointments);

            // Act & Assert
            Assert.ThrowsAsync<ConflictingAppointmentsException>(() => _appointmentService.AddAppointment(conflictingAppointment));
        }

        [Test]
        public async Task DeleteAppointment_ValidId_ReturnsAppointment()
        {
            // Arrange
            var appointmentIdToDelete = 1;
            var deletedAppointment = new Appointments { AppointmentId = appointmentIdToDelete };

            _repoMock.Setup(repo => repo.Delete(appointmentIdToDelete)).ReturnsAsync(deletedAppointment);

            // Act
            var result = await _appointmentService.DeleteAppointment(appointmentIdToDelete);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(deletedAppointment, result);
        }

        // Add more tests for other methods as needed

        [Test]
        public async Task UpdateAppointmentDoctor_ValidData_ReturnsUpdatedAppointment()
        {
            // Arrange
            var appointmentIdToUpdate = 1;
            var doctorId = 101;
            var existingAppointment = new Appointments { AppointmentId = appointmentIdToUpdate };

            _repoMock.Setup(repo => repo.GetAsync(appointmentIdToUpdate)).ReturnsAsync(existingAppointment);
            _repoMock.Setup(repo => repo.Update(It.IsAny<Appointments>())).ReturnsAsync(existingAppointment);

            // Act
            var result = await _appointmentService.UpdateAppointmentDoctor(appointmentIdToUpdate, doctorId);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(doctorId, result.DoctorId);
        }

        [Test]
        public async Task UpdateAppointmentPatient_ValidData_ReturnsUpdatedAppointment()
        {
            // Arrange
            var appointmentIdToUpdate = 1;
            var patientId = 201;
            var existingAppointment = new Appointments { AppointmentId = appointmentIdToUpdate };

            _repoMock.Setup(repo => repo.GetAsync(appointmentIdToUpdate)).ReturnsAsync(existingAppointment);
            _repoMock.Setup(repo => repo.Update(It.IsAny<Appointments>())).ReturnsAsync(existingAppointment);

            // Act
            var result = await _appointmentService.UpdateAppointmentPatient(appointmentIdToUpdate, patientId);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(patientId, result.PatientId);
        }

        [Test]
        public async Task UpdateAppointmentDate_ValidData_ReturnsUpdatedAppointment()
        {
            // Arrange
            var appointmentIdToUpdate = 1;
            var newAppointmentDate = DateTime.Now.AddDays(1);
            var existingAppointment = new Appointments { AppointmentId = appointmentIdToUpdate };

            _repoMock.Setup(repo => repo.GetAsync(appointmentIdToUpdate)).ReturnsAsync(existingAppointment);
            _repoMock.Setup(repo => repo.Update(It.IsAny<Appointments>())).ReturnsAsync(existingAppointment);

            // Act
            var result = await _appointmentService.UpdateAppointmentDate(appointmentIdToUpdate, newAppointmentDate);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(newAppointmentDate, result.AppointmentDate);
        }

        [Test]
        public async Task GetAppointmentByDoctor_ValidDoctorId_ReturnsDoctorViewAppointmentDTOList()
        {
            // Arrange
            var doctorId = 101;
            var appointments = new List<Appointments> { /* Populate with test data */ };

            _repoMock.Setup(repo => repo.GetAsync()).ReturnsAsync(appointments);
            _patientServiceMock.Setup(service => service.GetPatient(It.IsAny<int>())).ReturnsAsync(new Patients()); // Mock patient service

            // Act
            var result = await _appointmentService.GetAppointmentByDoctor(doctorId);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOf<List<DoctorViewAppointmentDTO>>(result);
        }

        [Test]
        public async Task GetAppointmentByPatient_ValidPatientId_ReturnsPatientViewAppointmentDTOList()
        {
            // Arrange
            var patientId = 201;
            var appointments = new List<Appointments> { /* Populate with test data */ };

            _repoMock.Setup(repo => repo.GetAsync()).ReturnsAsync(appointments);
            _patientServiceMock.Setup(service => service.GetPatient(It.IsAny<int>())).ReturnsAsync(new Patients()); // Mock patient service
            _doctorServiceMock.Setup(service => service.GetDoctor(It.IsAny<int>())).ReturnsAsync(new Doctors()); // Mock doctor service

            // Act
            var result = await _appointmentService.GetAppointmentByPatient(patientId);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOf<List<PatientViewAppointmentDTO>>(result);
        }

        [Test]
        public async Task GetUpcomingAppointments_ReturnsUpcomingAppointments()
        {
            // Arrange
            var currentDate = DateTime.Now;
            var upcomingAppointments = new List<Appointments> { /* Populate with test data */ };

            _repoMock.Setup(repo => repo.GetAsync()).ReturnsAsync(upcomingAppointments);

            // Act
            var result = await _appointmentService.GetUpcomingAppointments();

            // Assert
            Assert.IsNotNull(result);
            CollectionAssert.AreEqual(upcomingAppointments, result);
        }

        [Test]
        public async Task UpdateAppointmentStatus_ValidData_ReturnsUpdatedAppointment()
        {
            // Arrange
            var appointmentIdToUpdate = 1;
            var newStatus = "Completed";
            var existingAppointment = new Appointments { AppointmentId = appointmentIdToUpdate };

            _repoMock.Setup(repo => repo.GetAsync(appointmentIdToUpdate)).ReturnsAsync(existingAppointment);
            _repoMock.Setup(repo => repo.Update(It.IsAny<Appointments>())).ReturnsAsync(existingAppointment);

            // Act
            var result = await _appointmentService.UpdateAppointmentStatus(appointmentIdToUpdate, newStatus);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(newStatus, result.Status);
        }

        [Test]
        public async Task CancelAppointment_ValidAppointmentId_ReturnsCancelledAppointment()
        {
            // Arrange
            var appointmentIdToCancel = 1;
            var existingAppointment = new Appointments { AppointmentId = appointmentIdToCancel };

            _repoMock.Setup(repo => repo.GetAsync(appointmentIdToCancel)).ReturnsAsync(existingAppointment);
            _repoMock.Setup(repo => repo.Update(It.IsAny<Appointments>())).ReturnsAsync(existingAppointment);

            // Act
            var result = await _appointmentService.CancelAppointment(appointmentIdToCancel);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual("Cancelled", result.Status);
        }

        [Test]
        public async Task RescheduleAppointment_ValidAppointmentId_ReturnsRescheduledAppointment()
        {
            // Arrange
            var appointmentIdToReschedule = 1;
            var existingAppointment = new Appointments { AppointmentId = appointmentIdToReschedule };

            _repoMock.Setup(repo => repo.GetAsync(appointmentIdToReschedule)).ReturnsAsync(existingAppointment);
            _repoMock.Setup(repo => repo.Update(It.IsAny<Appointments>())).ReturnsAsync(existingAppointment);

            // Act
            var result = await _appointmentService.RescheduleAppointment(appointmentIdToReschedule);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual("Rescheduled", result.Status);
        }

        [Test]
        public async Task CompleteAppointment_ValidAppointmentId_ReturnsCompletedAppointment()
        {
            // Arrange
            var appointmentIdToComplete = 1;
            var existingAppointment = new Appointments { AppointmentId = appointmentIdToComplete };

            _repoMock.Setup(repo => repo.GetAsync(appointmentIdToComplete)).ReturnsAsync(existingAppointment);
            _repoMock.Setup(repo => repo.Update(It.IsAny<Appointments>())).ReturnsAsync(existingAppointment);

            // Act
            var result = await _appointmentService.CompleteAppointment(appointmentIdToComplete);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual("Completed", result.Status);
        }
    }
}
