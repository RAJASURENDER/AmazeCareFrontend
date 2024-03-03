using AmazeCare.Exceptions;
using AmazeCare.Interfaces;
using AmazeCare.Models;
using Moq;
using NUnit.Framework;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AmazeCare.Services.Tests
{
    [TestFixture]
    public class PatientServiceTests
    {
        [Test]
        public async Task AddPatient_ValidPatient_ReturnsPatient()
        {
            // Arrange
            var validPatient = new Patients {  };

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
            var existingPatient = new Patients {  };

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
            var validPatient = new Patients {  };

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
            var existingPatient = new Patients {  };

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
            var existingPatient = new Patients {  };

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
            var patients = new List<Patients> { };
            var patientWithUsername = patients.FirstOrDefault(p => p.Username == validUsername);

            var repoMock = new Mock<IRepository<int, Patients>>();
            repoMock.Setup(repo => repo.GetAsync()).ReturnsAsync(patients);

            var patientService = new PatientService(repoMock.Object);

            // Act
            var result = await patientService.GetPatientIdByUsername(validUsername);

            // Assert
            Assert.AreEqual(patientWithUsername?.PatientId ?? -1, result);
        }

    }
}

