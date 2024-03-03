using System.Runtime.Serialization;

namespace AmazeCare.Exceptions
{
    [Serializable]
    public class InvalidUserException : Exception
    { 

        /// <summary>
        /// Represents an exception thrown when an invalid user is encountered.
        /// </summary>


        string message;
        public InvalidUserException()
        {
            message = "NO User with the given id";
        }
        public override string Message => message;
    }
}