using AmazeCare.Exceptions;
using AmazeCare.Interfaces;
using AmazeCare.Mappers;
using AmazeCare.Models;
using AmazeCare.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace AmazeCare.Services
{

    public class UserService : IUserService
    {
        private readonly IRepository<int, Patients> _patientRepository;
        private readonly IRepository<int, Doctors> _doctorRepository;
        private readonly IRepository<string, User> _userRepository;
        private readonly ILogger<UserService> _logger;
        private readonly ITokenService _tokenService;
        private readonly User _adminUser; 


        public UserService(IRepository<int, Patients> patientRepository,
                           IRepository<int, Doctors> doctorRepository,
                           IRepository<string, User> userRepository,
                           ITokenService tokenService,
                           ILogger<UserService> logger)
        {
            _patientRepository = patientRepository;
            _doctorRepository = doctorRepository;
            _userRepository = userRepository;
            _tokenService = tokenService;
            _logger = logger;

            _adminUser = new User
            {
                Username = "Admin",
                Role = "Admin",
                Password = GetPasswordEncrypted("admin", GenerateRandomKey()), 
                Key = GenerateRandomKey()
            };

        }

        /// <summary>
        /// Method for Login
        /// </summary>
        /// <param name="user">Object of user</param>
        /// <returns>User Object</returns>
        /// <exception cref="InvalidUserException">Exception for invalid user</exception>
        public async Task<LoginUserDTO> Login(LoginUserDTO user)
        {
            try
            {
                if (user.Username == "Admin" && user.Password == "admin")
                {
                    user.Role = "Admin";
                    user.Password = "";
                    user.Token = await _tokenService.GenerateToken(user);
                    return user;
                }
                else
                {
                    var myUser = await _userRepository.GetAsync(user.Username);
                    if (myUser == null)
                    {
                        throw new InvalidUserException();
                    }

                    var userPassword = GetPasswordEncrypted(user.Password, myUser.Key);
                    var checkPasswordMatch = ComparePasswords(myUser.Password, userPassword);
                    if (checkPasswordMatch)
                    {
                        user.Password = ""; 
                        user.Role = myUser.Role;
                        user.Token = await _tokenService.GenerateToken(user);
                        return user;
                    }
                    else
                    {
                        throw new InvalidUserException();
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while logging in user: {Username}", user.Username);
                throw;
            }
        }
        /// <summary>
        /// Method for comparing passwords
        /// </summary>
        /// <param name="password"></param>
        /// <param name="userPassword"></param>
        /// <returns>true or false</returns>
        private bool ComparePasswords(byte[] password, byte[] userPassword)
        {
            for (int i = 0; i < password.Length; i++)
            {
                if (password[i] != userPassword[i])
                    return false;
            }
            return true;
        }

        public byte[] GetPasswordEncrypted(string password, byte[] key)
        {
            HMACSHA256 hmac = new HMACSHA256(key);
            var userpassword = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            return userpassword;
        }

        /// <summary>
        /// Method for Registering Patient
        /// </summary>
        /// <param name="user">Object of User</param>
        /// <returns>User Object</returns>
        public async Task<LoginUserDTO> RegisterPatient(RegisterPatientDTO user)
        {
            try
            {
                User myUser = new RegisterToUser(user).GetUser();
                myUser = await _userRepository.Add(myUser);
                Patients patient = new RegisterToPatient(user).GetPatient();
                patient = await _patientRepository.Add(patient);
                LoginUserDTO result = new LoginUserDTO
                {
                    Username = myUser.Username,
                    Role = myUser.Role,
                };
                return result;
            }
            catch (DbUpdateException ex) when (ex.InnerException is SqlException sqlEx && sqlEx.Number == 2627)
            {
                _logger.LogError("Error occurred while registering user: {Username}", user.Username);
                throw new PatientAlreadyExistException("A record with the same UserName already exists.");
            }
            }

        /// <summary>
        /// Method for Registering Doctor
        /// </summary>
        /// <param name="user">Object of User</param>
        /// <returns>User object</returns>
        public async Task<LoginUserDTO> RegisterDoctor(RegisterDoctorDTO user)
        {
            try
            {
                User myUser = new RegisterToUser(user).GetUser();
                myUser = await _userRepository.Add(myUser);
                Doctors doctor = new RegisterToDoctor(user).GetDoctor();
                doctor = await _doctorRepository.Add(doctor);
                LoginUserDTO result = new LoginUserDTO
                {
                    Username = myUser.Username,
                    Role = myUser.Role,
                };
                return result;
            }
            catch (DbUpdateException ex) when (ex.InnerException is SqlException sqlEx && sqlEx.Number == 2627)
            {
                _logger.LogError("Error occurred while registering user: {Username}", user.Username);
                throw new DoctorAlreadyExistException("A record with the same UserName already exists.", ex);
            }
        }




        /// <summary>
        /// Method for Generating Random Key
        /// </summary>
        /// <returns>Generated Random key</returns>
        public static byte[] GenerateRandomKey()
        {
            using (var rng = new RNGCryptoServiceProvider())
            {
                byte[] key = new byte[64]; 
                rng.GetBytes(key);
                return key;
            }
        }

    
        public async Task<bool> ResetPasswordAsync(string username, string newPassword)
        {
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(newPassword))
            {
                return false;
            }

            var user = await _userRepository.GetAsync(username);
            if (user == null)
            {
                return false;
            }

            // Generate a random key for the user
            byte[] key = GenerateRandomKey();

            // Hash the new password using HMACSHA256
            byte[] passwordBytes = Encoding.UTF8.GetBytes(newPassword);
            HMACSHA256 hmac = new HMACSHA256(key);
            byte[] hashedPassword = hmac.ComputeHash(passwordBytes);

            // Store the hashed password and key
            user.Password = hashedPassword;
            user.Key = key;

            // Save the updated user
            await _userRepository.Update(user);

            return true;
        }

    }
}
