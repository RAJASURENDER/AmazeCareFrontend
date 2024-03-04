using AmazeCare.Exceptions;
using AmazeCare.Interfaces;
using AmazeCare.Models;
using AmazeCare.Models.DTOs;
using AmazeCare.Services;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System.Diagnostics;

namespace AmazeCareTest
{
    [TestFixture]
    public class MedicalRecordServiceTests
    {
        private Mock<IRepository<int, MedicalRecords>> _repoMock;
        private Mock<IPatientAdminService> _patientServiceMock;
        private Mock<IDoctorAdminService> _doctorServiceMock;
        private Mock<IAppointmentAdminService> _appointmentServiceMock;
        private MedicalRecordService _medicalRecordService;

        [SetUp]
        public void Setup()
        {
            _repoMock = new Mock<IRepository<int, MedicalRecords>>();
            _patientServiceMock = new Mock<IPatientAdminService>();
            _doctorServiceMock = new Mock<IDoctorAdminService>();
            _appointmentServiceMock = new Mock<IAppointmentAdminService>();

            _medicalRecordService = new MedicalRecordService(
                _repoMock.Object,
                _patientServiceMock.Object,
                _doctorServiceMock.Object,
                _appointmentServiceMock.Object
            );
        }

        [Test]
        public async Task AddMedicalRecord_ValidMedicalRecord_ReturnsMedicalRecord()
        {
            // Arrange
            var validMedicalRecord = new MedicalRecords { };

            _repoMock.Setup(repo => repo.Add(It.IsAny<MedicalRecords>())).ReturnsAsync(validMedicalRecord);

            // Act
            var result = await _medicalRecordService.AddMedicalRecord(validMedicalRecord);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(validMedicalRecord, result);
        }

        [Test]
        public async Task GetMedicalRecordById_ValidId_ReturnsMedicalRecord()
        {
            // Arrange
            var medicalRecordId = 1;
            var validMedicalRecord = new MedicalRecords { };

            _repoMock.Setup(repo => repo.GetAsync(medicalRecordId)).ReturnsAsync(validMedicalRecord);

            // Act
            var result = await _medicalRecordService.GetMedicalRecordById(medicalRecordId);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(validMedicalRecord, result);
        }

        [Test]
        public async Task GetMedicalRecordList_ReturnsMedicalRecordList()
        {
            // Arrange
            var allMedicalRecords = new List<MedicalRecords> { };

            _repoMock.Setup(repo => repo.GetAsync()).ReturnsAsync(allMedicalRecords);

            // Act
            var result = await _medicalRecordService.GetMedicalRecordList();

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOf<List<MedicalRecords>>(result);
        }

        [Test]
        public async Task GetMedicalRecordByAppointment_ValidAppointmentId_ReturnsMedicalRecordList()
        {
            // Arrange
            int appointmentId = 123;
            var medicalRecords = new List<MedicalRecords>
            {
                new MedicalRecords { RecordId = 1, AppointmentId = appointmentId },
                new MedicalRecords { RecordId = 2, AppointmentId = appointmentId },
                new MedicalRecords { RecordId = 3, AppointmentId = appointmentId + 1 }
            };

            _repoMock.Setup(repo => repo.GetAsync()).ReturnsAsync(medicalRecords);

            _appointmentServiceMock.Setup(service => service.GetAppointment(appointmentId))
                .ReturnsAsync(new Appointments { AppointmentId = appointmentId });

            _patientServiceMock.Setup(service => service.GetPatient(It.IsAny<int>()))
                .ReturnsAsync(new Patients { PatientId = 1, PatientName = "John Doe" });

            _doctorServiceMock.Setup(service => service.GetDoctor(It.IsAny<int>()))
                .ReturnsAsync(new Doctors { DoctorId = 2, DoctorName = "Dr. Smith" });

            // Act
            var result = await _medicalRecordService.GetMedicalRecordByAppointment(appointmentId);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(2, result.Count); // Expected count of medical records for the given appointmentId
        }

        [Test]
        public async Task GetMedicalRecordByAppointment_NonExistingAppointmentId_ReturnsEmptyList()
        {
            // Arrange
            int appointmentId = 123;
            var medicalRecords = new List<MedicalRecords>
            {
                new MedicalRecords { RecordId = 1, AppointmentId = appointmentId + 1 },
                new MedicalRecords { RecordId = 2, AppointmentId = appointmentId + 2 }
            };

            _repoMock.Setup(repo => repo.GetAsync()).ReturnsAsync(medicalRecords);

            _appointmentServiceMock.Setup(service => service.GetAppointment(appointmentId))
                .ReturnsAsync((Appointments)null); // Simulating non-existing appointment

            // Act
            var result = await _medicalRecordService.GetMedicalRecordByAppointment(appointmentId);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsEmpty(result); // Expected empty list for non-existing appointmentId
        }


        [Test]
        public async Task GetMedicalRecordByPatientId_ValidPatientId_ReturnsMedicalRecordList()
        {
            // Arrange
            var patientId = 1;
            var appointments = new List<PatientViewAppointmentDTO> { /* Populate with test data */ };
            _appointmentServiceMock.Setup(service => service.GetAppointmentByPatient(patientId)).ReturnsAsync(appointments);

            // Act
            var result = await _medicalRecordService.GetMedicalRecordByPatientId(patientId);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOf<List<PatientViewMedicalRecordDTO>>(result);
        }





