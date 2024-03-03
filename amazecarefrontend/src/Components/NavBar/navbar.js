import React, { useState, useEffect } from 'react';
import { Link} from 'react-router-dom';
import '../NavBar/navbar.css';

const Navbar = () => {
  const [showLinks, setShowLinks] = useState(false);
  const user = sessionStorage.getItem("user");
  const [isDashboard, setIsDashboard] = useState(false);


  useEffect(() => {
    const currentPath = window.location.pathname;
    setIsDashboard(
      currentPath === '/admin-dashboard' ||
      currentPath.startsWith('/doctor-dashboard') ||
      currentPath.startsWith('/patient-dashboard')
    );
  }, [user]);

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
        <Link className="custom-navbar-brand" to={`/admin-dashboard`}>
          <img src="../../../images/logo-no-background.png" className="d-inline-block align-top" alt="" />
        </Link>
        
        {isDashboard ? (
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
              <Link to="/toDoctors">Doctors</Link>
              <Link to="/toAdminViewAppointments">Appointments</Link>
              <Link to="/toPatientInfoAdmin">Patients</Link>
              <Link to="/" onClick={handleLogout}>
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
