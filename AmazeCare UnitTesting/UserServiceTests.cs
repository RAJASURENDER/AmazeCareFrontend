using AmazeCare.Exceptions;
using AmazeCare.Interfaces;
using AmazeCare.Models;
using AmazeCare.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;
using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace AmazeCare.Services.Tests
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
            Assert.IsNotNull(result);
            Assert.AreEqual("Admin", result.Role);
            Assert.IsEmpty(result.Password);
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

        
    }
}
