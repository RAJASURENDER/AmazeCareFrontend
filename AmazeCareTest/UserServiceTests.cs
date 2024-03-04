using AmazeCare.Exceptions;
using AmazeCare.Interfaces;
using AmazeCare.Models;
using AmazeCare.Models.DTOs;
using AmazeCare.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;
using System;
using System.Numerics;
using System.Reflection;
using System.Runtime.Serialization;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace AmazeCareTest
{
    [TestFixture]
    public class UserServiceTests
    {
        private IUserService _userService;
        private Mock<IRepository<int, Patients>> _patientRepositoryMock;
        private Mock<IRepository<int, Doctors>> _doctorRepositoryMock;
        private Mock<IRepository<string, User>> _userRepositoryMock;
        private Mock<ITokenService> _tokenServiceMock;
        private Mock<ILogger<UserService>> _loggerMock;

        [SetUp]
        public void SetUp()
        {
            _patientRepositoryMock = new Mock<IRepository<int, Patients>>();
            _doctorRepositoryMock = new Mock<IRepository<int, Doctors>>();
            _userRepositoryMock = new Mock<IRepository<string, User>>();
            _tokenServiceMock = new Mock<ITokenService>();
            _loggerMock = new Mock<ILogger<UserService>>();

            _userService = new UserService(
                _patientRepositoryMock.Object,
                _doctorRepositoryMock.Object,
                _userRepositoryMock.Object,
                _tokenServiceMock.Object,
                _loggerMock.Object
            );
        }



        [Test]
        public async Task Login_AdminUser_ReturnsLoginUserDTO()
        {
            // Arrange
            var adminUser = new LoginUserDTO { Username = "Admin", Password = "admin" };

            _tokenServiceMock.Setup(tokenService => tokenService.GenerateToken(adminUser))
                             .ReturnsAsync("mocked-token");

            // Act
            var result = await _userService.Login(adminUser);

            // Assert
            Assert.AreEqual("mocked-token", result.Token);
        }

        [Test]
        public void Login_InvalidUser_ThrowsInvalidUserException()
        {
            // Arrange
            var invalidUser = new LoginUserDTO { Username = "NonExistingUser", Password = "invalidPassword" };

            _userRepositoryMock.Setup(repo => repo.GetAsync(invalidUser.Username))
                              .ReturnsAsync((User)null);

            // Act & Assert
            Assert.ThrowsAsync<InvalidUserException>(() => _userService.Login(invalidUser));
        }

        [Test]
        public void Login_InvalidPassword_ThrowsInvalidUserException()
        {
            var validPassword = "ValidPassword";
            var passwordBytes = Encoding.Unicode.GetBytes(validPassword); 

            //Arrange
            var existingUser = new User { Username = "ValidUser", Password = passwordBytes, Role = "User", Key = Encoding.UTF8.GetBytes("ValidKey") };
            var loginUser = new LoginUserDTO { Username = "ValidUser", Password = "InvalidPassword" };
            _userRepositoryMock.Setup(repo => repo.GetAsync(loginUser.Username))
                              .ReturnsAsync(existingUser);

            // Act & Assert
            Assert.ThrowsAsync<InvalidUserException>(() => _userService.Login(loginUser));
        }

        [Test]
        public async Task Login_PatientUser_ReturnsLoginUserDTO()
        {
            // Arrange
            var loginUserDto = new LoginUserDTO { Username = "Joe", Password = "123456" };
            var existingUser = new User
            {
                Username = "Joe",
                Password = _userService.GetPasswordEncrypted("123456", Encoding.UTF8.GetBytes("testkey")), 
                Role = "Patient",
                Key = Encoding.UTF8.GetBytes("testkey")
            };
            _userRepositoryMock.Setup(repo => repo.GetAsync(loginUserDto.Username)).ReturnsAsync(existingUser);
            var mockedToken = "mocked-token";
            _tokenServiceMock.Setup(tokenService => tokenService.GenerateToken(It.IsAny<LoginUserDTO>())).ReturnsAsync(mockedToken);

            // Act
            var result = await _userService.Login(loginUserDto);

            // Assert
            Assert.AreEqual(mockedToken, result.Token);
        }





        [Test]
        public void Login_ExceptionThrown_LogsErrorAndRethrows()
        {
            // Arrange
            var user = new LoginUserDTO { Username = "User", Password = "Password" };
            _userRepositoryMock.Setup(repo => repo.GetAsync(user.Username))
                              .Throws(new Exception("Simulated exception"));

            // Act & Assert
            Assert.ThrowsAsync<Exception>(() => _userService.Login(user));
        }



        [Test]
        public async Task ResetPasswordAsync_InvalidUsername_ReturnsFalse()
        {
            // Arrange
            var username = "NonExistingUser";
            var newPassword = "newPassword";

            _userRepositoryMock.Setup(repo => repo.GetAsync(username))
                              .ReturnsAsync((User)null);

            // Act
            var result = await _userService.ResetPasswordAsync(username, newPassword);

            // Assert
            Assert.IsFalse(result);
        }
        [Test]
        public async Task ResetPasswordAsync_ValidUsername_ReturnsTrue()
        {
            // Arrange
            var username = "ExistingUser";
            var newPassword = "newPassword";

            _userRepositoryMock.Setup(repo => repo.GetAsync(username))
                              .ReturnsAsync(new User { Username = username });

            // Act
            var result = await _userService.ResetPasswordAsync(username, newPassword);

            // Assert
            Assert.IsTrue(result);
        }
        [Test]
        public async Task ResetPasswordAsync_EmptyUsernameOrPassword_ReturnsFalse()
        {
            // Arrange
            var emptyUsername = "";
            var newPassword = "newPassword";

            // Act
            var resultEmptyUsername = await _userService.ResetPasswordAsync(emptyUsername, newPassword);

            var nullUsername = null as string;

            // Act
            var resultNullUsername = await _userService.ResetPasswordAsync(nullUsername, newPassword);

            var emptyPassword = "username";
            var newPasswordEmptyPassword = "";

            // Act
            var resultEmptyPassword = await _userService.ResetPasswordAsync(emptyPassword, newPasswordEmptyPassword);

            // Assert
            Assert.IsFalse(resultEmptyUsername);
            Assert.IsFalse(resultNullUsername);
            Assert.IsFalse(resultEmptyPassword);
        }
        [Test]
        public async Task RegisterDoctor_ValidRegistration_ReturnsLoginUserDTO()
        {
            // Arrange
            var registerDoctorDto = new RegisterDoctorDTO
            {
                Username = "testuser",
                Password = "testpassword",
                Role = "Doctor",
                DoctorName = "Dr. John Doe",
                Speciality = "Cardiology",
                Experience = 10.5f,
                Qualification = "MD",
                Designation = "Senior Consultant"
            };

            var user = new User
            {
                Username = "testuser",
                Password = Encoding.UTF8.GetBytes("testpassword"),
                Role = "Doctor",
                Key = Encoding.UTF8.GetBytes("testkey")
            };
            _userRepositoryMock.Setup(repo => repo.Add(It.IsAny<User>())).ReturnsAsync(user);

            var doctor = new Doctors
            {
                DoctorId = 1,
                DoctorName = "Dr. John Doe",
                Speciality = "Cardiologist",
                Experience = 10.5f,
                Qualification = "MD",
                Designation = "Senior Consultant",
                Username = "testuser"
            };
            _doctorRepositoryMock.Setup(repo => repo.Add(It.IsAny<Doctors>())).ReturnsAsync(doctor);

            // Act
            var result = await _userService.RegisterDoctor(registerDoctorDto);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(registerDoctorDto.Username, result.Username);
            Assert.AreEqual(user.Role, result.Role);
        }

        [Test]
        public async Task RegisterDoctor_DbUpdateException_ThrowsDoctorAlreadyExistExceptionThrown()
        {
            // Arrange
            var registerDoctorDto = new RegisterDoctorDTO
            {
                Username = "Addison",
                Password = "testpassword",
                Role = "Doctor",
                DoctorName = "Dr. John Doe",
                Speciality = "Cardiology",
                Experience = 10.5f,
                Qualification = "MD",
                Designation = "Senior Consultant"
            };

            var dbUpdateException = new DbUpdateException("Error saving changes to the database.");

            _userRepositoryMock.Setup(repo => repo.Add(It.IsAny<User>())).ThrowsAsync(dbUpdateException);

            // Act & Assert
            var ex = Assert.ThrowsAsync<DoctorAlreadyExistException>(() => _userService.RegisterDoctor(registerDoctorDto));
            StringAssert.Contains("A record with the same UserName already exists.", ex.Message);
        }
        [Test]
        public async Task RegisterPatient_SuccessfulRegistration_ReturnsLoginUserDTO()
        {
            // Arrange
            var registerPatientDto = new RegisterPatientDTO
            {
                Username = "testuser",
                Password = "testpassword",
                Role = "Patient",
                PatientName = "John Doe",
                Age = 25,
                Gender = "Male",
                DateOfBirth = new DateTime(1996, 5, 10),
                ContactNumber = "1234567890"
            };

            var user = new User
            {
                Username = "testuser",
                Password = Encoding.UTF8.GetBytes("testpassword"),
                Role = "Patient",
                Key = Encoding.UTF8.GetBytes("testkey")
            };
            _userRepositoryMock.Setup(repo => repo.Add(It.IsAny<User>())).ReturnsAsync(user);

            var patient = new Patients
            {
                PatientId = 1,
                PatientName = "John Doe",
                Age = 30,
                Gender = "Male",
                DateOfBirth = new DateTime(1992, 10, 15),
                ContactNumber = "1234567890",
                Username = "testuser"
            };

            _patientRepositoryMock.Setup(repo => repo.Add(It.IsAny<Patients>())).ReturnsAsync(patient);

            // Act
            var result = await _userService.RegisterPatient(registerPatientDto);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(registerPatientDto.Username, result.Username);
            Assert.AreEqual(user.Role, result.Role);
        }

        [Test]
        public void RegisterPatient_DbUpdateException_ThrowsPatientAlreadyExistException()
        {
            // Arrange
            var registerPatientDto = new RegisterPatientDTO
            {
                Username = "Aditi",
                Password = "password123",
                Role = "Patient",
                PatientName = "John Doe",
                Age = 25,
                Gender = "Male",
                DateOfBirth = new DateTime(1996, 5, 10),
                ContactNumber = "1234567890"
            };

            var dbUpdateException = new DbUpdateException("Error saving changes to the database.");

            _userRepositoryMock.Setup(repo => repo.Add(It.IsAny<User>())).ThrowsAsync(dbUpdateException);

            // Act & Assert
            var ex = Assert.ThrowsAsync<PatientAlreadyExistException>(() => _userService.RegisterPatient(registerPatientDto));
            StringAssert.Contains("A record with the same UserName already exists.", ex.Message);
            
        }

    }
}