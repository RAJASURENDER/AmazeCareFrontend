import React from 'react';
import './AdminDashboard.css';
import { Link } from 'react-router-dom';


const AdminDashboard = () => {

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            window.location.href="/";
        }
    };
        


    return (
        <div className="AdminDashboard">
                <nav className="navbarr">
                    <a className="navbar-brand" href="/admin-dashboard">
                    <img src="images/logo-no-background.png" className="img-fluid" alt="Logo" width="200" height="200" />
                    </a>
                    <Link  onClick={handleLogout}><i className="fas fa-sign-out-alt"></i><strong> Logout </strong></Link>
                </nav>

                {/* Admin Section */}
                <div className="Admin-section">
                    <div className="dashboard-container">
                        <div className="Admin-box">
                            <h2 className="dashboard-heading-tag">Welcome To AmazeCare</h2>
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
