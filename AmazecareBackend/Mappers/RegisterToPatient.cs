using AmazeCare.Models;
using AmazeCare.Models.DTOs;

namespace AmazeCare.Mappers
{
    public class RegisterToPatient
    {
        Patients patient;

        /// <summary>
        /// Initializes a new instance of the RegisterToPatient class with the specified RegisterPatientDTO.
        /// </summary>
        /// <param name="register">The RegisterPatientDTO containing patient registration information.</param>

        public RegisterToPatient(RegisterPatientDTO register)
        {
            patient = new Patients();
            patient.PatientName = register.PatientName;
            patient.Age = register.Age;
            patient.Gender = register.Gender;
            patient.DateOfBirth = register.DateOfBirth;
            patient.ContactNumber = register.ContactNumber;
            patient.Username = register.Username;
        }

        /// <summary>
        /// Gets the Patients entity mapped from the RegisterPatientDTO.
        /// </summary>
        /// <returns>The Patients entity.</returns>

        public Patients GetPatient()
        {
            return patient;
        }
    }
}
