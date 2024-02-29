// JavaScript source code
import React from 'react';
//import logo from '../../../logo-no-background.png'; // Make sure to import your logo file
import './PatientDashboard.css';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
// Make sure to import your styles
//import './App.css'; // You can create an App.css file for additional styles

import { Link } from 'react-router-dom';


const PatientDashboard = () => {
    const { patientId } = useParams();

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            window.location.href = "/";
        }
    };

    useEffect(() => {
       ;
    }, [patientId]);

    return (
        <div className="PatientDashboard">
            {/* Navigation Bar */}
            <nav className="navbarr">
                <a className="navbar-brand" href="/admin-dashboard">
                    <img src="../images/logo-no-background.png" className="img-fluid" alt="Logo" width="200" height="200" />
                </a>
                <Link  onClick={handleLogout}><i className="fas fa-sign-out-alt"></i><strong> Logout </strong></Link>
            </nav>

            {/* Patient Section */}
            <div className="patient-section">
                <div className="dashboard-container">
                    <div className="patient-box">
                        <h2 className="dashboard-heading-tag">Welcome To AmazeCare</h2>
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
