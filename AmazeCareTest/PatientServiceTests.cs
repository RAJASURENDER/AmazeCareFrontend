using AmazeCare.Exceptions;
using AmazeCare.Interfaces;
using AmazeCare.Models;
using AmazeCare.Services;
using Moq;
using NUnit.Framework;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AmazeCareTest
{
    [TestFixture]
    public class PatientServiceTests
    {
        [Test]
        public async Task AddPatient_ValidPatient_ReturnsPatient()
        {
            // Arrange
            var validPatient = new Patients { };

            var repoMock = new Mock<IRepository<int, Patients>>();
            repoMock.Setup(repo => repo.Add(It.IsAny<Patients>())).ReturnsAsync(validPatient);

            var patientService = new PatientService(repoMock.Object);

            // Act
            var result = await patientService.AddPatient(validPatient);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(validPatient, result);
        }

        [Test]
        public async Task DeletePatient_ExistingPatientId_ReturnsDeletedPatient()
        {
            // Arrange
            var existingPatientId = 1;
            var existingPatient = new Patients { };

            var repoMock = new Mock<IRepository<int, Patients>>();
            repoMock.Setup(repo => repo.GetAsync(existingPatientId)).ReturnsAsync(existingPatient);
            repoMock.Setup(repo => repo.Delete(existingPatientId)).ReturnsAsync(existingPatient);

            var patientService = new PatientService(repoMock.Object);

            // Act
            var result = await patientService.DeletePatient(existingPatientId);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(existingPatient, result);
        }

        [Test]
        public async Task DeletePatient_NonExistingPatientId_ThrowsNoSuchPatientException()
        {
            // Arrange
            var nonExistingPatientId = 99;

            var repoMock = new Mock<IRepository<int, Patients>>();
            repoMock.Setup(repo => repo.GetAsync(nonExistingPatientId)).ReturnsAsync((Patients)null);

            var patientService = new PatientService(repoMock.Object);

            // Act & Assert
            Assert.ThrowsAsync<NoSuchPatientException>(() => patientService.DeletePatient(nonExistingPatientId));
        }

        [Test]
        public async Task GetPatient_ValidPatientId_ReturnsPatient()
        {
            // Arrange
            var validPatientId = 1;
            var validPatient = new Patients { };

            var repoMock = new Mock<IRepository<int, Patients>>();
            repoMock.Setup(repo => repo.GetAsync(validPatientId)).ReturnsAsync(validPatient);

            var patientService = new PatientService(repoMock.Object);

            // Act
            var result = await patientService.GetPatient(validPatientId);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(validPatient, result);
        }


        [Test]
        public async Task GetPatientList_ReturnsListOfPatients()
        {
            // Arrange
            var allPatients = new List<Patients> { };

            var repoMock = new Mock<IRepository<int, Patients>>();
            repoMock.Setup(repo => repo.GetAsync()).ReturnsAsync(allPatients);

            var patientService = new PatientService(repoMock.Object);

            // Act
            var result = await patientService.GetPatientList();

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOf<List<Patients>>(result);
            CollectionAssert.AreEqual(allPatients, result);
        }

        [Test]
        public async Task UpdatePatientAge_ExistingPatientId_ReturnsUpdatedPatient()
        {
            // Arrange
            var existingPatientId = 1;
            var existingPatient = new Patients { };

            var repoMock = new Mock<IRepository<int, Patients>>();
            repoMock.Setup(repo => repo.GetAsync(existingPatientId)).ReturnsAsync(existingPatient);

            var patientService = new PatientService(repoMock.Object);

            // Act
            var result = await patientService.UpdatePatientAge(existingPatientId, 30);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(30, result.Age);
        }

        [Test]
        public async Task UpdatePatientMobile_ExistingPatientId_ReturnsUpdatedPatient()
        {
            // Arrange
            var existingPatientId = 1;
            var existingPatient = new Patients { };

            var repoMock = new Mock<IRepository<int, Patients>>();
            repoMock.Setup(repo => repo.GetAsync(existingPatientId)).ReturnsAsync(existingPatient);

            var patientService = new PatientService(repoMock.Object);

            // Act
            var result = await patientService.UpdatePatientMobile(existingPatientId, "1234567890");

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual("1234567890", result.ContactNumber);
        }
        [Test]
        public async Task UpdatePatientMobile_PatientNotFound_ReturnsNull()
        {
            // Arrange
            int id = 1;
            string newMobile = "1234567890";
            var _repositoryMock = new Mock<IRepository<int, Patients>>();
            _repositoryMock.Setup(repo => repo.GetAsync(id)).ReturnsAsync((Patients)null);

            var _service = new PatientService(_repositoryMock.Object);

            // Act
            var result = await _service.UpdatePatientMobile(id, newMobile);

            // Assert
            Assert.IsNull(result);
        }


        [Test]
        public async Task UpdatePatientAge_PatientNotFound_ReturnsNull()
        {
            int id = 1;
            int newAge = 30;
            var _repositoryMock = new Mock<IRepository<int, Patients>>();
            _repositoryMock.Setup(repo => repo.GetAsync(id)).ReturnsAsync((Patients)null);

            var _service = new PatientService(_repositoryMock.Object);

            // Act
            var result = await _service.UpdatePatientAge(id, newAge);

            // Assert
            Assert.IsNull(result);
        }

        [Test]
        public async Task UpdatePatient_ExistingPatient_ReturnsUpdatedPatient()
        {
            // Arrange
            var existingPatient = new Patients { };

            var repoMock = new Mock<IRepository<int, Patients>>();
            repoMock.Setup(repo => repo.GetAsync(existingPatient.PatientId)).ReturnsAsync(existingPatient);
            repoMock.Setup(repo => repo.Update(existingPatient)).ReturnsAsync(existingPatient);

            var patientService = new PatientService(repoMock.Object);

            // Act
            var result = await patientService.UpdatePatient(existingPatient);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(existingPatient, result);
        }

        [Test]
        public async Task UpdatePatient_NonExistingPatient_ThrowsNoSuchPatientException()
        {
            // Arrange
            var nonExistingPatient = new Patients { };

            var repoMock = new Mock<IRepository<int, Patients>>();
            repoMock.Setup(repo => repo.GetAsync(nonExistingPatient.PatientId)).ReturnsAsync((Patients)null);

            var patientService = new PatientService(repoMock.Object);

            // Act & Assert
            Assert.ThrowsAsync<NoSuchPatientException>(() => patientService.UpdatePatient(nonExistingPatient));
        }

        [Test]
        public async Task GetPatientIdByUsername_ValidUsername_ReturnsPatientId()
        {
            // Arrange
            var validUsername = "testuser";
            var patients = new List<Patients>
            {
                new Patients { PatientId = 1, Username = "testuser1" },
                new Patients { PatientId = 2, Username = "testuser2" },
                new Patients { PatientId = 3, Username = validUsername }
            };

            var repositoryMock = new Mock<IRepository<int, Patients>>();
            repositoryMock.Setup(repo => repo.GetAsync()).ReturnsAsync(patients);

            var service = new PatientService(repositoryMock.Object);

            // Act
            var result = await service.GetPatientIdByUsername(validUsername);

            // Assert
            Assert.AreEqual(3, result);
        }

        [Test]
        public async Task GetPatientIdByUsername_NonExistingUsername_ReturnsMinusOne()
        {
            // Arrange
            var nonExistingUsername = "nonexistinguser";
            var patients = new List<Patients>
            {
                new Patients { PatientId = 1, Username = "testuser1" },
                new Patients { PatientId = 2, Username = "testuser2" },
                new Patients { PatientId = 3, Username = "testuser3" }
            };

            var repositoryMock = new Mock<IRepository<int, Patients>>();
            repositoryMock.Setup(repo => repo.GetAsync()).ReturnsAsync(patients);

            var service = new PatientService(repositoryMock.Object);

            // Act
            var result = await service.GetPatientIdByUsername(nonExistingUsername);

            // Assert
            Assert.AreEqual(-1, result);
        }

    }
}