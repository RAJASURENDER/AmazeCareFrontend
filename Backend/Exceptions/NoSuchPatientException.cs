using System.Runtime.Serialization;

namespace AmazeCare.Exceptions
{
    [Serializable]
    public class NoSuchPatientException : Exception
    {
        /// <summary>
        /// Represents an exception thrown when no patient with the given ID is found.
        /// </summary>

        string message;
        public NoSuchPatientException()
        {
            message = "NO Patient with the given id";
        }
        public override string Message => message;

    }
}