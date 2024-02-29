// JavaScript source code
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import  "./ViewAllDoctors.css";

const Doctors = () => {
    const { patientId } = useParams();
    const [doctors, setDoctors] = useState([]);
    const [specialityFilter, setSpecialityFilter] = useState('');
    const [allSpecialities, setAllSpecialities] = useState([]); 
    const [showLinks, setShowLinks] = useState(false);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    

    
    useEffect(() => {
        fetchDoctors();
    }, [patientId]);

    const fetchDoctors = async () => {
        try {
            const response = await axios.get("http://localhost:5244/ViewAllDoctors");
            setDoctors(response.data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    const fetchAllSpecialities = async () => {
        try {
            // Fetch all specialities from your API
            const response = await axios.get("http://localhost:5244/GetAllSpecialities");
            setAllSpecialities(response.data);
        } catch (error) {
            console.error('Error fetching specialities:', error);
        }
    };

    const filterDoctors = () => {
        // Filter doctors based on speciality
        const filteredDoctors = doctors.filter(doctor => doctor.speciality.toLowerCase() === specialityFilter.toLowerCase());
        setDoctors(filteredDoctors);
    };

    const resetFilter = () => {
        // Reset the filter and fetch all doctors
        setSpecialityFilter('');
        fetchDoctors();
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to Logout?')) {
            window.location.href = "/";
        }
    }


    const toggleNavbar = () => {
        setShowLinks(!showLinks);
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = doctors.filter(doctor => {
            return doctor.doctorName.toLowerCase().includes(query) || doctor.doctorId.toString().includes(query);
        });
        setFilteredDoctors(filtered);
    };

    const renderDoctors = filteredDoctors.length > 0 ? filteredDoctors : doctors;
    const noDoctorMessage = filteredDoctors.length === 0 && searchQuery !== '';

    return (
        <div className="patient-page">
            <nav className="navbarr">
                <Link className="navbar-brand" to={`/patient-dashboard/${patientId}`}>
                    <img src="../images/logo-no-background.png" className="img-fluid" alt="AMAZLogo" width="200" height="200" />
                </Link>
                <div className="links">
                    <button className="toggle-button" onClick={toggleNavbar}>
                        &#9776;
                    </button>
                    <div className={`navbar-links ${showLinks ? "show" : ""}`}>
                        <Link to={`/doctors/${patientId}`}>Doctors</Link>
                        <Link to={`/appointments/${patientId}`}>MyAppointments</Link>
                        <Link to={`/medical-history/${patientId}`} >Medical History</Link>
                        <Link   onClick={handleLogout}><i className="fas fa-sign-out-alt"></i><strong> Logout </strong></Link>
                    </div>
                </div>
            </nav>
            <div className="doctor-container">
                <div className="doctors-box">
                    <h2 className="text-center">All Doctors Details</h2> {/*<h2 className="btn btn-primary ml-auto float-right"> Add Patient</h2>*/}


                    <div className="filter-container">
                        <label>Filter by Speciality:</label>

                        <select
                            value={specialityFilter}
                            onChange={(e) => setSpecialityFilter(e.target.value)}
                        >
                            <option value="">Select Speciality</option>
                            <option value="All">All Specialities</option>
                            <option value="Allergist">Allergist</option>
                            <option value="Anesthesiologist">Anesthesiologist</option>
                            <option value="Cardiologist">Cardiologist</option>
                            <option value="Dermatologist">Dermatologist</option>
                            <option value="Endocrinologist">Endocrinologist</option>
                            <option value="Gastroenterologist">Gastroenterologist</option>
                            <option value="Hematologist">Hematologist</option>
                            <option value="Infectious Disease Specialist">Infectious Disease Specialist</option>

                            <option value="Neurologist">Neurologist</option>
                            <option value="Obstetrician">Obstetrician</option>
                            <option value="Oncologist">Oncologist</option>
                            <option value="Ophthalmologist">Ophthalmologist</option>
                            <option value="Orthopedic Surgeon">Orthopedic Surgeon</option>
                            <option value="Otolaryngologist">Otolaryngologist</option>
                            <option value="Pathologist">Pathologist</option>
                            <option value="Pediatrician">Pediatrician</option>
                            <option value="Plastic Surgeon">Plastic Surgeon</option>
                            <option value="Psychiatrist">Psychiatrist</option>
                            <option value="Radiologist">Radiologist</option>

                            <option value="Surgeon">Surgeon</option>
                            {allSpecialities.map(speciality => (
                                <option key={speciality.id} value={speciality.name}>
                                    {speciality.name}
                                </option>
                            ))}
                        </select>
                        {/*<input*/}
                        {/*    type="text"*/}
                        {/*    value={specialityFilter}*/}
                        {/*    onChange={(e) => setSpecialityFilter(e.target.value)}*/}
                        {/*/>*/}
                        <button className="btn btn-primary" onClick={filterDoctors}>
                            Filter
                        </button>
                        <button className="btn btn-secondary" onClick={resetFilter}>
                            Reset
                        </button>
                    </div>

                    <div className="viewDoctorsearch-bar">
                        <input
                            type="text"
                            placeholder="Search by name or ID"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>

                    {noDoctorMessage && (
                        <p className="no-doctor-found">No doctors found with the entered ID or name.</p>
                    )}


                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Doctor ID</th>
                                <th scope="col">Name</th>
                                <th scope="col">Speciality</th>
                                <th scope="col">Experience</th>
                                <th scope="col">Qualification</th>
                                <th scope="col">Designation</th>
                               {/* <th scope="col">Username</th>*/}
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                      
                        <tbody>
                            {renderDoctors.map(doctor => (
                                    <tr key={doctor.doctorId}>
                                        <td>{doctor.doctorId}</td>
                                        <td>{doctor.doctorName}</td>
                                        <td>{doctor.speciality}</td>
                                        <td>{doctor.experience}</td>
                                        <td>{doctor.qualification}</td>
                                        <td>{doctor.designation}</td>
                                
                                        <td>

                                            <Link to={`/book-appointment/${patientId}/${doctor.doctorId}`} className="btn btn-info">
                                                Book Appointment
                                            </Link>
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

export default Doctors;