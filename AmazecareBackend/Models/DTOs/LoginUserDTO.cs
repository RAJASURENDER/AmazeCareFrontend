namespace AmazeCare.Models.DTOs
{
    public class LoginUserDTO
    {
        /// <summary>
        /// Login DTO using Username and Password
        /// </summary>

        public string Username { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }

        public string Token { get; set; }
    }
}
