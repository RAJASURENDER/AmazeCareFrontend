
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Patient.css';

const options = { day: '2-digit', month: '2-digit', year: 'numeric' };

const Patient = () => {
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showLinks, setShowLinks] = useState(false);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await axios.get("http://localhost:5244/ViewAllPatients");
            setPatients(response.data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    const handleDelete = async (patientId) => {
        const confirmed = window.confirm("Are you sure you want to delete this patient?");
        if (confirmed) {
            try {
                await axios.delete(`http://localhost:5244/api/Patient/DeletePatient?id=${patientId}`);
                fetchPatients();
            } catch (error) {
                console.error('Error deleting patient:', error);
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
        const filtered = patients.filter(patient => {
            return patient.patientName.toLowerCase().includes(query) || patient.patientId.toString().includes(query);
        });
        setFilteredPatients(filtered);
    };

    const renderPatients = filteredPatients.length > 0 ? filteredPatients : patients;
    const noPatientMessage = filteredPatients.length === 0 && searchQuery !== '';

    return (
        <div className="patient-page">
            <nav className="navbarr">
                <a className="navbar-brand" href="/admin-dashboard">
                    <img src="images/logo-no-background.png" className="img-fluid" alt="AMAZLogo" width="200" height="200" />
                </a>
                <div className="links">
                    <button className="toggle-button" onClick={toggleNavbar}>
                        &#9776;
                    </button>
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
                    <h2 className="text-center">All Patients Details<Link to="/addPatient" className="btn btn-primary ml-auto float-right">Add Patient</Link></h2>

                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search by name or ID"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>

                    {noPatientMessage && (
                        <p className="no-patient-found">No patients found with the entered ID or name.</p>
                    )}

                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Patient ID</th>
                                <th scope="col">Name</th>
                                <th scope="col">Age</th>
                                <th scope="col">Gender</th>
                                <th scope="col">Date of Birth</th>
                                <th scope="col">Contact Number</th>
                                <th scope="col">Username</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderPatients.map(patient => (
                                <tr key={patient.patientId}>
                                    <td>{patient.patientId}</td>
                                    <td>{patient.patientName}</td>
                                    <td>{patient.age}</td>
                                    <td>{patient.gender}</td>
                                    <td>{new Date(patient.dateOfBirth).toLocaleDateString('en-GB', options)}</td>
                                    <td>{patient.contactNumber}</td>
                                    <td>{patient.username}</td>
                                    <td>
                                        <Link to={`/updatePatient/${patient.patientId}`} className="btn btn-info button-gap">Update</Link>
                                        <button className="btn btn-danger" onClick={() => handleDelete(patient.patientId)}>Delete</button>
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

export default Patient;