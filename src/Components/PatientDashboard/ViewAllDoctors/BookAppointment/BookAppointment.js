
import React from 'react';
import { Link,useParams,useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './BookAppointment.css';


function BookAppointment() {

    const token = sessionStorage.getItem('token');

    const navigate = useNavigate();

    const { patientId, doctorId } = useParams();
    const [appointmentDate, setAppointmentDate] = useState(new Date()/*.toISOString().split('T')[0]*/);
    const [doctorName, setDoctorName] = useState("");
    const [symptoms, setSymptoms] = useState("");
    const [natureOfVisit, setNatureOfVisit] = useState("");
  
    const [appointmentDateError, setAppointmentDateError] = useState("");
    const [appointmentTimeError, setAppointmentTimeError] = useState("");
    const [symptomsError, setSymptomsError] = useState("");
    const [natureOfVisitError, setNatureOfVisitError] = useState("");
    const [showLinks, setShowLinks] = useState(false);

   


    useEffect(() => {
        if (doctorId) {
            // Fetch patient details by ID and update state
            const fetchDoctorDetails = async () => {
                try {
                    const response = await axios.get(`http://localhost:5244/ViewDoctorById?id=${doctorId}`);
                    var doctorData = response.data;

                  
                    setDoctorName(doctorData.doctorName);
                } catch (error) {
                    console.error('Error fetching doctor details:', error);
                    
                }
            };

            fetchDoctorDetails();
        }
    }, [patientId, doctorId]);

   

    const validateAppointmentDate = () => {
        setAppointmentDateError(appointmentDate === "" ? "Please select an appointment date." : "");
    }

   

    const validateSymptoms = () => {
        setSymptomsError(symptoms === "" ? "Please enter symptoms." : "");
    }

    const validateNatureOfVisit = () => {
        setNatureOfVisitError(natureOfVisit === "" ? "Please enter nature of visit." : "");
    }

    const bookAppointment = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        validateAppointmentDate();
        validateSymptoms();
        validateNatureOfVisit();

        if (appointmentDateError || symptomsError || natureOfVisitError) {
            return;
        }

        const appointmentData = {
            patientId: patientId,
            doctorId: doctorId,
            appointmentDate: appointmentDate,
            symptomsDescription: symptoms,
            natureOfVisit: natureOfVisit
        };

        try {
            // Send the appointment data to your API endpoint for booking
            const response = await axios.post("http://localhost:5244/BookAnAppointment", appointmentData);
            console.log(response);
            alert("Appointment booked successfully");
            navigate(`/appointments/${patientId}`);
            
         
            // Redirect or perform any other action after successful booking
        } catch (error) {
            console.error('Error booking appointment:', error);
            alert('Failed to book appointment. Either Doctor has Prebooked Appointment at the given time,Please Change your Appointment Time or Invalid Appointment Date and Time');
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
 
        <div className="bookappointment-page">
            <nav className="navbarr">
                <Link className="navbar-brand" to={`/patient-dashboard/${patientId}`}>
                    <img src="../../images/logo-no-background.png" className="img-fluid" alt="AMAZLogo" width="200" height="200" />
                </Link>
                <div className="links">
                    <button className="toggle-button" onClick={toggleNavbar}>
                        &#9776;
                    </button>
                    <div className={`navbar-links ${showLinks ? "show" : ""}`}>
                        <Link to={`/doctors/${patientId}`}>Doctors</Link>
                        <Link to={`/appointments/${patientId}`}>MyAppointments</Link>
                        <Link to={`/medical-history/${patientId}`} >Medical History</Link>
                        <Link onClick={handleLogout}><i className="fas fa-sign-out-alt"></i><strong> Logout </strong></Link>
                    </div>
                </div>
            </nav>
            <div className="bookappointment-container">
                <div className="bookappointments-box">
                    <h2 className="text-center">Book Appointment</h2>
                    <form id="appointment-form">
                        <div className="form-group">
                            <label htmlFor="doctorName">Doctor's Name:</label>
                            <input type="text" className="form-control" value={doctorName} id="doctorName" readOnly></input>
                        </div>

                        <div className="form-group">
                            <label htmlFor="patientName">Patient's Name:</label>
                            <input type="text" className="form-control" id="patientName" required></input>
                        </div>

                        <div className="form-group">
                            <label htmlFor="dob">Date of Birth:</label>
                            <input type="date" className="form-control" id="dob" required></input>
                        </div>

                        <div className="form-group">
                            <label htmlFor="gender">Gender:</label>
                            <select className="form-control" id="gender" required>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="contactNumber">Contact Number:</label>
                            <input type="tel" className="form-control" id="contactNumber" required></input>
                        </div>

                        <div className="form-group">
                            <label>Symptoms</label>
                            <textarea
                                className="form-control"
                                placeholder="Enter symptoms"
                                value={symptoms}
                                onChange={(e) => setSymptoms(e.target.value)}
                            />
                            {symptomsError && <span className="text-danger">{symptomsError}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="AppointmentDateTime">Preferred Appointment Date and Time:</label>
                            <input className="form-control" type="datetime-local" onChange={(e) => setAppointmentDate(e.target.value)} id="AppointmentDateTime" required></input>
                        </div>

                       

                        <div className="form-group">
                            <label>Nature of Visit</label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Enter nature of visit"
                                value={natureOfVisit}
                                onChange={(e) => setNatureOfVisit(e.target.value)}
                            />
                            {natureOfVisitError && <span className="text-danger">{natureOfVisitError}</span>}
                        </div>
                       
                        <button
                            type="submit"
                            className="btn btn-primary book-appointment-button"
                            onClick={bookAppointment}
                        >
                            Book Appointment
                        </button>
                    </form>
                </div>
            </div>
        </div>

    );

    
};

export default BookAppointment