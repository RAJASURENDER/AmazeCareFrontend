using AmazeCare.Exceptions;
using AmazeCare.Interfaces;
using AmazeCare.Models;
using AmazeCare.Models.DTOs;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AmazeCare.Services.Tests
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
            var appointmentId = 1;
            var allMedicalRecords = new List<MedicalRecords> { };

            _repoMock.Setup(repo => repo.GetAsync()).ReturnsAsync(allMedicalRecords);
            _appointmentServiceMock.Setup(service => service.GetAppointment(appointmentId)).ReturnsAsync(new Appointments { /* Populate with test data */ });

            // Act
            var result = await _medicalRecordService.GetMedicalRecordByAppointment(appointmentId);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOf<List<PatientViewMedicalRecordDTO>>(result);
        }



    }
}

