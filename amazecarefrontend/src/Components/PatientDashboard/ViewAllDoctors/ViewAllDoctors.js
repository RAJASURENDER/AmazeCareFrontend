import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import PatientNavbar from '../../NavBar/navbar-patient';
const token = sessionStorage.getItem('token');

const Doctors = () => {
    const { patientId } = useParams();
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [specialityFilter, setSpecialityFilter] = useState('');
    const [allSpecialities, setAllSpecialities] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchDoctors();
    }, [patientId]);

    const fetchDoctors = async () => {
        try {
            const response = await axios.get("http://localhost:5244/ViewAllDoctors", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setDoctors(response.data);
            setFilteredDoctors(response.data); // Set the initial filtered doctors to all doctors
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    const fetchAllSpecialities = async () => {
        try {
            const response = await axios.get("http://localhost:5244/GetAllSpecialities");
            setAllSpecialities(response.data);
        } catch (error) {
            console.error('Error fetching specialities:', error);
        }
    };

    const filterDoctors = () => {
        const filteredDoctors = doctors.filter(doctor => doctor.speciality.toLowerCase() === specialityFilter.toLowerCase());
        setFilteredDoctors(filteredDoctors);
    };

    const resetFilter = () => {
        setSpecialityFilter('');
        setFilteredDoctors(doctors);
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

    return (
        <div className="patient-page">
            <PatientNavbar />

            <div className="patient-container">
                <div className="appointments-box">
                    <h2 className="text-center">All Doctors Details</h2>

                    <div className="filter-container">
                        <label>Filter by Speciality  </label>

                        <select
                            value={specialityFilter}
                            onChange={(e) => setSpecialityFilter(e.target.value)}>

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

                        <button className="btn btn-primary" onClick={filterDoctors}>
                            Filter
                        </button>
                        <button className="btn btn-secondary" onClick={resetFilter}>
                            Reset
                        </button>
                    </div>

                    <div className="appointment-search-bar">
                       
                        <input
                            type="text"
                            placeholder="Search by Doctor ID or Name"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
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

                                        <td>
                                            <Link to={`/book-appointment/${patientId}/${doctor.doctorId}`} className="btn btn-info">
                                                Book Appointment
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
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

export default Doctors;
