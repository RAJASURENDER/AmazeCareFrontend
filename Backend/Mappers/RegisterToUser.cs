using AmazeCare.Models;
using AmazeCare.Models.DTOs;
using System.Security.Cryptography;
using System.Text;

namespace AmazeCare.Mappers
{
    public class RegisterToUser
    {
        User user;

        /// <summary>
        /// Initializes a new instance of the RegisterToUser class with the specified RegisterPatientDTO.
        /// </summary>
        /// <param name="register">The RegisterPatientDTO containing user registration information.</param>

        public RegisterToUser(RegisterPatientDTO register)
        {
            user = new User();
            user.Username = register.Username;
            user.Role = register.Role;
            GetPassword(register.Password);
        }

        /// <summary>
        /// Initializes a new instance of the RegisterToUser class with the specified RegisterDoctorDTO.
        /// </summary>
        /// <param name="register">The RegisterDoctorDTO containing user registration information.</param>

        public RegisterToUser(RegisterDoctorDTO register)
        {
            user = new User();
            user.Username = register.Username;
            user.Role = register.Role;
            GetPassword(register.Password);
        }

        /// <summary>
        /// Sets the user's password and generates a cryptographic key.
        /// </summary>
        /// <param name="password">The user's password.</param>

        void GetPassword(string password)
        {
            HMACSHA256 hmac = new HMACSHA256();
            user.Key = hmac.Key;
            user.Password = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        }

        /// <summary>
        /// Gets the User entity mapped from the RegisterPatientDTO or RegisterDoctorDTO.
        /// </summary>
        /// <returns>The User entity.</returns>

        public User GetUser()
        {
            return user;
        }
    }
}

