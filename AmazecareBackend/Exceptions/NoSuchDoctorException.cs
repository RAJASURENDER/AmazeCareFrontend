using System.Runtime.Serialization;

namespace AmazeCare.Exceptions
{
    [Serializable]
    public class NoSuchDoctorException : Exception
    {

        /// <summary>
        /// Represents an exception thrown when no doctor with the given ID is found.
        /// </summary>
        
        string message;
        public NoSuchDoctorException()
        {
            message = "NO Doctor with the given id";
        }
        public override string Message => message;


    }
}