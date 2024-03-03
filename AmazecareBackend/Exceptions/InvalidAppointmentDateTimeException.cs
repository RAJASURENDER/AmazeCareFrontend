namespace AmazeCare.Exceptions
{
    [Serializable]
    public class InvalidAppointmentDateTimeException : Exception
    {
        string message;
        public InvalidAppointmentDateTimeException()
        {
            message = "Invalid Appointment Date or Time";
        }
        public override string Message => message;

    }
}