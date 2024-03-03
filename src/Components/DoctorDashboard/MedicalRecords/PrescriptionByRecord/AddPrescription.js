import React, { useState } from 'react';
import axios from 'axios';
import { useParams,Link,useNavigate } from 'react-router-dom';



const CreatePrescription = () => {
    const { doctorId,recordId } = useParams();
    const [medicine, setMedicine] = useState('');
    const [instructions, setInstructions] = useState('');
    const [dosage, setDosage] = useState('');
    const [showLinks, setShowLinks] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5244/api/Prescription/AddPrescription", {
                recordId,
                medicine,
                instructions,
                dosage
            });

            console.log('Prescription created successfully:', response.data);
            alert("Prescription Created Successfully!");
            navigate(`/medicalhistory/${doctorId}`);

        } catch (error) {
            console.error('Error creating prescription:', error);

            alert("Error in Creating Prescription");
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
        <div className="Update-Doctor">
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

            <div className="Update-Container">
                <div className="divUpdate ">
                    <h1 className="update-h1"><strong>Create Prescription</strong></h1>


                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label><i className="fa-solid fa-tablets"></i> Medicine</label>
                            <input
                                type="text"
                                className="form-control"
                                value={medicine}
                                onChange={(e) => setMedicine(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label><i className="fa-solid fa-receipt"></i> Instructions</label>
                            <input
                                type="text"
                                className="form-control"
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label><i className="fa-solid fa-scale-balanced"></i> Dosage</label>
                            <input
                                type="text"
                                className="form-control"
                                value={dosage}
                                onChange={(e) => setDosage(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="register-button">Create Prescription</button>
                    </form>
                </div>
            </div>

        </div>

    );
};

export default CreatePrescription;
