import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link component from react-router-dom
import axios from 'axios'; // Import axios for HTTP requests
import './Patient.css'; // Import CSS file for styling
import Navbar from '../../NavBar/navbar';
const token = sessionStorage.getItem('token');  // Get the user's token from session

const Patient = () => {
    const [patients, setPatients] = useState([]); // State to store patients data
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPatients, setFilteredPatients] = useState([]);

    useEffect(() => {
        fetchPatients(); // Call fetchPatients() when component mounts
    }, []);

    // Function to fetch all patients from the server
    const fetchPatients = async () => {
        try {
            const response = await axios.get("http://localhost:5244/ViewAllPatients", // GET request to fetch patients
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

            setPatients(response.data); // Set patients state with the data received from the server
            setFilteredPatients(response.data); // for filtered data
        } catch (error) {
            console.error('Error fetching patients:', error); // Log error if request fails
        }
    };
    // function handles the search bar of patient
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        if (query === '') {
            setFilteredPatients(patients);
        } else {
            const filtered = patients.filter(patient => patient.patientId.toString().includes(query) || patient.patientName.toLowerCase().includes(query));
            setFilteredPatients(filtered);
        }
    };


    // Function to handle deletion of a patient
    const handleDelete = async (patientId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this patient?');
        if (!confirmDelete) {
            return; // Do nothing if user cancels deletion
        }

        try {
            await axios.delete(`http://localhost:5244/api/Patient/DeletePatient?id=${patientId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }); // DELETE request to delete patient
            fetchPatients(); // Fetch patients again to update the list after deletion
        } catch (error) {
            console.error('Error deleting patient:', error); // Log error if deletion fails
        }
    };

    return (
        <div className="patient-page">
            {/* Navbar */}
            <Navbar />
            <div className="patient-container">
                <div className="appointments-box">
                    {/* Heading and Add Patient button */}
                    <h2 className="text-center">All Patients Details</h2>
                    {/* search box for patient */}
                    <div className="appointment-search-bar row">
                       <input 
                           type="text"
                           className='col-10'
                           placeholder="Search by Patient ID or Name"
                           value={searchQuery}
                           onChange={handleSearch}/>
                        
                           <Link to="/addPatient" className="btn btn-primary addlink col-2 ">Add Patient</Link>
                    
                   </div>
                    {/* Table to display patients data */}
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
                            {/* Map over patients array to display each patient's data */}
                            {filteredPatients.length > 0 ? (
                                filteredPatients.map(patient => (
                                    <tr key={patient.patientId}>
                                        <td>{patient.patientId}</td>
                                        <td>{patient.patientName}</td>
                                        <td>{patient.age}</td>
                                        <td>{patient.gender}</td>
                                        <td>{new Date(patient.dateOfBirth).toLocaleDateString()}</td>
                                        <td>{patient.contactNumber}</td>
                                        <td>{patient.username}</td>
                                        <td>
                                            {/* Update and Delete buttons */}
                                            <div className="button-container">
                                                <Link to={`/updatePatient/${patient.patientId}`} className="btn btn-info">Update</Link>
                                                <button className="btn btn-danger" onClick={() => handleDelete(patient.patientId)}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))) : (
                                <tr>
                                    <td colSpan="8" className="text-center">No Patients found</td>
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
