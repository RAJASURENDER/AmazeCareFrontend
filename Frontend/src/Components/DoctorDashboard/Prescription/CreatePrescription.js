import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../Register/Register.css';
import Navbar from '../../NavBar/navbar-doctor';

const token = sessionStorage.getItem('token');


const CreatePrescription = () => {
    const { recordId } = useParams();
    const [medicine, setMedicine] = useState('');
    const [instructions, setInstructions] = useState('');
    const [dosage, setDosage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:5244/api/Prescription/AddPrescription`, {
                recordId,
                medicine,
                instructions,
                dosage
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            console.log('Prescription created successfully:', response.data);
            alert("Prescription Created Successfully!");
            window.location.href = "/medicalhistory";
            
        } catch (error) {
            console.error('Error creating prescription:', error);
            
            alert("Error in Creating Prescription");
        }
    };

    return (
        <div className="register-page">
            
            <Navbar/>

            <div className="register-container">
                <div className="alert alert-success divregister ">
                    <h1 className="heading-tag-h1"><strong>Create Prescription</strong></h1>


                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label><i class="fa-solid fa-tablets"></i> Medicine</label>
                            <input
                                type="text"
                                className="form-control"
                                value={medicine}
                                onChange={(e) => setMedicine(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label><i class="fa-solid fa-receipt"></i> Instructions</label>
                            <input
                                type="text"
                                className="form-control"
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label><i class="fa-solid fa-scale-balanced"></i> Dosage</label>
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
