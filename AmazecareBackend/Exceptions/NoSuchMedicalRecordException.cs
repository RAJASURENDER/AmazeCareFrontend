using System.Runtime.Serialization;

namespace AmazeCare.Repositories
{
    [Serializable]
    public class NoSuchMedicalRecordException : Exception
    {
        /// <summary>
        /// Represents an exception thrown when no medical record with the given ID is found.
        /// </summary>

        string message;
        public NoSuchMedicalRecordException()
        {
            message = "NO MedicalRecord with the given id";
        }
        public override string Message => message;


    }
}