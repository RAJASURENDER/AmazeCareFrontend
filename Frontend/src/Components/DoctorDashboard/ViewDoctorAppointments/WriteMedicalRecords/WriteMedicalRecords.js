import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../../NavBar/navbar-doctor';
import './WriteMedicalRecords.css';
const token = sessionStorage.getItem('token');

const GenerateMedicalRecords = () => {
    const [medicalRecord, setMedicalRecord] = useState({
        currentSymptoms: '',
        physicalExamination: '',
        treatmentPlan: '',
        recommendedTests: '',
        appointmentId: ''
    });

    const { appointmentId, doctorId } = useParams();
    const navigate = useNavigate();
    

    useEffect(() => {
        setMedicalRecord(prevState => ({
            ...prevState,
            appointmentId: appointmentId
        }));
    }, [appointmentId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMedicalRecord(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5244/api/MedicalRecord/AddMedicalRecord', medicalRecord, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // Update the status to "Completed" after successfully genrating mediczl record
            await axios.put(`http://localhost:5244/StatusToCompleteAppointment?id=${appointmentId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Medical record generated successfully!');
            navigate(`/doctorappointment/${doctorId}`);
        } catch (error) {
            console.error('Error generating medical record:', error);
            // Update the status to "Completed" after successfully genrating mediczl record
            await axios.put(`http://localhost:5244/StatusToCompleteAppointment?id=${appointmentId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('The Medical Record for this Appointment is Already Generated !!');
            navigate(`/doctorappointment/${doctorId}`);
        }
    };

    return (
        <div className="generate-medical-record">
            <Navbar />
            <div className='generate-medical-records-container'>
                <div className='generate-medical-records-box'>
                    <h1 className="update-h1">Generate Medical Record</h1>
                    <form onSubmit={handleSubmit}>

                        <div className="form-group">
                            <label htmlFor="appointmentId">Appointment ID</label>
                            <input type="text" className="form-control" id="appointmentId" name="appointmentId" value={medicalRecord.appointmentId} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="currentSymptoms">Current Symptoms</label>
                            <input type="text" className="form-control" id="currentSymptoms" name="currentSymptoms" value={medicalRecord.currentSymptoms} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="physicalExamination">Physical Examination</label>
                            <input type="text" className="form-control" id="physicalExamination" name="physicalExamination" value={medicalRecord.physicalExamination} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="treatmentPlan">Treatment Plan</label>
                            <input type="text" className="form-control" id="treatmentPlan" name="treatmentPlan" value={medicalRecord.treatmentPlan} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="recommendedTests">Recommended Tests</label>
                            <input type="text" className="form-control" id="recommendedTests" name="recommendedTests" value={medicalRecord.recommendedTests} onChange={handleChange} />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GenerateMedicalRecords;