using AmazeCare.Exceptions;
using AmazeCare.Interfaces;
using AmazeCare.Models;
using AmazeCare.Services;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AmazeCareTestt
{
    [TestFixture]
    public class DoctorServiceTests
    {
        private Mock<IRepository<int, Doctors>> _repoMock;
        private DoctorService _doctorService;

        [SetUp]
        public void Setup()
        {
            _repoMock = new Mock<IRepository<int, Doctors>>();
            _doctorService = new DoctorService(_repoMock.Object);
        }

        [Test]
        public async Task AddDoctor_ValidDoctor_ReturnsDoctor()
        {
            // Arrange
            var validDoctor = new Doctors {
                DoctorId = 1,
                DoctorName = "Dr. John Doe", 
                Speciality = "Cardiology",
                Designation = "Senior Cardiologist", 
                Qualification = "MD", 
                Username = "drjohn"
  
            };

            _repoMock.Setup(repo => repo.Add(It.IsAny<Doctors>())).ReturnsAsync(validDoctor);

            // Act
            var result = await _doctorService.AddDoctor(validDoctor);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(validDoctor, result);
        }

        [Test]
        public async Task DeleteDoctor_ExistingDoctorId_ReturnsDeletedDoctor()
        {
            // Arrange
            var existingDoctorId = 1;
            var existingDoctor = new Doctors { DoctorId = existingDoctorId };

            _repoMock.Setup(repo => repo.GetAsync(existingDoctorId)).ReturnsAsync(existingDoctor);
            _repoMock.Setup(repo => repo.Delete(existingDoctorId)).ReturnsAsync(existingDoctor);

            // Act
            var result = await _doctorService.DeleteDoctor(existingDoctorId);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(existingDoctor, result);
        }

        [Test]
        public void DeleteDoctor_NonExistingDoctorId_ThrowsNoSuchDoctorException()
        {
            // Arrange
            var nonExistingDoctorId = 2;

            _repoMock.Setup(repo => repo.GetAsync(nonExistingDoctorId)).ReturnsAsync((Doctors)null);

            // Act and Assert
            Assert.ThrowsAsync<NoSuchDoctorException>(async () => await _doctorService.DeleteDoctor(nonExistingDoctorId));
        }

        [Test]
        public async Task GetDoctor_ExistingDoctorId_ReturnsDoctor()
        {
            // Arrange
            var existingDoctorId = 1;
            var existingDoctor = new Doctors { DoctorId = existingDoctorId };

            _repoMock.Setup(repo => repo.GetAsync(existingDoctorId)).ReturnsAsync(existingDoctor);

            // Act
            var result = await _doctorService.GetDoctor(existingDoctorId);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(existingDoctor, result);
        }

        [Test]
        public async Task GetDoctorList_ReturnsDoctorList()
        {
            // Arrange
            var doctor1 = new Doctors
            {
                DoctorId = 1,
                DoctorName = "Dr. John Doe",
                Speciality = "Cardiology",
                Designation = "Senior Cardiologist",
                Qualification = "MD",
                Username = "drjohn",

            };

            var doctor2 = new Doctors
            {
                DoctorId = 2,
                DoctorName = "Dr. Jane Smith",
                Speciality = "Cardiology",
                Designation = "Cardiologist",
                Qualification = "MS",
                Username = "drjane",

            };

            var doctor3 = new Doctors
            {
                DoctorId = 3,
                DoctorName = "Dr. Bob Johnson",
                Speciality = "Orthopedics",
                Designation = "Orthopedic Surgeon",
                Qualification = "MBBS",
                Username = "drbob",

            };
            var doctorList = new List<Doctors> { doctor1,doctor2,doctor3 };

            _repoMock.Setup(repo => repo.GetAsync()).ReturnsAsync(doctorList);

            // Act
            var result = await _doctorService.GetDoctorList();

            // Assert
            Assert.IsNotNull(result);
            CollectionAssert.AreEqual(doctorList, result);
        }

        [Test]
        public async Task UpdateDoctorExperience_ValidData_ReturnsUpdatedDoctor()
        {
            // Arrange
            var doctorIdToUpdate = 1;
            var newExperience = 5.5f;
            var existingDoctor = new Doctors { DoctorId = doctorIdToUpdate };

            _repoMock.Setup(repo => repo.GetAsync(doctorIdToUpdate)).ReturnsAsync(existingDoctor);
            _repoMock.Setup(repo => repo.Update(It.IsAny<Doctors>())).ReturnsAsync(existingDoctor);

            // Act
            var result = await _doctorService.UpdateDoctorExperience(doctorIdToUpdate, newExperience);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(newExperience, result.Experience);
        }

        [Test]
        public async Task UpdateDoctorQualification_ValidData_ReturnsUpdatedDoctor()
        {
            // Arrange
            var doctorIdToUpdate = 1;
            var newQualification = "MD";
            var existingDoctor = new Doctors { DoctorId = doctorIdToUpdate };

            _repoMock.Setup(repo => repo.GetAsync(doctorIdToUpdate)).ReturnsAsync(existingDoctor);
            _repoMock.Setup(repo => repo.Update(It.IsAny<Doctors>())).ReturnsAsync(existingDoctor);

            // Act
            var result = await _doctorService.UpdateDoctorQualification(doctorIdToUpdate, newQualification);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(newQualification, result.Qualification);
        }

        [Test]
        public async Task UpdateDoctor_ValidData_ReturnsUpdatedDoctor()
        {
            // Arrange
            var existingDoctor = new Doctors { DoctorId = 1, DoctorName = "Dr. John Doe" };
            var updatedDoctor = new Doctors { DoctorId = 1, DoctorName = "Dr. Jane Doe" };

            _repoMock.Setup(repo => repo.GetAsync(existingDoctor.DoctorId)).ReturnsAsync(existingDoctor);
            _repoMock.Setup(repo => repo.Update(It.IsAny<Doctors>())).ReturnsAsync(updatedDoctor);

            // Act
            var result = await _doctorService.UpdateDoctor(updatedDoctor);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(updatedDoctor.DoctorName, result.DoctorName);
        }

        [Test]
        public async Task GetDoctorsBySpeciality_ValidSpeciality_ReturnsDoctorsList()
        {
            // Arrange
            var speciality = "Cardiology";
            var doctor1 = new Doctors
            {
                DoctorId = 1,
                DoctorName = "Dr. John Doe",
                Speciality = "Cardiology",
                Designation = "Senior Cardiologist",
                Qualification = "MD",
                Username = "drjohn",
         
            };

            var doctor2 = new Doctors
            {
                DoctorId = 2,
                DoctorName = "Dr. Jane Smith",
                Speciality = "Cardiology",
                Designation = "Cardiologist",
                Qualification = "MS",
                Username = "drjane",
             
            };

            var doctor3 = new Doctors
            {
                DoctorId = 3,
                DoctorName = "Dr. Bob Johnson",
                Speciality = "Orthopedics",
                Designation = "Orthopedic Surgeon",
                Qualification = "MBBS",
                Username = "drbob",
              
            };
            var allDoctors = new List<Doctors> { doctor1 , doctor2 , doctor3 };

            _repoMock.Setup(repo => repo.GetAsync()).ReturnsAsync(allDoctors);

            // Act
            var result = await _doctorService.GetDoctorsBySpeciality(speciality);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOf<List<Doctors>>(result);
        }

        [Test]
        public async Task GetDoctorIdByUsername_ValidUsername_ReturnsDoctorId()
        {
            // Arrange
            var username = "drjohn";
            var doctors = new List<Doctors> { new Doctors { DoctorId = 1, Username = username } };

            _repoMock.Setup(repo => repo.GetAsync()).ReturnsAsync(doctors);

            // Act
            var result = await _doctorService.GetDoctorIdByUsername(username);

            // Assert
            Assert.AreEqual(1, result);
        }

        [Test]
        public async Task GetDoctorIdByUsername_InvalidUsername_ReturnsMinusOne()
        {
            // Arrange
            var username = "nonexistent";

            _repoMock.Setup(repo => repo.GetAsync()).ReturnsAsync(new List<Doctors>());

            // Act
            var result = await _doctorService.GetDoctorIdByUsername(username);

            // Assert
            Assert.AreEqual(-1, result);
        }
    }

}
