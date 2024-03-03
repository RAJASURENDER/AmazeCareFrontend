// JavaScript source code
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './MedicalRecord.css'; // Make sure to create a corresponding CSS file
import PatientNavbar from '../../NavBar/navbar-patient';
const token = sessionStorage.getItem('token');

const MedicalRecords = () => {
    const [medicalRecords, setMedicalRecords] = useState([]);
    const { patientId } = useParams();
    useEffect(() => {
        fetchMedicalRecords();
    }, [ patientId]);

    const fetchMedicalRecords = async () => {
        try {
            const response = await axios.get(`http://localhost:5244/ViewAllMedicalRecordsByPatientId?Id=${patientId}`, {
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

    return (
        <div className="medical-records-page">
            <PatientNavbar />
            <div className="medical-records-container">
                <div className="records-box">
                    <h2 className="text-center">All Medical Records</h2>
                    {/*<h2 className="btn btn-primary ml-auto float-right"> Add Record</h2>*/}

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
                            {medicalRecords.length > 0 ? (
                                medicalRecords.map(record => (
                                    <tr key={record.recordId}>
                                        <td>{record.recordId}</td>
                                        <td>{record.appointmentId}</td>
                                        <td>{record.patientName}</td>
                                        <td>{record.doctorName}</td>
                                        <td>{record.treatmentPlan}</td>
                                        <td>{record.currentSymptoms}</td>
                                        <td>{record.recommendedTests}</td>
                                        <td>
                                            <Link to={`/medical-history/${patientId}/view-record/${record.recordId}`} className="btn btn-info">
                                                View Prescription Details
                                            </Link>

                                        </td>
                                    </tr>
                                ))) : (
                                <tr>
                                    <td colSpan="8" className="text-center">No Medical Records found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MedicalRecords;
