// JavaScript source code
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Appointment.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import NavBar from '../../NavBar/navbar';

const token = sessionStorage.getItem('token');

function utcToIst(utcDateString) {
    const utcDate = new Date(utcDateString);
    const istTime = utcDate.getTime() + (5.5 * 60 * 60 * 1000); // Add 5 hours and 30 minutes (5.5 hours) to convert from UTC to IST
    const istDate = new Date(istTime);
    return istDate.toISOString();
}

const Appointment = () => {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [noAppointmentsMessage, setNoAppointmentsMessage] = useState('');
    const [selectedDateTime, setSelectedDateTime] = useState(new Date());
    const [showDateTimePicker, setShowDateTimePicker] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await axios.get("http://localhost:5244/ViewAllTheAppointments", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const now = new Date();
            const appointmentsWithNames = await Promise.all(response.data.map(async appointment => {
                const doctorResponse = await axios.get(`http://localhost:5244/ViewDoctorById?id=${appointment.doctorId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const patientResponse = await axios.get(`http://localhost:5244/ViewPatientById?id=${appointment.patientId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                appointment.doctorName = doctorResponse.data.doctorName;
                appointment.patientName = patientResponse.data.patientName;
                appointment.isUpcoming = appointment.appointmentDate > now;
                return appointment;
            }));
            setAppointments(appointmentsWithNames);
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
                        }, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });

                        // Update the status to "Rescheduled"
                        await axios.put(`http://localhost:5244/StatusToRescheduleAppointment?id=${appointmentId}`, {}, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });

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
    }



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

    return (
        <div className="appointment-page">
            <NavBar />
            <div className="appointment-container">
                <div className="appointments-box">
                    <h1 className="text-center update-h1">All Appointments</h1>
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
                                <th scope="col">Nature of Visit</th>
                                <th scope="col">Actions</th>
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
                                        <td>{appointment.symptomsDescription}</td>
                                        <td>{appointment.status}</td>
                                        <td>{appointment.natureOfVisit}</td>
                                        <td>
                                            {appointment.status !== "Cancelled" && appointment.status !== "Completed" && (
                                                <div className="button-group">
                                                    <button className="btn btn-danger" onClick={() => handleCancel(appointment.appointmentId)}>Cancel</button>
                                                    <div className="button-group-inner">
                                                        <button className="btn btn-info" onClick={() => handleRescheduleDoctor(appointment.appointmentId)}>Reschedule Doctor</button>
                                                        <button className="btn btn-info" onClick={() => handleRescheduleDateTime(appointment.appointmentId)}>Reschedule Date</button>
                                                    </div>
                                                </div>
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
                        timeIntervals={15} //15min gap in between every appointment
                        showTimezone
                        dateFormat="yyyy-MM-dd HH:mm zzz"
                        minDate={new Date()} // disable all past dates
                    />
                    <button onClick={handleConfirmDateTime}>Confirm</button>
                </div>
            )}

        </div>
    );
};

export default Appointment;