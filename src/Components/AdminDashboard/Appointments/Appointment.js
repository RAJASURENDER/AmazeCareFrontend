import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Appointment.css';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function utcToIst(utcDateString) {
    const utcDate = new Date(utcDateString);
    const istTime = utcDate.getTime() + (5.5 * 60 * 60 * 1000);
    const istDate = new Date(istTime);
    return istDate.toISOString();
}

const Appointment = () => {
    const [appointments, setAppointments] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [showLinks, setShowLinks] = useState(false);
    const [selectedDateTime, setSelectedDateTime] = useState(new Date());
    const [showDateTimePicker, setShowDateTimePicker] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [noAppointmentsMessage, setNoAppointmentsMessage] = useState('');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await axios.get("http://localhost:5244/api/Appointment/ViewAllTheAppointments");
            const appointmentsWithNames = await Promise.all(response.data.map(async appointment => {
                const doctorResponse = await axios.get(`http://localhost:5244/ViewDoctorById?id=${appointment.doctorId}`);
                const patientResponse = await axios.get(`http://localhost:5244/ViewPatientById?id=${appointment.patientId}`);
                appointment.doctorName = doctorResponse.data.doctorName;
                appointment.patientName = patientResponse.data.patientName;
                return appointment;
            }));
            setAppointments(appointmentsWithNames);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const handleCancel = async (appointmentId) => {
        const confirmCancel = window.confirm("Are you sure you want to cancel this appointment?");
        if (confirmCancel) {
            try {
                await axios.put(`http://localhost:5244/StatusToCancelAppointment?id=${appointmentId}`);
                fetchAppointments();
            } catch (error) {
                console.error('Error cancelling appointment:', error);
            }
        }
    };

    useEffect(() => {
        if (selectedStatus) {
            const filtered = appointments.filter(appointment => appointment.status === selectedStatus);
            setFilteredAppointments(filtered);
        } else {
            setFilteredAppointments(appointments);
        }
    }, [appointments, selectedStatus]);

    const handleFilterChange = (status) => {
        setSelectedStatus(status);
    };

    const handleRescheduleDoctor = async (appointmentId) => {
        try {
            const confirmReschedule = window.confirm("Are you sure you want to reschedule the doctor?");
            if (confirmReschedule) {
                let newDoctorId = prompt("Enter the new Doctor ID:");
                if (newDoctorId !== null) {
                    // Validate if the entered doctor ID exists in the database
                    const doctorExists = await validateDoctorExists(newDoctorId);
                    if (doctorExists) {
                        // Make API call to update the doctor ID for the appointment
                        await axios.put(`http://localhost:5244/UpdateDoctorIdInAppointments`, {
                            id: appointmentId,
                            doctorId: newDoctorId
                        });
                        // Fetch updated appointments
                        fetchAppointments();
                        await axios.put(`http://localhost:5244/StatusToRescheduleAppointment?id=${appointmentId}`);
                    } else {
                        alert("No such doctor exists with the given ID. Please enter a valid doctor ID.");
                    }
                }
            }
        } catch (error) {
            console.error('Error rescheduling doctor:', error);
            alert("An unexpected error occurred while rescheduling the doctor.");
        }
    };

    const validateDoctorExists = async (doctorId) => {
        try {
            const response = await axios.get(`http://localhost:5244/ViewDoctorById?id=${doctorId}`);
            return !!response.data; // Return true if the doctor exists, false otherwise
        } catch (error) {
            console.error('Error validating doctor:', error);
            return false; // Assume doctor does not exist if there's an error
        }
    };


    const handleRescheduleDateTime = async (appointmentId) => {
        const confirmReschedule = window.confirm("Are you sure you want to reschedule the appointment date?");
        if (confirmReschedule) {
            setShowDateTimePicker(true);
            setSelectedAppointment(appointmentId);
        }
    };

    const handleConfirmDateTime = async () => {

        try {
            await axios.put(`http://localhost:5244/RescheduleAppointment`, {
                id: selectedAppointment,
                appointmentDate: utcToIst(selectedDateTime.toISOString())
            });
            fetchAppointments();
            setShowDateTimePicker(false);
            await axios.put(`http://localhost:5244/StatusToRescheduleAppointment?id=${selectedAppointment}`);
        } catch (error) {
            console.error('Error rescheduling date-time:', error);
            alert("An unexpected error occurred while rescheduling the appointment date-time.");
        }
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure  you want to log out?')) {
            window.location.href = '/';
        }
    }

    const toggleNavbar = () => {
        setShowLinks(!showLinks);
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = appointments.filter(appointment => appointment.appointmentId.toString().includes(query));
        setFilteredAppointments(filtered);
        if (filtered.length === 0 && query !== '') {
            setNoAppointmentsMessage('No appointments found with the entered ID.');
        } else {
            setNoAppointmentsMessage('');
        }
    };

    let renderAppointments = filteredAppointments.length > 0 ? filteredAppointments : appointments;

    // Sort appointments by appointment date in decreasing order
    renderAppointments.sort((a, b) => new Date(b.appointmentId) - new Date(a.appointmentId));

    return (
        <div className="appointment-page">
            <nav className="navbarr">
                <a className="navbar-brand" href="/admin-dashboard">
                    <img src="images/logo-no-background.png" className="img-fluid" alt="AMAZLogo" width="200" height="200" />
                </a>
                <div className="links">
                    <button className="toggle-button" onClick={toggleNavbar}>
                        &#9776;
                    </button>
                    <div className={`navbar-links ${showLinks ? "show" : ""}`}>
                        <Link to="/toDoctors">Doctors</Link>
                        <Link to="/toAdminViewAppointments">Appointments</Link>
                        <Link to="/toPatientInfoAdmin">Patients</Link>
                        <Link onClick={handleLogout}><i className="fas fa-sign-out-alt"></i><strong> Logout </strong></Link>
                    </div>
                </div>
            </nav>
            <div className="doctor-container">
                <div className="doctors-box">
                    <h2 className="text-center"><strong>All Appointments</strong></h2>
                    <div className="filter-dropdown">
                        <label htmlFor="statusFilter">Filter by Status:</label>
                        <select id="statusFilter" value={selectedStatus} onChange={(e) => handleFilterChange(e.target.value)}>
                            <option value="">All</option>
                            <option value="Rescheduled">Rescheduled</option>
                            <option value="Upcoming">Upcoming</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    <div className="appointment-search-bar">
                        <input
                            type="text"
                            placeholder="Search by appointment ID"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                        {noAppointmentsMessage && <p className="no-appointments-message">{noAppointmentsMessage}</p>}
                    </div>

                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Appointment ID</th>
                                <th scope="col">Doctor Name</th>
                                <th scope="col">Patient Name</th>
                                <th scope="col">Appointment Date</th>
                                <th scope="col">Symptoms Description</th>
                                <th scope="col">Status</th>
                                <th scope="col">Nature of Visit</th>
                                <th scope="col"></th>
                                <th scope="col">Actions</th>
                                <th scope="col"></th>

                            </tr>
                        </thead>
                        <tbody>
                            {renderAppointments.map(appointment => (
                                <tr key={appointment.appointmentId}>
                                    <td>{appointment.appointmentId}</td>
                                    <td>{appointment.doctorName}</td>
                                    <td>{appointment.patientName}</td>
                                    <td>{new Date(appointment.appointmentDate).toLocaleString()}</td>
                                    <td>{appointment.symptomsDescription}</td>
                                    <td>{appointment.status}</td>
                                    <td>{appointment.natureOfVisit}</td>
                                    <td>
                                        {appointment.status !== "Cancelled" && (
                                            <>
                                                <button className="btn btn-info" onClick={() => handleRescheduleDoctor(appointment.appointmentId)}>Reschedule Doctor</button>
                                            </>
                                        )}
                                    </td>
                                    <td>
                                        {appointment.status !== "Cancelled" && (
                                            <>
                                                <button className="btn btn-info" onClick={() => handleRescheduleDateTime(appointment.appointmentId)}>Reschedule Date</button>
                                            </>
                                        )}
                                    </td>
                                    <td>
                                        {appointment.status !== "Cancelled" && (
                                            <>
                                                <button className="btn btn-danger" onClick={() => handleCancel(appointment.appointmentId)}>Cancel Appointment</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {showDateTimePicker && (
                <div className="date-time-picker-container">
                    <DatePicker
                        selected={selectedDateTime}
                        onChange={date => setSelectedDateTime(date)}
                        showTimeSelect
                        showTimezone
                        dateFormat="yyyy-MM-dd HH:mm zzz"
                    />
                    <button onClick={handleConfirmDateTime}>Confirm</button>
                </div>
            )}

        </div>
    );
};

export default Appointment;