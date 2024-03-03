// import React from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import '../BookAppoinment/BookAppointment.css';
// import PatientNavbar from '../../../NavBar/navbar-patient';
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// const token = sessionStorage.getItem('token');

// function utcToIst(utcDateString) {
//     const utcDate = new Date(utcDateString);
//     const istTime = utcDate.getTime() + (5.5 * 60 * 60 * 1000); // Add 5 hours and 30 minutes (5.5 hours) to convert from UTC to IST
//     const istDate = new Date(istTime);
//     return istDate.toISOString();
// }

// function BookAppointment() {
//     const navigate = useNavigate();

//     const { patientId, doctorId } = useParams();
//     const [appointmentDate, setAppointmentDate] = useState(new Date());
//     const [doctorName, setDoctorName] = useState("");
//     const [symptoms, setSymptoms] = useState("");
//     const [natureOfVisit, setNatureOfVisit] = useState("");
//     const [appointmentDateError, setAppointmentDateError] = useState("");
//     const [appointmentTimeError, setAppointmentTimeError] = useState("");
//     const [symptomsError, setSymptomsError] = useState("");
//     const [natureOfVisitError, setNatureOfVisitError] = useState("");

//     useEffect(() => {
//         if (doctorId) {
//             // Fetch patient details by ID and update state
//             const fetchDoctorDetails = async () => {
//                 try {
//                     const response = await axios.get(`http://localhost:5244/ViewDoctorById?id=${doctorId}`, {
//                         headers: {
//                             Authorization: `Bearer ${token}`
//                         }
//                     });
//                     console.log(response);
//                     var doctorData = response.data;
//                     setDoctorName(doctorData.doctorName);
//                 } catch (error) {
//                     console.error('Error fetching doctor details:', error);

//                 }
//             };

//             fetchDoctorDetails();
//         }
//     }, [patientId, doctorId]);


//     const validateAppointmentDate = () => {
//         setAppointmentDateError(appointmentDate === "" ? "Please select an appointment date." : "");
//     }
//     const validateSymptoms = () => {
//         setSymptomsError(symptoms === "" ? "Please enter symptoms." : "");
//     }

//     const validateNatureOfVisit = () => {
//         setNatureOfVisitError(natureOfVisit === "" ? "Please enter nature of visit." : "");
//     }

//     const bookAppointment = async () => {

//         validateAppointmentDate();
//         validateSymptoms();
//         validateNatureOfVisit();

//         if (appointmentDateError || appointmentTimeError || symptomsError || natureOfVisitError) {
//             return;
//         }

//         const appointmentData = {
//             patientId: patientId,
//             doctorId: doctorId,
//             appointmentDate: utcToIst(appointmentDate.toISOString()),
//             symptomsDescription: symptoms,
//             natureOfVisit: natureOfVisit
//         };

//         try {
//             // Send the appointment data to your API endpoint for booking
//             const response = await axios.post("http://localhost:5244/BookAnAppointment", appointmentData, {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//             console.log(response);
//             alert("Appointment booked successfully");
//             // Redirect to the appointments page for the current patient
//             navigate(`/appointments/${patientId}`);
//         } catch (error) {
//             console.error('Error booking appointment:', error);
//             alert('Failed to book. Choose diffrent time....');
//         }
//     };

//     return (

//         <div className="bookappointment-page">

//             <PatientNavbar />
//             <div className="bookappointment-container">
//                 <div className="bookappointments-box">
//                     <h2 className="text-center">Book Appointment</h2>
//                     <form id="appointment-form">
//                         <div className="form-group">
//                             <label htmlFor="doctorName">Doctor's Name:</label>
//                             <input type="text" className="form-control" value={doctorName} id="doctorName" readOnly></input>
//                         </div>

//                         <div className="form-group">
//                             <label htmlFor="patientName">Patient's Name:</label>
//                             <input type="text" className="form-control" id="patientName" required></input>
//                         </div>

//                         <div className="form-group">
//                             <label htmlFor="dob">Date of Birth:</label>
//                             <input type="date" className="form-control" id="dob" max={new Date().toISOString().split('T')[0]} required></input>
//                         </div>

//                         <div className="form-group">
//                             <label htmlFor="gender">Gender:</label>
//                             <select className="form-control" id="gender" required>
//                                 <option value="male">Male</option>
//                                 <option value="female">Female</option>
//                             </select>
//                         </div>

//                         <div className="form-group">
//                             <label htmlFor="contactNumber">Contact Number:</label>
//                             <input type="tel" className="form-control" id="contactNumber" required></input>
//                         </div>

