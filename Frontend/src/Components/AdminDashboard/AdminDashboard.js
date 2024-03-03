// JavaScript source code
import React from 'react';
import './AdminDashboard.css';
import { Link } from 'react-router-dom';
import NavBar from '../NavBar/navbar';

const AdminDashboard = () => {
    return (
        <div className="AdminDashboard">
            <NavBar />
            {/* Admin Section */}
            <div className="Admin-section">
                <div className="container">
                    <div className="Admin-box">
                        <h2 className="heading">Welcome To AmazeCare</h2>
                        <div className="text-center">
                            <Link to="/toDoctors" className="btn btn-info x">
                                Doctors
                            </Link>
                            <Link to="/toAdminViewAppointments" className="btn btn-success x">
                                View Appointments
                            </Link>
                            <Link to="/toPatientInfoAdmin" className="btn btn-warning x">
                                Patients
                            </Link>
                        </div>
                    </div>
                </div>
             
            </div>
         
        </div>


    );
}

export default AdminDashboard;
