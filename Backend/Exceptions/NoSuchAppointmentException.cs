using System.Runtime.Serialization;

namespace AmazeCare.Exceptions
{
    [Serializable]
    public class NoSuchAppointmentException : Exception
    {
        /// <summary>
        /// Represents an exception thrown when no appointment with the given ID is found.
        /// </summary>

        string message;
        public NoSuchAppointmentException()
        {
            message = "NO Appointment with the given id";
        }
        public override string Message => message;
    }
}