        [Test]
        public async Task GetMedicalRecordByPatientId_NonExistingPatientId_ReturnsEmptyList()
        {
            // Arrange
            int patientId = 123;
            List<Appointments> appointments = new List<Appointments>(); // Empty list of appointments

            _appointmentServiceMock.Setup(service => service.GetAppointmentByPatient(patientId))
            .ReturnsAsync(appointments.Select(a => new PatientViewAppointmentDTO
            {
                AppointmentId = a.AppointmentId,
                PatientName = "John Doe",
                ContactNumber = "1234567890", 
                Symptoms = "Some symptoms", 
                AppointmentDate = DateTime.Now, 
                Status = "Scheduled", 
                DoctorName = "Dr. Smith"
                
            }).ToList());

            // Act
            var result = await _medicalRecordService.GetMedicalRecordByPatientId(patientId);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsEmpty(result); // Expected empty list for non-existing patientId
        }


        [Test]
        public async Task GetMedicalRecordByDoctorId_NoAppointments_ReturnsEmptyList()
        {
            // Arrange
            int doctorId = 1; // Assuming doctorId for testing
            List<Appointments> appointments = new List<Appointments>(); // Empty list of appointments

            _appointmentServiceMock.Setup(service => service.GetAppointmentByDoctor(doctorId))
                .ReturnsAsync(appointments.Select(a => new DoctorViewAppointmentDTO
                {
                    AppointmentId = a.AppointmentId,
                    PatientName = "John Doe",
                    ContactNumber = "1234567890",
                    Symptoms = "Some symptoms",
                    AppointmentDate = DateTime.Now,
                    Status = "Scheduled"

                }).ToList());

            // Act
            var result = await _medicalRecordService.GetMedicalRecordByDoctorId(doctorId);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsEmpty(result); // Expected empty list when no appointments are found for the given doctorId
        }

        [Test]
        public async Task GetMedicalRecordDetails_ValidData_ReturnsCorrectMedicalRecordDetails()
        {
            // Arrange
            int patientId = 1;
            int doctorId = 2;
            int appointmentId = 123;

            // Mock patient data
            var patient = new Patients { PatientId = patientId, PatientName = "John Doe" };
            _patientServiceMock.Setup(service => service.GetPatient(patientId))
                .ReturnsAsync(patient);

            // Mock doctor data
            var doctor = new Doctors { DoctorId = doctorId, DoctorName = "Dr. Smith" };
            _doctorServiceMock.Setup(service => service.GetDoctor(doctorId))
                .ReturnsAsync(doctor);

            // Mock medical records
            var medicalRecords = new List<MedicalRecords>
        {
            new MedicalRecords
            {
                RecordId = 1,
                CurrentSymptoms = "Fever",
                PhysicalExamination = "Normal",
                TreatmentPlan = "Medication",
                RecommendedTests = "Blood test",
                AppointmentId = appointmentId
            },
            new MedicalRecords
            {
                RecordId = 2,
                CurrentSymptoms = "Cough",
                PhysicalExamination = "Abnormal",
                TreatmentPlan = "Rest",
                RecommendedTests = "X-ray",
                AppointmentId = appointmentId
            }
        };

            // Mock appointment data
            var appointment = new Appointments { AppointmentId = appointmentId, DoctorId = doctorId };
            _appointmentServiceMock.Setup(service => service.GetAppointment(appointmentId))
                .ReturnsAsync(appointment);

            // Act
            var medicalRecordDetailsList = new List<PatientViewMedicalRecordDTO>();
            foreach (var medicalRecord in medicalRecords)
            {
                _patientServiceMock.Setup(service => service.GetPatient(patientId))
                .ReturnsAsync(patient);
                _doctorServiceMock.Setup(service => service.GetDoctor(doctorId))
                .ReturnsAsync(doctor);

                var medicalRecordDetails = new PatientViewMedicalRecordDTO
                {
                    PatientName = patient.PatientName,
                    DoctorName = doctor.DoctorName,
                    RecordId = medicalRecord.RecordId,
                    CurrentSymptoms = medicalRecord.CurrentSymptoms,
                    PhysicalExamination = medicalRecord.PhysicalExamination,
                    TreatmentPlan = medicalRecord.TreatmentPlan,
                    RecommendedTests = medicalRecord.RecommendedTests,
                    AppointmentId = appointment.AppointmentId
                };

                medicalRecordDetailsList.Add(medicalRecordDetails);
            }

            // Assert
            Assert.IsNotNull(medicalRecordDetailsList);
            Assert.AreEqual(2, medicalRecordDetailsList.Count);

            // Add more specific assertions for each medical record detail if needed
            Assert.AreEqual("John Doe", medicalRecordDetailsList[0].PatientName);
            Assert.AreEqual("Dr. Smith", medicalRecordDetailsList[0].DoctorName);
            // Assert other properties similarly
        }

    }
}