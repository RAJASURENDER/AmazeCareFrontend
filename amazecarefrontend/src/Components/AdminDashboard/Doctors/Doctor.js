
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Doctor.css';
import Navbar from '../../NavBar/navbar';
const token = sessionStorage.getItem('token');


const Doctor = () => {
    const [doctors, setDoctors] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredDoctors, setFilteredDoctors] = useState([]);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {

            const response = await axios.get("http://localhost:5244/ViewAllDoctors", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setDoctors(response.data);
            setFilteredDoctors(response.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };
    
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        if (query === '') {
            setFilteredDoctors(doctors);
        } else {
            const filtered = doctors.filter(doctor => doctor.doctorId.toString().includes(query) || doctor.doctorName.toLowerCase().includes(query));
            setFilteredDoctors(filtered);
        }
    };
    const handleDelete = async (doctorId) => {
        // Ask for confirmation from the user
        const confirmDelete = window.confirm("Are you sure you want to delete this doctor?");

        // If user confirms deletion
        if (confirmDelete) {
            try {
                const token = sessionStorage.getItem('token');
                await axios.delete(`http://localhost:5244/DeleteDoctor?id=${doctorId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                fetchDoctors();
            } catch (error) {
                console.error('Error deleting doctor:', error);
            }
        }
    };

    return (
        <div className="doctor-page">
            <Navbar />
            <div className="doctor-container">
                <div className="doctors-box">
                    <h2 className="text-center ">All Doctors Details</h2>
                    <div className="appointment-search-bar row">
                       <input 
                           type="text"
                           className='col-10 '
                           
                           placeholder="Search by Doctor ID or Name"
                           value={searchQuery}
                           onChange={handleSearch}/>
                           <Link to="/addDoctor" className="btn btn-primary addlink col-2 ">Add Doctor</Link>
                       
                   </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Doctor ID</th>
                                <th scope="col">Name</th>
                                <th scope="col">Speciality</th>
                                <th scope="col">Experience</th>
                                <th scope="col">Qualification</th>
                                <th scope="col">Designation</th>
                                <th scope="col">Username</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDoctors.length > 0 ? (
                                filteredDoctors.map(doctor => (
                                    <tr key={doctor.doctorId}>
                                        <td>{doctor.doctorId}</td>
                                        <td>{doctor.doctorName}</td>
                                        <td>{doctor.speciality}</td>
                                        <td>{doctor.experience}</td>
                                        <td>{doctor.qualification}</td>
                                        <td>{doctor.designation}</td>
                                        <td>{doctor.username}</td>
                                        <td className='button-container'>

                                            <Link to={`/updateDoctor/${doctor.doctorId}`} className="btn btn-info">Update</Link>
                                            <Link className="btn btn-danger" onClick={() => handleDelete(doctor.doctorId)}>Delete</Link>
                                        </td>
                                    </tr>
                                ))) : (
                                <tr>
                                    <td colSpan="8" className="text-center">No Doctors found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Doctor;