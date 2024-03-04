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
    public class PrescriptionServiceTests
    {
        [Test]
        public async Task AddPrescription_ValidPrescription_ReturnsPrescription()
        {
            // Arrange
            var validPrescription = new Prescriptions { };

            var repoMock = new Mock<IRepository<int, Prescriptions>>();
            repoMock.Setup(repo => repo.Add(It.IsAny<Prescriptions>())).ReturnsAsync(validPrescription);

            var prescriptionService = new PrescriptionService(repoMock.Object, null);

            // Act
            var result = await prescriptionService.AddPrescription(validPrescription);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(validPrescription, result);
        }

        [Test]
        public async Task GetPrescriptionList_ReturnsListOfPrescriptions()
        {
            // Arrange
            var allPrescriptions = new List<Prescriptions> { };

            var repoMock = new Mock<IRepository<int, Prescriptions>>();
            repoMock.Setup(repo => repo.GetAsync()).ReturnsAsync(allPrescriptions);

            var prescriptionService = new PrescriptionService(repoMock.Object, null);

            // Act
            var result = await prescriptionService.GetPrescriptionList();

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOf<List<Prescriptions>>(result);
            CollectionAssert.AreEqual(allPrescriptions, result);
        }

        [Test]
        public async Task GetPrescriptionById_ValidPrescriptionId_ReturnsPrescription()
        {
            // Arrange
            var validPrescriptionId = 1;
            var validPrescription = new Prescriptions { };

            var repoMock = new Mock<IRepository<int, Prescriptions>>();
            repoMock.Setup(repo => repo.GetAsync(validPrescriptionId)).ReturnsAsync(validPrescription);

            var prescriptionService = new PrescriptionService(repoMock.Object, null);

            // Act
            var result = await prescriptionService.GetPrescriptionById(validPrescriptionId);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(validPrescription, result);
        }

        [Test]
        public async Task UpdatePrescription_ExistingPrescription_ReturnsUpdatedPrescription()
        {
            // Arrange
            var existingPrescription = new Prescriptions { };

            var repoMock = new Mock<IRepository<int, Prescriptions>>();
            repoMock.Setup(repo => repo.GetAsync(existingPrescription.PrescriptionId)).ReturnsAsync(existingPrescription);
            repoMock.Setup(repo => repo.Update(existingPrescription)).ReturnsAsync(existingPrescription);

            var prescriptionService = new PrescriptionService(repoMock.Object, null);

            // Act
            var result = await prescriptionService.UpdatePrescription(existingPrescription);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(existingPrescription, result);
        }

        [Test]
        public async Task UpdatePrescription_NonExistingPrescription_ThrowsNoSuchPrescriptionException()
        {
            // Arrange
            var nonExistingPrescription = new Prescriptions { };

            var repoMock = new Mock<IRepository<int, Prescriptions>>();
            repoMock.Setup(repo => repo.GetAsync(nonExistingPrescription.PrescriptionId)).ReturnsAsync((Prescriptions)null);

            var prescriptionService = new PrescriptionService(repoMock.Object, null);

            // Act & Assert
            Assert.ThrowsAsync<NoSuchPrescriptionException>(() => prescriptionService.UpdatePrescription(nonExistingPrescription));
        }

        [Test]
        public async Task GetPrescriptionsByRecordId_ValidRecordId_ReturnsListOfPrescriptions()
        {
            // Arrange
            var validRecordId = 1;
            var prescriptionsByRecordId = new List<Prescriptions> { };

            var reposMock = new Mock<IPrescriptionRepository>();
            reposMock.Setup(repo => repo.GetByRecordIdAsync(validRecordId)).ReturnsAsync(prescriptionsByRecordId);

            var prescriptionService = new PrescriptionService(null, reposMock.Object);

            // Act
            var result = await prescriptionService.GetPrescriptionsByRecordId(validRecordId);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOf<List<Prescriptions>>(result);
            CollectionAssert.AreEqual(prescriptionsByRecordId, result);
        }


    }
}