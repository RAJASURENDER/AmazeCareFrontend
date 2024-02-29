// JavaScript source code
import React, { useState, useEffect } from 'react';
import { Link,useParams } from 'react-router-dom';
import axios from 'axios';
import './MedicalRecords.css';

const MedicalRecords = () => {
    const [medicalRecords, setMedicalRecords] = useState([]);
    const { patientId } = useParams();
    const [showLinks, setShowLinks] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredmedicalRecords, setFilteredmedicalRecords] = useState([]);
    const [nomedicalRecordsMessage, setNomedicalRecordsMessage] = useState('');

    useEffect(() => {
        fetchMedicalRecords();
    }, [patientId]);

    const fetchMedicalRecords = async () => {
        try {
            console.log("check ", patientId)
            const response = await axios.get(`http://localhost:5244/ViewAllMedicalRecordsByPatientId?Id=${patientId}`);
            console.log("check api ", response.data)
            const recordsData = (response.data);
            setMedicalRecords(recordsData);
        } catch (error) {
            console.error('Error fetching medical records:', error);
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
        const filtered = medicalRecords.filter(record => record.appointmentId.toString().includes(query));
        setFilteredmedicalRecords(filtered);
        if (filtered.length === 0 && query !== '') {
            setNomedicalRecordsMessage('No medical Records found with the entered ID.');
        } else {
            setNomedicalRecordsMessage('');
        }
    };

    let rendermedicalRecords = filteredmedicalRecords.length > 0 ? filteredmedicalRecords : medicalRecords;

    // Sort appointments by appointment date in decreasing order
    rendermedicalRecords.sort((a, b) => new Date(b.appointmentId) - new Date(a.appointmentId));

    return (
        <div className="medical-records-page">
            <nav className="navbarr">
                <Link className="navbar-brand" to={`/patient-dashboard/${patientId}`}>
                    <img src="../images/logo-no-background.png" className="img-fluid" alt="AMAZLogo" width="200" height="200" />
                </Link>
                <div className="links">
                    <button className="toggle-button" onClick={toggleNavbar}>
                        &#9776;
                    </button>
                    <div className={`navbar-links ${showLinks ? "show" : ""}`}>
                        <Link to={`/doctors/${patientId}`}>Doctors</Link>
                        <Link to={`/appointments/${patientId}`}>MyAppointments</Link>
                        <Link to={`/medical-history/${patientId}`} >Medical History</Link>
                        <Link onClick={handleLogout}><i className="fas fa-sign-out-alt"></i><strong> Logout </strong></Link>
                    </div>
                </div>
            </nav>
            <div className="medical-records-container">
                <div className="records-box">
                    <h2 className="text-center">All Medical Records</h2>
                    {/*<h2 className="btn btn-primary ml-auto float-right"> Add Record</h2>*/}

                    <div className="appointment-search-bar">
                        <input
                            type="text"
                            placeholder="Search by appointment ID"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                        {nomedicalRecordsMessage && <p className="no-appointments-message">{nomedicalRecordsMessage}</p>}
                    </div>

                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Record ID</th>
                                <th scope="col">AppointmentID</th>
                                <th scope="col">Patient Name</th>
                                <th scope="col">Doctor Name</th>
                                <th scope="col">TreatmentPlan</th>
                                <th scope="col">CurrentSymptoms</th>
                                <th scope="col">Tests</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rendermedicalRecords.map(record => (
                                <tr key={record.recordId}>
                                    <td>{record.recordId}</td>
                                    <td>{record.appointmentId}</td>
                                    <td>{record.patientName}</td>
                                    <td>{record.doctorName}</td>
                                    <td>{record.treatmentPlan}</td>
                                    <td>{record.currentSymptoms}</td>
                                    <td>{record.recommendedTests}</td>
                                    <td>
                                        <Link to={`/view-record/${patientId}/${record.recordId}`} className="btn btn-info">
                                            View Prescription Details
                                        </Link>
                                        
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

export default MedicalRecords;
