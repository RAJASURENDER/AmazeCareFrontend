using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AmazeCare.Models
{
    public class Prescriptions : IEquatable<Prescriptions>
    {
        [Key]
        public  int PrescriptionId { get; set; }
        public int RecordId { get; set; }
        public string Medicine { get; set; } = string.Empty;

        public string Instructions { get; set; } = string.Empty;

        public string Dosage { get; set; } = string.Empty;

        [ForeignKey("RecordId")]
        [JsonIgnore]
        public MedicalRecords? MedicalRecords { get; set; }

        /// <summary>
        /// Default Constructor
        /// </summary>
        public Prescriptions()
        {
            
        }

        /// <summary>
        /// Parameterized Constructor
        /// </summary>
        /// <param name="prescriptionId"> precriptionId in int</param>
        /// <param name="recordId"> recordId in int</param>
        /// <param name="medicine"> medicine in string</param>
        /// <param name="instructions"> instructions in string</param>
        /// <param name="dosage">dosage in string</param>

        public Prescriptions(int prescriptionId, int recordId, string medicine, string instructions, string dosage)
        {
            PrescriptionId = prescriptionId;
            RecordId = recordId;
            Medicine = medicine;
            Instructions = instructions;
            Dosage = dosage;
        }
        public Prescriptions(int recordId, string medicine, string instructions, string dosage)
        {
            
            RecordId = recordId;
            Medicine = medicine;
            Instructions = instructions;
            Dosage = dosage;
        }

        /// <summary>
        /// Used to compare the Prescriptions object
        /// </summary>
        /// <param name="other">Object of Prescriptions</param>
        /// <returns>True if PrescriptionId is present else False</returns>
        public bool Equals(Prescriptions? other)
        {
            var prescription = other ?? new Prescriptions();
            return this.PrescriptionId.Equals(prescription.PrescriptionId);
        }
    }
}
