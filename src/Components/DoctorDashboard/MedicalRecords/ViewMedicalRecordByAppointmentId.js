// JavaScript source code

import React, { useState, useEffect } from 'react';
import { useParams , Link } from 'react-router-dom';
import axios from 'axios';
// import '../../AdminDashboard/Patient/Patient.css';

const MedicalRecordByAppointment = () => {
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState('');
    const [showLinks, setShowLinks] = useState(false);

    const { appointmentId, doctorId } = useParams();

    useEffect(() => {
        fetchAllMedicalRecords();
    }, [doctorId], [appointmentId]);

    const fetchAllMedicalRecords = async () => {
        try {
            const response = await axios.get(`http://localhost:5244/ViewAllMedicalRecordsByDoctorId?doctorId=${doctorId}`);
            const recordsData = response.data;

            // Fetch additional details for each medical record
            const recordsWithDetails = await Promise.all(
                recordsData.map(async (record) => {
                    // Fetch appointment details
                    const appointmentResponse = await axios.get(`http://localhost:5244/ViewAppointmentByAppointmentId?id=${record.appointmentId}`);
                    const appointmentData = appointmentResponse.data;

                    // Fetch patient details
                    const patientResponse = await axios.get(`http://localhost:5244/ViewPatientById?id=${appointmentData.patientId}`);
                    const patientData = patientResponse.data;

                    // Fetch doctor details
                    const doctorResponse = await axios.get(`http://localhost:5244/ViewDoctorById?id=${appointmentData.doctorId}`);
                    const doctorData = doctorResponse.data;

                    return {
                        ...record,
                        patientName: patientData.patientName,
                        doctorName: doctorData.doctorName,
                    };
                })
            );

            setMedicalRecords(recordsWithDetails);
        } catch (error) {
            console.error('Error fetching medical records:', error);
        }
    };

    const fetchMedicalRecordsByAppointmentId = async () => {
        try {
            const response = await axios.get(`http://localhost:5244/ViewMedicalRecordByAppointmentId?Id=${selectedAppointmentId}`);
            setMedicalRecords(response.data);
        } catch (error) {
            console.error('Error fetching medical records:', error);
        }
    };

    const handleFetchMedicalRecords = () => {
        if (selectedAppointmentId.trim() !== '') {
            fetchMedicalRecordsByAppointmentId(); // Call fetchMedicalRecordsByAppointmentId if an ID is entered
        } else {
            fetchAllMedicalRecords(); // Otherwise, fetch all medical records
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

    return (
        <div className="patient-page">
            <nav className="navbarr">
                <a className="navbar-brand" href="/toDoctors">
                    <img src="../images/logo-no-background.png" className="img-fluid" alt="AMAZLogo" width="200" height="200" />
                </a>
                <div className="links">
                    <button className="toggle-button" onClick={toggleNavbar}>
                        &#9776;
                    </button>
                    <div className={`navbar-links ${showLinks ? "show" : ""}`}>
                        <Link to={`/doctorappointment/${doctorId}`} >View  Appointments</Link>
                        <Link to={`/medicalhistory/${doctorId}`}>Medical History</Link>

                        <Link onClick={handleLogout}><i className="fas fa-sign-out-alt"></i><strong> Logout </strong></Link>
                    </div>
                </div>
            </nav>
            <div className="doctor-container">
                <div className="doctors-box">
                    <h2 className="text-center">Medical Records</h2>
                    <div className="fetch-medical-records">
                        <input
                            type="number"
                            value={selectedAppointmentId}
                            onChange={(e) => setSelectedAppointmentId(e.target.value)}
                            placeholder="Enter Appointment ID"
                        />

                        <button className="btn btn-primary getrecords" onClick={handleFetchMedicalRecords}>Get Records</button>
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Record ID</th>
                                <th scope="col">Patient Name</th>
                                <th scope="col">Doctor Name</th>
                                <th scope="col">Current Symptoms</th>
                                <th scope="col">Physical Examination</th>
                                <th scope="col">Treatment Plan</th>
                                <th scope="col">Recommended Tests</th>
                                <th scope="col">Appointment ID</th>
                                <th scope="col">Prescription</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicalRecords.map(record => (
                                <tr key={record.recordId}>
                                    <td>{record.recordId}</td>
                                    <td>{record.patientName}</td>
                                    <td>{record.doctorName}</td>
                                    <td>{record.currentSymptoms}</td>
                                    <td>{record.physicalExamination}</td>
                                    <td>{record.treatmentPlan}</td>
                                    <td>{record.recommendedTests}</td>
                                    <td>{record.appointmentId}</td>
                                    <td>
                                        {/* Update and Delete buttons */}
                                        <div className="button-container">
                                            <Link to={`/create-prescription/${record.recordId}/${doctorId}`} className="btn btn-info">Create</Link>
                                            <Link to={`/update-prescription/${record.recordId}/${doctorId}`} className="btn btn-warning">Update</Link>
                                        </div>
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

export default MedicalRecordByAppointment;