import React,{useState} from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import '../NavBar/navbar';

const Navbar = () => {
    const [showLinks, setShowLinks] = useState(false);
    const user = sessionStorage.getItem("user");
    const location = useLocation();
    const isDoctorDashboard = location.pathname.startsWith('/doctor-dashboard');
    const { doctorId } = useParams();

    const handleLogout = () => {
        window.confirm('Are you sure to log out?');
        sessionStorage.removeItem("user");
        sessionStorage.removeItem('token');
        window.location.href = "/";
    };
    const toggleNavbar = () => {
        setShowLinks(!showLinks);
      };
    
    return ( <div>
            <nav className="custom-navbar navbar-expand-lg">
                <Link className="custom-navbar-brand" to={`/doctor-dashboard/${doctorId}`}>
                    <img src="../../../images/logo-no-background.png" className="d-inline-block align-top" alt="" />
                </Link>
                {isDoctorDashboard ? (
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
                        <Link to={`/doctorappointment/${doctorId}`}>View Appointments</Link>
                        <Link to={`/medicalhistory/${doctorId}`}>Medical History</Link>
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
