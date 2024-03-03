
namespace AmazeCare.Exceptions
{
    [Serializable]
    public class PatientAlreadyExistException : Exception
    {
        /// <summary>
        /// Represents an exception thrown when Patient is Already Regsitered.
        /// </summary>

        string message;
        public PatientAlreadyExistException()
        {
            message = "Patient Already Registered With Same UserName...";
        }
        public PatientAlreadyExistException(string message)
        : base(message)
        {
        }

        public PatientAlreadyExistException(string message, Exception inner)
            : base(message, inner)
        {
        }

        public override string Message => message;
    }
}