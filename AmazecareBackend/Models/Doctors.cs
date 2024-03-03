using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AmazeCare.Models
{
    public class Doctors : IEquatable<Doctors>
    {
        [Key]
        public int DoctorId { get; set; }
        public string DoctorName { get; set; } = string.Empty;

        public string Speciality { get; set; } = string.Empty;

        public float Experience { get; set; }

        public string Qualification { get; set; } = string.Empty;

        public string Designation { get; set; } = string.Empty;

        public string Username { get; set; } = string.Empty;

        [ForeignKey("Username")]
        [JsonIgnore]
        public User? User { get; set; }

        [JsonIgnore]
        public ICollection<Appointments>? Appointments { get; set; }





        /// <summary>
        /// Default constructor
        /// </summary>


        public Doctors()
        {
            
        }

        /// <summary>
        /// Parameterized Constructor
        /// </summary>
        /// <param name="doctorId">doctorId in int</param>
        /// <param name="doctorName"> doctorName in string</param>
        /// <param name="speciality"> speciality in string</param>
        /// <param name="experience">Experience in int</param>
        /// <param name="qualification"> Qualification in string</param>
        /// <param name="designation">designation in string</param>
        /// <param name="username"> username in string</param>

        public Doctors(int doctorId, string doctorName, string speciality, float experience, string qualification, string designation, string username)
        {
            DoctorId = doctorId;
            DoctorName = doctorName;
            Speciality = speciality;
            Experience = experience;
            Qualification = qualification;
            Designation = designation;
            Username = username;
        }

        public Doctors( string doctorName, string speciality, float experience, string qualification, string designation, string username)
        {
           
            DoctorName = doctorName;
            Speciality = speciality;
            Experience = experience;
            Qualification = qualification;
            Designation = designation;
            Username = username;
        }


        /// <summary>
        /// Used to compare the Doctors object
        /// </summary>
        /// <param name="other">Object of Doctors</param>
        /// <returns>True if Doctor Id is present else False</returns>

        public bool Equals(Doctors? other)
        {
            var doctors = other ?? new Doctors();
            return this.DoctorId.Equals(doctors.DoctorId);
        }
    }

    

}
