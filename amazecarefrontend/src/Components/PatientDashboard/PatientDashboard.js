// JavaScript source code
import React from 'react';
import './PatientDashboard.css';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import PatientNavbar from '../NavBar/navbar-patient';
import { Link } from 'react-router-dom';


const PatientDashboard = () => {
    const { patientId } = useParams();

    useEffect(() => {
       ;
    }, [patientId]);

    return (
        <div className="PatientDashboard">
            {/* Navigation Bar */}
            <PatientNavbar/>
            {/* Patient Section */}
            <div className="patient-section">
                <div className="container">
                    <div className="patient-box">
                        <h2 className="heading">Welcome To AmazeCare</h2>
                        <div className="text-center">
                            <Link to={`/doctors/${patientId}`} className="btn btn-info button-spacing" id="doctorsListButton">
                                Doctors Info
                            </Link>

                            <Link to={`/appointments/${patientId}`} className="btn btn-success button-spacing" id="viewAppointmentsButton">
                                View Appointments
                            </Link>

                            <Link to={`/medical-history/${patientId}`} className="btn btn-warning button-spacing" id="medicalHistoryButton">
                                Medical History
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            
        </div>
    );
}

export default PatientDashboard;
