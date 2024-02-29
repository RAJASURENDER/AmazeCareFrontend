import React, { useState, useEffect } from 'react';
import { useParams,Link } from 'react-router-dom';
import axios from 'axios';

const ViewPrescriptionDetails = () => {
    const { patientId,recordId } = useParams();
    const [prescriptions, setPrescriptions] = useState([]);
    const [showLinks, setShowLinks] = useState(false);

    useEffect(() => {
        fetchPrescriptionDetails(recordId);
    }, [patientId,recordId]);

    const fetchPrescriptionDetails = async (recordId) => {
        try {
            const response = await axios.get(`http://localhost:5244/ViewPrescriptionByRecordId?recordId=${recordId}`);
            setPrescriptions(response.data);
        } catch (error) {
            console.error('Error fetching prescription details:', error);
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
        <div className="medical-records-page">
            <nav className="navbarr">
                <Link className="navbar-brand" to={`/patient-dashboard/${patientId}`}>
                    <img src="../../images/logo-no-background.png" className="img-fluid" alt="AMAZLogo" width="200" height="200" />
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
                              {/*  <th scope="col">Actions</th>*/}
                            </tr>
                        </thead>
                        <tbody>
                            {prescriptions.map(prescription => (
                                <tr key={prescription.prescriptionId}>
                                    <td>{prescription.recordId}</td>
                                    <td>{prescription.prescriptionId}</td>

                                    <td>{prescription.medicine}</td>
                                    <td>{prescription.instructions}</td>
                                    <td>{prescription.dosage}</td>
                                    {/*<td>*/}
                                    {/*    <Link to={`/`} className="btn btn-info">*/}
                                    {/*        View Prescription Details*/}
                                    {/*    </Link>*/}
                                    {/*</td>*/}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ViewPrescriptionDetails;
