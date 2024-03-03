using System.Runtime.Serialization;

namespace AmazeCare.Exceptions
{
    [Serializable]
    public class NoSuchPrescriptionException : Exception
    {
        /// <summary>
        /// Represents an exception thrown when no prescription with the given ID is found.
        /// </summary>

        string message;
        public NoSuchPrescriptionException()
        {
            message = "NO Prescription with the given id";
        }
        public override string Message => message;


    }

}