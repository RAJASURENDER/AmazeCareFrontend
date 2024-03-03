import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../PatientDashboard/ViewAppointments/ViewAppointments.css';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams , Link} from 'react-router-dom';

function utcToIst(utcDateString) {
    const utcDate = new Date(utcDateString);
    const istTime = utcDate.getTime() + (5.5 * 60 * 60 * 1000); 
    const istDate = new Date(istTime);
    return istDate.toISOString();
}

const DAppointment = () => {

    const { doctorId } = useParams();
    console.log('Doctor ID:', doctorId);

    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('');

    const [selectedDateTime, setSelectedDateTime] = useState(new Date());
    const [showDateTimePicker, setShowDateTimePicker] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showLinks, setShowLinks] = useState(false);

    useEffect(() => {
        fetchAppointments();
    }, [doctorId]);

    const fetchAppointments = async () => {
        try {
            console.log("cehckkskgdh,doctorId")
            const response = await axios.get(`http://localhost:5244/ViewAppointmentsByDoctorId?doctorId=${doctorId}`);
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const handleCancel = async (appointmentId) => {
        // Ask for confirmation from the user
        const confirmCancel = window.confirm("Are you sure you want to cancel this appointment?");

        // If user confirms cancellation
        if (confirmCancel) {
            try {
                // Send a request to update the appointment status to "Cancelled"
                await axios.put(`http://localhost:5244/StatusToCancelAppointment?id=${appointmentId}`);

                // Fetch updated appointments
                fetchAppointments();
            } catch (error) {
                console.error('Error cancelling appointment:', error);
            }
        }
    };

    useEffect(() => {
        // Filter appointments based on selected status
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
            setShowDateTimePicker(true); // Show the date-time picker
            setSelectedAppointment(appointmentId); // Set the selected appointment ID
        }
    };

    const handleConfirmDateTime = async () => {

        try {
            await axios.put(`http://localhost:5244/RescheduleAppointment`, {
                id: selectedAppointment,
                appointmentDate: utcToIst(selectedDateTime.toISOString())  // Convert to I
            });
            fetchAppointments();
            setShowDateTimePicker(false); // Hide the date-time picker after confirmation
        } catch (error) {
            console.error('Error rescheduling date-time:', error);
            alert("An unexpected error occurred while rescheduling the appointment date-time.");
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
        <div className="appointment-page">
            <nav className="navbarr">
                <a className="navbar-brand" href="/toDoctors">
                    <img src="../images/logo-no-background.png" className="img-fluid" alt="AMAZLogo" width="200" height="200" />
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
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Appointment ID</th>
                            
                                <th scope="col">Patient Name</th>
                                <th scope="col">Appointment Date</th>
                                <th scope="col">Symptoms Description</th>
                                <th scope="col">Status</th>
                          
                                <th scope="col">Actions</th>
                               
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAppointments.map(appointment => (
                                <tr key={appointment.appointmentId}>
                                    <td>{appointment.appointmentId}</td>
                             
                                    <td>{appointment.patientName}</td>
                                    <td>{appointment.appointmentDate}</td>
                                    <td>{appointment.symptoms}</td>
                                    <td>{appointment.status}</td>
                                  
                                    <td>
                                        {appointment.status !== "Cancelled" && (
                                            <>
                                                <button className="btn btn-danger" onClick={() => handleCancel(appointment.appointmentId)}>Cancel</button>
                                                <button className="btn btn-info" onClick={() => handleRescheduleDoctor(appointment.appointmentId)}>Reschedule Doctor</button>
                                                <button className="btn btn-info" onClick={() => handleRescheduleDateTime(appointment.appointmentId)}>Reschedule Date</button>
                                                <Link className="btn btn-primary" to={`/generate-medical-record/${appointment.appointmentId}/${doctorId}`}>Generate Medical Records</Link>
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

export default DAppointment;