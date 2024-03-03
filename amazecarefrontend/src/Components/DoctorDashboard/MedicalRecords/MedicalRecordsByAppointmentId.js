import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../AdminDashboard/Patient/Patient.css';
import Navbar from '../../NavBar/navbar-doctor';
const token = sessionStorage.getItem('token');


const Patient = () => {
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState('');
    const {doctorId} = useParams();
    useEffect(() => {
        fetchAllMedicalRecords();
    }, []);

    const fetchAllMedicalRecords = async () => {
        try {
            const response = await axios.get("http://localhost:5244/ViewAllMedicalRecords", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const recordsData = response.data;

            // Fetch additional details for each medical record
            const recordsWithDetails = await Promise.all(
                recordsData.map(async (record) => {
                    // Fetch appointment details
                    const appointmentResponse = await axios.get(`http://localhost:5244/ViewAppointmentByAppointmentId?id=${record.appointmentId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const appointmentData = appointmentResponse.data;

                    // Fetch patient details
                    const patientResponse = await axios.get(`http://localhost:5244/ViewPatientById?id=${appointmentData.patientId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const patientData = patientResponse.data;

                    // Fetch doctor details
                    const doctorResponse = await axios.get(`http://localhost:5244/ViewDoctorById?id=${appointmentData.doctorId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
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
            const response = await axios.get(`http://localhost:5244/ViewMedicalRecordByAppointmentId?Id=${selectedAppointmentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
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

    return (
        <div className="patient-page">
            <Navbar />
            <div className="patient-container">
                <div className="appointments-box">
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
                            {medicalRecords.length > 0 ? (
                                medicalRecords.map(record => (
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
                                                <Link to={`/medicalhistory/${doctorId}/create-prescription/${record.recordId}`} className="btn btn-info">Create</Link>
                                                <Link to={`/medicalhistory/${doctorId}/update-prescription/${record.recordId}`} className="btn btn-warning">Update</Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))) : (
                                <tr>
                                    <td colSpan="8" className="text-center">No medical Records found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Patient;
