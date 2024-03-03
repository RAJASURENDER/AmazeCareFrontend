import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Doctor.css';

const Doctor = () => {
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showLinks, setShowLinks] = useState(false);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await axios.get("http://localhost:5244/ViewAllDoctors");
            setDoctors(response.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const handleDelete = async (doctorId) => {
        const confirmed = window.confirm("Are you sure you want to delete this doctor?");
        if (confirmed) {
            try {
                await axios.delete(`http://localhost:5244/DeleteDoctor?id=${doctorId}`);
                fetchDoctors();
            } catch (error) {
                console.error('Error deleting doctor:', error);
            }
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

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = doctors.filter(doctor => {
            return doctor.doctorName.toLowerCase().includes(query) || doctor.doctorId.toString().includes(query);
        });
        setFilteredDoctors(filtered);
    };

    const renderDoctors = filteredDoctors.length > 0 ? filteredDoctors : doctors;
    const noDoctorMessage = filteredDoctors.length === 0 && searchQuery !== '';

    return (
        <div className="doctor-page">
            <nav className="navbarr">
                <a className="navbar-brand" href="/admin-dashboard">
                    <img src="images/logo-no-background.png" className="img-fluid" alt="AMAZLogo" width="200" height="200" />
                </a>
                <div className="links">
                    <button className="toggle-button" onClick={toggleNavbar}></button>
                    <div className={`navbar-links ${showLinks ? "show" : ""}`}>
                        <Link to="/toDoctors">Doctors</Link>
                        <Link to="/toAdminViewAppointments">Appointments</Link>
                        <Link to="/toPatientInfoAdmin">Patients</Link>
                        <Link onClick={handleLogout}><i className="fas fa-sign-out-alt"></i><strong> Logout </strong></Link>
                    </div>
                </div>
            </nav>

            <div className="doctor-container">
                <div className="doctors-box">
                    <h2 className="text-center gap">All Doctors Details<Link to="/addDoctor" className="btn btn-primary ml-auto float">Add Doctor</Link></h2>

                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search by name or ID"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>

                    {noDoctorMessage && (
                        <p className="no-doctor-found">No doctors found with the entered ID or name.</p>
                    )}

                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Doctor ID</th>
                                <th scope="col">Name</th>
                                <th scope="col">Speciality</th>
                                <th scope="col">Experience</th>
                                <th scope="col">Qualification</th>
                                <th scope="col">Designation</th>
                                <th scope="col">Username</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderDoctors.map(doctor => (
                                <tr key={doctor.doctorId}>
                                    <td>{doctor.doctorId}</td>
                                    <td>{doctor.doctorName}</td>
                                    <td>{doctor.speciality}</td>
                                    <td>{doctor.experience}</td>
                                    <td>{doctor.qualification}</td>
                                    <td>{doctor.designation}</td>
                                    <td>{doctor.username}</td>
                                    <td>
                                        <Link to={`/updateDoctor/${doctor.doctorId}`} className="btn btn-info button-gap">Update</Link>
                                        <button className="btn btn-danger button-gap" onClick={() => handleDelete(doctor.doctorId)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Doctor;