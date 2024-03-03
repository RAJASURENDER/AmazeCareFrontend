using AmazeCare.Models;
using AmazeCare.Models.DTOs;
using Microsoft.AspNetCore.Identity;

namespace AmazeCare.Interfaces
{
    public interface IUserService
    {
        public Task<LoginUserDTO> Login(LoginUserDTO user);
        public Task<LoginUserDTO> RegisterPatient(RegisterPatientDTO user);
        public Task<LoginUserDTO> RegisterDoctor(RegisterDoctorDTO user);
        
        Task<bool> ResetPasswordAsync(string username, string newPassword);
    }
}