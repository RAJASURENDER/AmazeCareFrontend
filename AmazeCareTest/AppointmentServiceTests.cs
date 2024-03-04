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

namespace AmazeCareTest
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
            var validAppointment = new Appointments
            {
                AppointmentDate = DateTime.Now.AddDays(1), // Future appointment date
                DoctorId = 1,
                // Add other necessary properties
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
        public async Task AddAppointment_InvalidAppointmentDateTime_ThrowsException()
        {
            // Arrange
            var invalidAppointment = new Appointments
            {
                AppointmentDate = DateTime.Now.AddDays(-1) 
               
            };

            // Act & Assert
            var exception = Assert.ThrowsAsync<InvalidAppointmentDateTimeException>(() => _appointmentService.AddAppointment(invalidAppointment));
            Assert.AreEqual("Invalid Appointment Date or Time", exception.Message);
        }

        [Test]
        public async Task AddAppointment_ConflictingAppointments_ThrowsException()
        {
            // Arrange
            var existingAppointments = new List<Appointments>
            {
                new Appointments { DoctorId = 1, AppointmentDate = DateTime.Now.AddMinutes(2) }
            };

            var conflictingAppointment = new Appointments { DoctorId = 1, AppointmentDate = DateTime.Now.AddMinutes(3) };

            _repoMock.Setup(repo => repo.GetAsync()).ReturnsAsync(existingAppointments);

            // Act & Assert
            var exception = Assert.ThrowsAsync<ConflictingAppointmentsException>(() => _appointmentService.AddAppointment(conflictingAppointment));
            Assert.AreEqual("Doctor has Prebooked Appointment at the given time,Please Change your Appointment Time", exception.Message);
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




        [Test]
        public async Task GetAppointment_ValidId_ReturnsAppointment()
        {
            // Arrange
            int validId = 1;
            var expectedAppointment = new Appointments(); // Set your expected appointment object

            _repoMock.Setup(repo => repo.GetAsync(validId))
                .ReturnsAsync(expectedAppointment);

            // Act
            var result = await _appointmentService.GetAppointment(validId);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(expectedAppointment, result);
        }


        [Test]
        public async Task GetAppointmentList_ReturnsListOfAppointments()
        {
            // Arrange
            var expectedAppointments = new List<Appointments>(); // Set your expected list of appointments

            _repoMock.Setup(repo => repo.GetAsync())
                .ReturnsAsync(expectedAppointments);

            // Act
            var result = await _appointmentService.GetAppointmentList();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(expectedAppointments, result);
        }

        [Test]
        public async Task GetAppointmentList_ReturnsEmptyList()
        {
            // Arrange
            _repoMock.Setup(repo => repo.GetAsync())
                .ReturnsAsync(new List<Appointments>());

            // Act
            var result = await _appointmentService.GetAppointmentList();

            // Assert
            Assert.IsNotNull(result);
            Assert.IsEmpty(result);
        }

        [Test]

        public async Task GetAppointmentByDoctor_ValidDoctorId_ReturnsAppointmentDetailsList()
        {
            // Arrange
            int validDoctorId = 1;
            var appointments = new List<Appointments>
            {
                // Create some sample appointments for the given doctorId
            };

            var expectedAppointmentDetailsList = new List<DoctorViewAppointmentDTO>
            {
                // Create expected DTO objects based on your sample data
            };

            _repoMock.Setup(repo => repo.GetAsync())
                .ReturnsAsync(appointments);

            _patientServiceMock.Setup(service => service.GetPatient(It.IsAny<int>()))
                .ReturnsAsync(new Patients()); // Set your sample patient object

            // Additional setup if needed...

            // Act
            var result = await _appointmentService.GetAppointmentByDoctor(validDoctorId);

            // Assert
            Assert.IsNotNull(result);
            CollectionAssert.AreEqual(expectedAppointmentDetailsList, result);
        }


        [Test]
        public async Task GetAppointmentByPatient_ValidPatientId_ReturnsAppointmentDetailsList()
        {
            // Arrange
            int validPatientId = 1;
            var appointments = new List<Appointments>
            {
                // Create some sample appointments for the given patientId
            };

            var expectedAppointmentDetailsList = new List<PatientViewAppointmentDTO>
            {
                // Create expected DTO objects based on your sample data
            };

            _repoMock.Setup(repo => repo.GetAsync())
                .ReturnsAsync(appointments);

            // Setup mock for _patientService
            _patientServiceMock.Setup(service => service.GetPatient(It.IsAny<int>()))
                .ReturnsAsync(new Patients()); // Set your sample patient object

            // Setup mock for _doctorService
            _doctorServiceMock.Setup(service => service.GetDoctor(It.IsAny<int>()))
                .ReturnsAsync(new Doctors()); // Set your sample doctor object

            // Act
            var result = await _appointmentService.GetAppointmentByPatient(validPatientId);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(expectedAppointmentDetailsList.Count, result.Count);

        }

        [Test]
        public async Task GetAppointmentByPatient_InvalidPatientId_ReturnsEmptyList()
        {
            // Arrange
            int invalidPatientId = -1;

            _repoMock.Setup(repo => repo.GetAsync())
                .ReturnsAsync(new List<Appointments>());

            // Act
            var result = await _appointmentService.GetAppointmentByPatient(invalidPatientId);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsEmpty(result);
        }



        [Test]
        public async Task GetAppointmentByDoctor_WithValidAppointments_ReturnsAppointmentDetailsList()
        {
            // Arrange
            int validDoctorId = 1;
            var appointments = new List<Appointments>
            {
                // Create some sample appointments for the given doctorId
            };

            var expectedAppointmentDetailsList = new List<DoctorViewAppointmentDTO>
            {
                // Create expected DTO objects based on your sample data
            };

            _repoMock.Setup(repo => repo.GetAsync())
                .ReturnsAsync(appointments);

            _patientServiceMock.Setup(service => service.GetPatient(It.IsAny<int>()))
                .ReturnsAsync(new Patients()); // Set your sample patient object

            // Act
            var result = await _appointmentService.GetAppointmentByDoctor(validDoctorId);

            // Assert
            Assert.IsNotNull(result);
            CollectionAssert.AreEqual(expectedAppointmentDetailsList, result);
        }



        [Test]
        public async Task UpdateAppointmentDoctor_AppointmentNotFound_ReturnsNull()
        {
            // Arrange
            var appointmentId = 1;
            var doctorId = 301;

            _repoMock.Setup(repo => repo.GetAsync(appointmentId)).ReturnsAsync((Appointments)null);

            // Act
            var result = await _appointmentService.UpdateAppointmentDoctor(appointmentId, doctorId);

            // Assert
            Assert.IsNull(result);
        }


        [Test]
        public async Task UpdateAppointmentDate_AppointmentNotFound_ReturnsNull()
        {
            // Arrange
            var appointmentId = 1;
            var appointmentDate = DateTime.Now.AddDays(5);

            _repoMock.Setup(repo => repo.GetAsync(appointmentId)).ReturnsAsync((Appointments)null);

            // Act
            var result = await _appointmentService.UpdateAppointmentDate(appointmentId, appointmentDate);

            // Assert
            Assert.IsNull(result);
        }

        [Test]
        public async Task UpdateAppointmentDate_InvalidAppointmentDate_ReturnsNull()
        {
            // Arrange
            var appointmentId = 1;
            var appointmentDate = DateTime.Now.AddDays(-1); // Setting an invalid date

            var existingAppointment = new Appointments
            {
                AppointmentId = appointmentId,
                DoctorId = 101,
                PatientId = 201,
                AppointmentDate = DateTime.Now.AddDays(3),
                SymptomsDescription = "Fever and Headache",
                Status = "Scheduled",
                NatureOfVisit = "Follow-up"
            };

            _repoMock.Setup(repo => repo.GetAsync(appointmentId)).ReturnsAsync(existingAppointment);

            // Act
            var result = await _appointmentService.UpdateAppointmentDate(appointmentId, appointmentDate);

            // Assert
            Assert.IsNull(result);
        }

        [Test]
        public async Task UpdateAppointmentStatus_AppointmentNotFound_ReturnsNull()
        {
            // Arrange
            var appointmentId = 1;
            var status = "InProgress";

            _repoMock.Setup(repo => repo.GetAsync(appointmentId)).ReturnsAsync((Appointments)null);

            // Act
            var result = await _appointmentService.UpdateAppointmentStatus(appointmentId, status);

            // Assert
            Assert.IsNull(result);
        }

        [Test]
        public async Task CancelAppointment_AppointmentNotFound_ReturnsNull()
        {
            // Arrange
            var appointmentId = 1;

            _repoMock.Setup(repo => repo.GetAsync(appointmentId)).ReturnsAsync((Appointments)null);

            // Act
            var result = await _appointmentService.CancelAppointment(appointmentId);

            // Assert
            Assert.IsNull(result);
        }

        [Test]
        public async Task RescheduleAppointment_AppointmentNotFound_ReturnsNull()
        {
            // Arrange
            var appointmentId = 1;

            _repoMock.Setup(repo => repo.GetAsync(appointmentId)).ReturnsAsync((Appointments)null);

            // Act
            var result = await _appointmentService.RescheduleAppointment(appointmentId);

            // Assert
            Assert.IsNull(result);
        }

        [Test]
        public async Task CompleteAppointment_AppointmentNotFound_ReturnsNull()
        {
            // Arrange
            var appointmentId = 1;

            _repoMock.Setup(repo => repo.GetAsync(appointmentId)).ReturnsAsync((Appointments)null);

            // Act
            var result = await _appointmentService.CompleteAppointment(appointmentId);

            // Assert
            Assert.IsNull(result);
        }


        [Test]
        public async Task UpdateAppointmentPatient_AppointmentNotFound_ReturnsNull()
        {
            // Arrange
            var appointmentId = 1;
            var patientId = 301;

            _repoMock.Setup(repo => repo.GetAsync(appointmentId)).ReturnsAsync((Appointments)null);

            // Act
            var result = await _appointmentService.UpdateAppointmentPatient(appointmentId, patientId);

            // Assert
            Assert.IsNull(result);
        }


        [Test]
        public async Task GetUpcomingAppointments_ReturnsOnlyUpcomingAndRescheduledAppointments()
        {
            // Arrange
            var currentDate = DateTime.Now;
            var upcomingAppointments = new List<Appointments>
            {
                new Appointments { AppointmentDate = currentDate.AddDays(1), Status = "Upcoming" },
                new Appointments { AppointmentDate = currentDate.AddDays(2), Status = "RESCHEDULED" },
                new Appointments { AppointmentDate = currentDate.AddDays(3), Status = "Scheduled" },
                new Appointments { AppointmentDate = currentDate.AddDays(-1), Status = "Completed" }
            };
            _repoMock.Setup(repo => repo.GetAsync()).ReturnsAsync(upcomingAppointments);

            // Act
            var result = await _appointmentService.GetUpcomingAppointments();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(2, result.Count); // Only upcoming and rescheduled appointments should be returned
            Assert.IsTrue(result.All(appointment => appointment.AppointmentDate > currentDate));
            Assert.IsTrue(result.All(appointment => appointment.Status == "Upcoming" || appointment.Status == "RESCHEDULED"));
        }





        [Test]
        public async Task GetAppointmentByDoctor_ReturnsDoctorViewAppointmentDTOList()
        {
            // Arrange
            var doctorId = 101;

            var appointmentsList = new List<Appointments>
        {
            new Appointments
            {
                AppointmentId = 1,
                DoctorId = doctorId,
                PatientId = 201,
                AppointmentDate = DateTime.Now.AddDays(3),
                SymptomsDescription = "Fever and Headache",
                Status = "Scheduled",
                NatureOfVisit = "Follow-up"
            },
            // Add more appointments as needed
        };

            var patient = new Patients
            {
                PatientId = 201,
                PatientName = "John Doe",
                ContactNumber = "1234567890"
                // Add other patient properties as needed
            };

            _repoMock.Setup(repo => repo.GetAsync()).ReturnsAsync(appointmentsList);
            _patientServiceMock.Setup(service => service.GetPatient(It.IsAny<int>())).ReturnsAsync(patient);

            // Act
            var result = await _appointmentService.GetAppointmentByDoctor(doctorId);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOf<List<DoctorViewAppointmentDTO>>(result);
            Assert.AreEqual(appointmentsList.Count, result.Count);

            // Check individual appointment details
            foreach (var appointmentDetails in result)
            {
                Assert.AreEqual(patient.PatientName, appointmentDetails.PatientName);
                Assert.AreEqual(patient.ContactNumber, appointmentDetails.ContactNumber);
                // Add more assertions for other properties as needed
            }

        }


        [Test]
        public async Task GetAppointmentByPatient_ReturnsPatientViewAppointmentDTOList()
        {
            // Arrange
            var patientId = 201;

            var appointmentsList = new List<Appointments>
        {
            new Appointments
            {
                AppointmentId = 1,
                DoctorId = 101,
                PatientId = patientId,
                AppointmentDate = DateTime.Now.AddDays(3),
                SymptomsDescription = "Fever and Headache",
                Status = "Scheduled",
                NatureOfVisit = "Follow-up"
            },
            // Add more appointments as needed
        };

            var patient = new Patients
            {
                PatientId = patientId,
                PatientName = "John Doe",
                ContactNumber = "1234567890"
                // Add other patient properties as needed
            };

            var doctor = new Doctors
            {
                DoctorId = 101,
                DoctorName = "Dr. Smith"
                // Add other doctor properties as needed
            };

            _repoMock.Setup(repo => repo.GetAsync()).ReturnsAsync(appointmentsList);
            _patientServiceMock.Setup(service => service.GetPatient(It.IsAny<int>())).ReturnsAsync(patient);
            _doctorServiceMock.Setup(service => service.GetDoctor(It.IsAny<int>())).ReturnsAsync(doctor);

            // Act
            var result = await _appointmentService.GetAppointmentByPatient(patientId);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOf<List<PatientViewAppointmentDTO>>(result);
            Assert.AreEqual(appointmentsList.Count, result.Count);

            // Check individual appointment details
            foreach (var appointmentDetails in result)
            {
                Assert.AreEqual(patient.PatientName, appointmentDetails.PatientName);
                Assert.AreEqual(patient.ContactNumber, appointmentDetails.ContactNumber);
                Assert.AreEqual(doctor.DoctorName, appointmentDetails.DoctorName);
                
            }
        }
    }
}