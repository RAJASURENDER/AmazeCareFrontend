using AmazeCare.Models;
using AmazeCare.Models.DTOs;

namespace AmazeCare.Mappers
{
    public class RegisterToDoctor
    {
        Doctors doctor;


        /// <summary>
        /// Initializes a new instance of the RegisterToDoctor class with the specified RegisterDoctorDTO.
        /// </summary>
        /// <param name="register">The RegisterDoctorDTO containing doctor registration information.</param>


        public RegisterToDoctor(RegisterDoctorDTO register)
        {
            doctor = new Doctors();
            doctor.DoctorName = register.DoctorName;
            doctor.Speciality = register.Speciality;
            doctor.Experience = register.Experience;
            doctor.Qualification = register.Qualification;
            doctor.Designation = register.Designation;
            doctor.Username = register.Username;
        }

        /// <summary>
        /// Gets the Doctors entity mapped from the RegisterDoctorDTO.
        /// </summary>
        /// <returns>The Doctors entity.</returns>

        public Doctors GetDoctor()
        {
            return doctor;
        }
    }
}