//                         <div className="form-group">
//                             <label>Symptoms</label>
//                             <textarea
//                                 className="form-control"
//                                 placeholder="Enter symptoms"
//                                 value={symptoms}
//                                 onChange={(e) => setSymptoms(e.target.value)}
//                             />
//                             {symptomsError && <span className="text-danger">{symptomsError}</span>}
//                         </div>

//                         <div className="form-group">
//                             <label htmlFor="AppointmentDateTime">Preferred Appointment Date and Time:</label>
//                             <input className="form-control"
//                                 type="datetime-local"
//                                 selected={appointmentDate}
//                                 onChange={event => setAppointmentDate(new Date(event.target.value))}
//                                 dateFormat="yyyy-MM-dd HH:mm zzz"
//                                 min={new Date().toISOString().substring(0, 16)}
//                                 id="AppointmentDateTime" required></input>
//                         </div>

//                         <div className="form-group">
//                             <label>Nature of Visit</label>
//                             <input
//                                 className="form-control"
//                                 type="text"
//                                 placeholder="Enter nature of visit"
//                                 value={natureOfVisit}
//                                 onChange={(e) => setNatureOfVisit(e.target.value)}
//                             />
//                             {natureOfVisitError && <span className="text-danger">{natureOfVisitError}</span>}
//                         </div>

//                         <button
//                             type="submit"
//                             className="book-appointment-button btn btn-primary"
//                             onClick={bookAppointment}
//                         >
//                             Book Appointment
//                         </button>
//                     </form>
//                 </div>
//             </div>
//         </div>

//     );


// };

// export default BookAppointment


import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../BookAppoinment/BookAppointment.css';
import PatientNavbar from '../../../NavBar/navbar-patient';
const token = sessionStorage.getItem('token');

function utcToIst(utcDateString) {
    const utcDate = new Date(utcDateString);
    const istTime = utcDate.getTime() + (5.5 * 60 * 60 * 1000); // Add 5 hours and 30 minutes (5.5 hours) to convert from UTC to IST
    const istDate = new Date(istTime);
    return istDate.toISOString();
}

function BookAppointment() {
    const navigate = useNavigate();

    const { patientId, doctorId } = useParams();
    const [appointmentDate, setAppointmentDate] = useState(new Date());
    const [doctorName, setDoctorName] = useState("");
    const [symptoms, setSymptoms] = useState("");
    const [natureOfVisit, setNatureOfVisit] = useState("");
    const [appointmentDateError, setAppointmentDateError] = useState("");
    const [appointmentTimeError, setAppointmentTimeError] = useState("");
    const [symptomsError, setSymptomsError] = useState("");
    const [natureOfVisitError, setNatureOfVisitError] = useState("");

    useEffect(() => {
        if (doctorId) {
            // Fetch patient details by ID and update state
            const fetchDoctorDetails = async () => {
                try {
                    const response = await axios.get(`http://localhost:5244/ViewDoctorById?id=${doctorId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    console.log(response);
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

    const bookAppointment = async (event) => {
        event.preventDefault();

        validateAppointmentDate();
        validateSymptoms();
        validateNatureOfVisit();

        if (appointmentDateError || appointmentTimeError || symptomsError || natureOfVisitError) {
            return;
        }

        const appointmentData = {
            patientId: patientId,
            doctorId: doctorId,
            appointmentDate: utcToIst(appointmentDate.toISOString()),
            symptomsDescription: symptoms,
            natureOfVisit: natureOfVisit
        };

        try {
            // Send the appointment data to your API endpoint for booking
            const response = await axios.post("http://localhost:5244/BookAnAppointment", appointmentData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response);
            alert("Appointment booked successfully");
            // Redirect to the appointments page for the current patient
            navigate(`/appointments/${patientId}`);
        } catch (error) {
            console.error('Error booking appointment:', error);
            alert('Failed to book. Choose diffrent time....');
        }
    };

    return (

        <div className="bookappointment-page">

            <PatientNavbar />
            <div className="bookappointment-container">
                <div className="bookappointments-box">
                    <h2 className="text-center">Book Appointment</h2>
                    <form id="appointment-form" onSubmit={bookAppointment}>
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
                            <input type="date" className="form-control" id="dob" max={new Date().toISOString().split('T')[0]} required></input>
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
                            <DatePicker
                                selected={appointmentDate}
                                onChange={date => setAppointmentDate(date)}
                                showTimeSelect
                                timeFormat="h:mm aa" // 12-hour format
                                timeIntervals={15}
                                timeCaption="time"
                                dateFormat="MMMM d, yyyy h:mm aa"
                                minDate={new Date()} // disable all past dates
                            />
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
                            className="book-appointment-button btn btn-primary"
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
