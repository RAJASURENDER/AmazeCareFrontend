// JavaScript source code
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams,Link ,useNavigate} from 'react-router-dom';


const UpdatePrescriptions = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const { doctorId,recordId } = useParams();
    const [showLinks, setShowLinks] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        fetchPrescriptions();
    }, []);

    const fetchPrescriptions = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5244/ViewPrescriptionByRecordId?recordId=${recordId}`);
            setPrescriptions(response.data.map(prescription => ({ ...prescription })));
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
        }
        setLoading(false);
    };

    const handleInputChange = useCallback((e, index, field) => {
        const updatedPrescriptions = [...prescriptions];
        updatedPrescriptions[index][field] = e.target.value;
        setPrescriptions(updatedPrescriptions);
    }, [prescriptions]);

    const handleUpdate = async (index) => {
        try {
            const updatedPrescription = prescriptions[index];
            const response = await axios.put(`http://localhost:5244/UpdatewholePrescription`, updatedPrescription);
            if (response.status === 200) {
                alert('Prescription updated successfully!');
                fetchPrescriptions();
                navigate(`/medicalhistory/${doctorId}`);
            } else {
                console.error('Error updating prescription:', response);
            }
        } catch (error) {
            console.error('Error updating prescription:', error.response?.data || error.message);
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
                    <img src="../../images/logo-no-background.png" className="img-fluid" alt="AMAZLogo" width="200" height="200" />
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
                    <h2 className="text-center">Update Prescriptions</h2>

                    <table className="table">
                        <thead>
                            <tr>
                                <th>Prescription ID</th>
                                <th>Record ID</th>
                                <th>Medicine</th>
                                <th>Instructions</th>
                                <th>Dosage</th>
                                <th>Confirm</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prescriptions.map((prescription, index) => (
                                <tr key={index}>
                                    <td>
                                        <input
                                            className='Update-data'
                                            value={prescription.prescriptionId}
                                            onChange={(e) => handleInputChange(e, index, 'prescriptionId')}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            className='Update-data'
                                            value={prescription.recordId}
                                            onChange={(e) => handleInputChange(e, index, 'recordId')}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            className='Update-data'
                                            value={prescription.medicine}
                                            onChange={(e) => handleInputChange(e, index, 'medicine')}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            className='Update-data'
                                            value={prescription.instructions}
                                            onChange={(e) => handleInputChange(e, index, 'instructions')}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            className='Update-data'
                                            value={prescription.dosage}
                                            onChange={(e) => handleInputChange(e, index, 'dosage')}
                                        />
                                    </td>
                                    <td>

                                        <button className="btn btn-primary " onClick={() => handleUpdate(index)}>
                                            Confirm
                                        </button>


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

export default UpdatePrescriptions;

