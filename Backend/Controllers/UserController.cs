using AmazeCare.Exceptions;
using AmazeCare.Interfaces;
using AmazeCare.Models.DTOs;
using AmazeCare.Repositories;
using AmazeCare.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;
using System.Text;

namespace AmazeCare.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("ReactPolicy")]
    public class UserController : ControllerBase
    {

        private readonly IUserService _userService;
        private readonly ILogger<UserController> _logger;

        public UserController(IUserService userService, ILogger<UserController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        [Route("/RegisterPatient")]
        [HttpPost]
        public async Task<ActionResult<LoginUserDTO>> RegisterPatient(RegisterPatientDTO user)
        {
            try
            {
                var result = await _userService.RegisterPatient(user);
                return Ok(result);
            }
           
            catch (PatientAlreadyExistException message)
            {
                _logger.LogCritical(message.Message);
                return Conflict("Failed to Regsiter Due to UserName is already taken");
                
            }

        }

        [Route("/RegisterDoctor")]
        [HttpPost]
        public async Task<ActionResult<LoginUserDTO>> RegisterDoctor(RegisterDoctorDTO user)
        {
            try
            {
                var result = await _userService.RegisterDoctor(user);
                return Ok(result);
            }
            catch (DoctorAlreadyExistException message)
            {
                _logger.LogCritical(message.Message);
                return Conflict("Failed to regsiter due to username is already taken");
            }
        }


        [Route("/Login")]
        [HttpPost]
        public async Task<ActionResult<LoginUserDTO>> Login(LoginUserDTO user)
        {
            try
            {

                var result = await _userService.Login(user);
                return Ok(result);
            }
            catch (InvalidUserException iuse)
            {
                if (user == null || string.IsNullOrEmpty(user.Username) || string.IsNullOrEmpty(user.Password))
                {
                    _logger.LogCritical(iuse.Message);
                    return BadRequest("Username or NewPassword is null or empty.");
                }
                else
                {
                    _logger.LogCritical(iuse.Message);
                    return Unauthorized("Invalid username or password");
                }
            }

        }

        [HttpPut("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDTO resetPasswordDTO)
        {

            if (resetPasswordDTO == null || string.IsNullOrEmpty(resetPasswordDTO.Username) || string.IsNullOrEmpty(resetPasswordDTO.NewPassword))
            {
                return BadRequest("Username or NewPassword is null or empty.");
            }

            bool success = await _userService.ResetPasswordAsync(resetPasswordDTO.Username, resetPasswordDTO.NewPassword);
            if (!success)
            {
                return NotFound($"User with username {resetPasswordDTO.Username} is not found.");
            }

            return Ok("Password Reset successfully!!!");
        }
    }

}