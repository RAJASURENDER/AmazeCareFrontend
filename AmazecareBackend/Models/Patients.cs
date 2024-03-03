using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AmazeCare.Models
{
    public class Patients : IEquatable<Patients>
    {
        [Key]
        public int PatientId { get; set; }
        public string PatientName { get; set; } = string.Empty;

        public int Age { get; set; }

        public string? Gender { get; set; }

        public DateTime DateOfBirth  { get; set; }

        public string? ContactNumber { get; set; }

        public string Username { get; set; } = string.Empty;

        [ForeignKey("Username")]
        [JsonIgnore]
        public User? User { get; set; }
        [JsonIgnore]
        public ICollection<Appointments>? Appointments { get; set; }



        /// <summary>
        /// Default Constructor
        /// </summary>

        public Patients()
        {
            
        }
        /// <summary>
        /// Parameterized Constructer
        /// </summary>
        /// <param name="patientId">patient id in int</param>
        /// <param name="patientName">patient Name in string</param>
        /// <param name="age"> Age in int</param>
        /// <param name="gender">Gender in string</param>
        /// <param name="dateOfBirth"> date of birth in date</param>
        /// <param name="contactNumber">contact number in string</param>
        /// <param name="username">username in string</param>
        public Patients(int patientId, string patientName, int age, string? gender, DateTime dateOfBirth, string contactNumber, string username)
        {
            PatientId = patientId;
            PatientName = patientName;
            Age = age;
            Gender = gender;
            DateOfBirth = dateOfBirth;
            ContactNumber = contactNumber;
            Username = username;
        }

        public Patients( string patientName, int age, string? gender, DateTime dateOfBirth,string contactNumber, string username)
        {
          
            PatientName = patientName;
            Age = age;
            Gender = gender;
            DateOfBirth = dateOfBirth;
            ContactNumber = contactNumber;
            Username = username;
        }

        /// <summary>
        /// Used to compare the Patients object
        /// </summary>
        /// <param name="other">Object of Patients</param>
        /// <returns>True if PatientId is present else False</returns>
        public bool Equals(Patients? other)
        {
            var patients = other ?? new Patients();
            return this.PatientId.Equals(patients.PatientId);
        }
    }
}

