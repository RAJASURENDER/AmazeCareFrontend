// JavaScript source code
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../NavBar/navbar-patient';
import { useParams, Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const token = sessionStorage.getItem('token');

function utcToIst(utcDateString) {
    const utcDate = new Date(utcDateString);
    const istTime = utcDate.getTime() + (5.5 * 60 * 60 * 1000); // Add 5 hours and 30 minutes (5.5 hours) to convert from UTC to IST
    const istDate = new Date(istTime);
    return istDate.toISOString();
}

const PAppointment = () => {
    const { patientId } = useParams();

    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('');

    const [selectedDateTime, setSelectedDateTime] = useState(new Date());
    const [showDateTimePicker, setShowDateTimePicker] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [noAppointmentsMessage, setNoAppointmentsMessage] = useState('');

    useEffect(() => {

        fetchAppointments();
    }, [patientId]);

    const fetchAppointments = async () => {
        try {

            const response = await axios.get(`http://localhost:5244/ViewAppointmentsByPatientId?patientId=${patientId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
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


    const handleCancel = async (appointmentId) => {
        // Ask for confirmation from the user
        const confirmCancel = window.confirm("Are you sure you want to cancel this appointment?");

        // If user confirms cancellation
        if (confirmCancel) {
            try {
                // Send a request to update the appointment status to "Cancelled"
                await axios.put(`http://localhost:5244/StatusToCancelAppointment?id=${appointmentId}`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

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



    const validateDoctorExists = async (doctorId) => {
        try {
            const response = await axios.get(`http://localhost:5244/ViewDoctorById?id=${doctorId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
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
        const now = new Date();
        if (selectedDateTime < now) {
            alert("Please select a future time for rescheduling.");
            return;
        }
        try {
            await axios.put(`http://localhost:5244/RescheduleAppointment`, {
                id: selectedAppointment,
                appointmentDate: utcToIst(selectedDateTime.toISOString())  // Convert to IST
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });


            // Update the status to "Rescheduled"
            await axios.put(`http://localhost:5244/StatusToRescheduleAppointment?id=${selectedAppointment}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchAppointments();
            setShowDateTimePicker(false); // Hide the date-time picker after confirmation
            alert("Appointment has been Rescheduled");
        } catch (error) {
            console.error('Error rescheduling date-time:', error);
            alert("An unexpected error occurred while rescheduling the appointment date-time.");
        }
    };

    return (
        <div className="appointment-page">
            <Navbar />
            <div className="doctor-container">
                <div className="doctors-box">
                    <h2 className="text-center"><strong>All Appointments</strong></h2>
                    <div className="filter-dropdown">
                        <label htmlFor="statusFilter">Filter by Status:</label>
                        <select id="statusFilter" value={selectedStatus} onChange={(e) => handleFilterChange(e.target.value)}>
                            <option value="">All</option>
                            <option value="Rescheduled">Rescheduled</option>
                            <option value="upcoming">Upcoming</option>
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
                        {/* {noAppointmentsMessage && <p className="no-appointments-message">{noAppointmentsMessage}</p>} */}
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
                                <th scope="col">Reschedule</th>
                                <th scope="col">Cancel</th>

                            </tr>
                        </thead>
                        <tbody>
                            {filteredAppointments.length > 0 ? (
                                filteredAppointments.map(appointment => (
                                    <tr key={appointment.appointmentId}>
                                        <td>{appointment.appointmentId}</td>
                                        <td>{appointment.doctorName}</td>
                                        <td>{appointment.patientName}</td>
                                        <td>{new Date(appointment.appointmentDate).toLocaleString()}</td>
                                        <td>{appointment.symptoms}</td>
                                        <td>{appointment.status}</td>

                                        <td>
                                            {appointment.status !== "Cancelled" && appointment.status !== "Completed" && (
                                                <> <button className="btn btn-info" onClick={() => handleRescheduleDateTime(appointment.appointmentId)}>Reschedule Date</button>

                                                </>
                                            )}
                                        </td>

                                        <td>
                                            {appointment.status !== "Cancelled" && appointment.status !== "Completed" && (
                                                <>
                                                    <button className="btn btn-danger" onClick={() => handleCancel(appointment.appointmentId)}>Cancel Appointment</button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center">No appointments found</td>
                                </tr>
                            )}
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
                        timeIntervals={15}
                        minDate={new Date()} // disable all past 
                    />
                    <button onClick={handleConfirmDateTime}>Confirm</button>
                </div>
            )}

        </div>
    );
};

export default PAppointment;