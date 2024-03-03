import React, { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import '../NavBar/navbar';

const Navbar = () => {
    const [showLinks, setShowLinks] = useState(false);
    const user = sessionStorage.getItem("user");
    const location = useLocation();
    const isPatientDashboard = location.pathname.startsWith('/patient-dashboard');
    const { patientId } = useParams();

    const handleLogout = () => {
        window.confirm('Are you sure to log out?');
        sessionStorage.removeItem("user");
        sessionStorage.removeItem('token');
        window.location.href = "/";
    };
    const toggleNavbar = () => {
        setShowLinks(!showLinks);
    };

    return (

        <div>
            <nav className="custom-navbar navbar-expand-lg">
            <Link className="custom-navbar-brand" to={`/patient-dashboard/${patientId}`}>
                    <img src="../../../../images/logo-no-background.png" className="d-inline-block align-top" alt="" />
                </Link>
                
                {isPatientDashboard ? (
                    <Link onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt btn btn-danger">
                        <strong> Logout </strong></i>
                    </Link>
                ) : (
                    <>
                        <button className="toggle-button" onClick={toggleNavbar}>
                            ☰
                        </button>
                        <div className={`navbar-links ${showLinks ? 'show' : ''}`}>
                            <Link to={`/doctors/${patientId}`}>Doctors</Link>
                            <Link to={`/appointments/${patientId}`}>Appointments</Link>
                            <Link to={`/medical-history/${patientId}`}>Medical History</Link>
                            <Link onClick={handleLogout}>
                                <i className="fas fa-sign-out-alt btn btn-danger">
                                <strong> Logout </strong></i>
                            </Link>
                        </div>
                    </>
                )}
            </nav>
        </div>
    );
};

export default Navbar;
