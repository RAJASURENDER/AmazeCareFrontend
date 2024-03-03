// JavaScript source code
import React from 'react';
import './DoctorDashboard.css';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../../Components/NavBar/navbar-doctor';


const DoctorDashboard = () => {

    const { doctorId } = useParams();
    useEffect(() => {
        ;
    }, [doctorId]);

    console.log('Doctor ID:', doctorId);
    return (
        <div className="DoctorDashboard">
            <Navbar />

            {/* Patient Section */}
            <div className="doctor-section">
                <div className="container">
                    <div className="doctor-box">
                        <h2 className="heading">Welcome To AmazeCare</h2>
                        <div className="text-center">

                            <Link to={`/doctorappointment/${doctorId}`} className="btn btn-info x" id="viewAppointmentButton1">
                                View Appointments
                            </Link>

                            <Link to={`/medicalhistory/${doctorId}`} className="btn btn-success x" id="medicalHistoryButton1">
                                Medical History
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default DoctorDashboard;
