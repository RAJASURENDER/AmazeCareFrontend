// JavaScript source code
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams,Link ,useNavigate} from 'react-router-dom';
import '../WriteMedicalRecords/WriteMedicalRecords.css'

const GenerateMedicalRecords = () => {
    const [medicalRecord, setMedicalRecord] = useState({

        currentSymptoms: '',
        physicalExamination: '',
        treatmentPlan: '',
        recommendedTests: '',
        appointmentId: ''
    });
    const navigate = useNavigate();
    const [showLinks, setShowLinks] = useState(false);

    const { doctorId,appointmentId } = useParams();

    useEffect(() => {
        setMedicalRecord(prevState => ({
            ...prevState,
            appointmentId: appointmentId
        }));
    }, [appointmentId], [doctorId]);

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
            await axios.post('http://localhost:5244/api/MedicalRecord/AddMedicalRecord', medicalRecord);
            alert('Medical record generated successfully!');
            navigate(`/medicalhistory/${doctorId}`);
        } catch (error) {
            console.error('Error generating medical record:', error);
            alert('The Medical Record for this Appointment is Already Generated !!!!!!!!!!');
        }
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to Logout?')) {
            window.location.href = "/";
        }
    }


    const toggleNavbar = () => {
        setShowLinks(!showLinks);
    };
    return (
        <div className="generate-medical-record">
            <nav className="navbarr">
                <a className="navbar-brand" href="/toDoctors">
                    <img src="../../images/logo-no-background.png" className="img-fluid" alt="AMAZLogo" width="200" height="200" />
                </a>
                <div className="links">
                    <button className="toggle-button" onClick={toggleNavbar}>
                        &#9776;
                    </button>
                    <div className={`navbar-links ${showLinks ? "show" : ""}`}>
                        <Link to={`/doctorappointment/${doctorId}`} >View  Appointments</Link>
                        <Link to={`/medicalhistory/${doctorId}`}>Medical History</Link>

                        <Link onClick={handleLogout}><i className="fas fa-sign-out-alt"></i><strong> Logout </strong></Link>
                    </div>
                </div>
            </nav>
            <div className='generatee-medical-records-container'>
                <div className='generatee-medical-records-box'>
                    <h2>Generate Medical Record</h2>
                    <form onSubmit={handleSubmit}>

                        <div className="form-group1">
                            <label htmlFor="appointmentId">Appointment ID</label>
                            <input type="text" className="form-control" id="appointmentId" name="appointmentId" value={medicalRecord.appointmentId} readOnly />
                        </div>
                        <div className="form-group1">
                            <label htmlFor="currentSymptoms">Current Symptoms</label>
                            <input type="text" className="form-control" id="currentSymptoms" name="currentSymptoms" value={medicalRecord.currentSymptoms} onChange={handleChange} />
                        </div>
                        <div className="form-group1">
                            <label htmlFor="physicalExamination">Physical Examination</label>
                            <input type="text" className="form-control" id="physicalExamination" name="physicalExamination" value={medicalRecord.physicalExamination} onChange={handleChange} />
                        </div>
                        <div className="form-group1">
                            <label htmlFor="treatmentPlan">Treatment Plan</label>
                            <input type="text" className="form-control" id="treatmentPlan" name="treatmentPlan" value={medicalRecord.treatmentPlan} onChange={handleChange} />
                        </div>
                        <div className="form-group1">
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