using AmazeCare.Models;

namespace AmazeCare.Interfaces
{
    public interface IAppointmentUserService
    {
        public Task<Appointments> GetAppointment(int id);
    }
}
