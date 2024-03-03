using AmazeCare.Models.DTOs;

namespace AmazeCare.Interfaces
{
    public interface ITokenService
    {
        public Task<string> GenerateToken(LoginUserDTO user);
    }
}
