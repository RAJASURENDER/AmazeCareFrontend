
namespace AmazeCare.Exceptions
{
    [Serializable]
    public class ConflictingAppointmentsException : Exception
    {

        string message;
        public ConflictingAppointmentsException()
        {
            message = "Doctor has Prebooked Appointment at the given time,Please Change your Appointment Time";
        }
        public override string Message => message;
    }
}