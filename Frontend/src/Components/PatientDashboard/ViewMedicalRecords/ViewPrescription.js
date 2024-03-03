import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import PatientNavbar from '../../NavBar/navbar-patient';
const token = sessionStorage.getItem('token');

const ViewPrescriptionDetails = () => {
    const { recordId } = useParams();
    const [prescriptions, setPrescriptions] = useState([]);

    useEffect(() => {
        fetchPrescriptionDetails(recordId);
    }, [recordId]);

    const fetchPrescriptionDetails = async (recordId) => {
        try {
            const response = await axios.get(`http://localhost:5244/ViewPrescriptionByRecordId?recordId=${recordId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPrescriptions(response.data);
        } catch (error) {
            console.error('Error fetching prescription details:', error);
        }
    };

    return (
        <div className="medical-records-page">
            <PatientNavbar/>
            <div className="medical-records-container">
                <div className="records-box">
                    <h2 className="text-center">All Prescriptions</h2>
                    {/*<h2 className="btn btn-primary ml-auto float-right"> Add Record</h2>*/}

                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Record ID</th>
                                <th scope="col">PrescriptionID</th>

                                <th scope="col">Medicine</th>
                                <th scope="col">Instructions</th>
                                <th scope="col">Dosage</th>
                                {/* <th scope="col">Actions</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {prescriptions.length > 0 ? (
                                prescriptions.map(prescription => (
                                <tr key={prescription.prescriptionId}>
                                    <td>{prescription.recordId}</td>
                                    <td>{prescription.prescriptionId}</td>

                                    <td>{prescription.medicine}</td>
                                    <td>{prescription.instructions}</td>
                                    <td>{prescription.dosage}</td>
                                    {/* <td>
                                        <Link to={`/`} className="btn btn-info">
                                            View Prescription Details
                                        </Link>
                                    </td> */}
                                </tr>
                            ))) : (
                                <tr>
                                    <td colSpan="8" className="text-center">No Prescriptions found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ViewPrescriptionDetails;
