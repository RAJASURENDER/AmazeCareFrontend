namespace AmazeCare.Exceptions
{
    [Serializable]
    public class DoctorAlreadyExistException : Exception
    {
        /// <summary>
        /// Represents an exception thrown when Doctor is Already Regsitered.
        /// </summary>

        string message;
        public DoctorAlreadyExistException()
        {
            message = "Doctor Already Registered With same Username";
        }
        public DoctorAlreadyExistException(string message)
        : base(message)
        {
        }

        public DoctorAlreadyExistException(string message, Exception inner)
            : base(message, inner)
        {
        }
        public override string Message => message;
    }
}
