import React, { useState } from "react";
import {Link, useNavigate,useParams } from "react-router-dom";
import axios from 'axios';
import '../../Register/Register.css';

const token = sessionStorage.getItem('token');
const role = sessionStorage.getItem('username');

function AddDoctor() {
    const navigate = useNavigate();

    const [username, setUsername] = useState(""); // this line of code is declaring a state variable username with an initial value of an empty string, and a setter function setUsername that can be used to update the username state. and same goes for Every variables
    const [password, setPassword] = useState("");
    const [doctorName, setDoctorName] = useState("");
    const [speciality, setSpeciality] = useState("");
    const [experience, setExperience] = useState("");
    const [qualification, setQualification] = useState("");
    const [designation, setDesignation] = useState("");

    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [doctorNameError, setDoctorNameError] = useState("");
    const [specialityError, setSpecialityError] = useState("");
    const [experienceError, setExperienceError] = useState("");
    const [qualificationError, setQualificationError] = useState("");
    const [designationError, setDesignationError] = useState("");
    const [showLinks, setShowLinks] = useState(false);
    // Function to validate username input
    const validateUsername = () => {
        setUsernameError(username.length < 6 || username.length > 20 ? "Username must be between 6 and 20 characters long." : "");
    }

    // Function to validate password input
    const validatePassword = () => {
        setPasswordError(password.length < 6 || password.length > 20 ? "Password must be between 6 and 20 characters long." : "");
    }

    const validateDoctorName = () => {
        setDoctorNameError(doctorName.length < 3 || doctorName.length > 50 ? "Doctor name must be between 3 and 50 characters long." : "");
    }

    const validateSpeciality = () => {
        setSpecialityError(speciality.length < 3 || speciality.length > 50 ? "Speciality must be between 3 and 50 characters long." : "");
    }

    const validateExperience = () => {
        setExperienceError(isNaN(experience) || experience < 1 ? "Experience must be a number greater than 0." : "");
    }

    const validateQualification = () => {
        setQualificationError(qualification.length < 2 || qualification.length > 50 ? "Qualification must be between 2 and 50 characters long." : "");
    }

    const validateDesignation = () => {
        setDesignationError(designation.length < 3 || designation.length > 50 ? "Designation must be between 3 and 50 characters long." : "");
    }


    const AddDoctor = async () => {
        validateUsername();
        validatePassword();
        validateDoctorName();
        validateSpeciality();
        validateExperience();
        validateQualification();
        validateDesignation();


        if (passwordError || role != 'Admin' || doctorNameError || specialityError || experienceError || qualificationError || designationError || usernameError) {
            return;
        }

        const doctor = {
            username: username,
            doctorName: doctorName,
            password: password,
            role: "Doctor",
            speciality: speciality,
            experience: experience,
            qualification: qualification,
            designation: designation,

        };

        console.log(doctor);

        try {
            const response = await axios.post("http://localhost:5244/RegisterDoctor", doctor, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log(response);
            alert("Doctor Added Successfully!");
            navigate('/toDoctors');
        } catch (error) {
            console.log(error);
            if (!error?.response) {
                alert("Server not responding. Please try again later."); // Display error message
            } else {
                //alert("UserName already taken. Try Diffrent username.");
                alert(error.response.data)
            }

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
        <div className='Update-Doctor'>
            <nav className="navbarr">
                <a className="navbar-brand" href="/admin-dashboard">
                    <img src="images/logo-no-background.png" className="img-fluid" alt="AMAZLogo" width="200" height="200" />
                </a>
                <div className="links">
                    <button className="toggle-button" onClick={toggleNavbar}></button>
                    <div className={`navbar-links ${showLinks ? "show" : ""}`}>
                        <Link to="/toDoctors">Doctors</Link>
                        <Link to="/toAdminViewAppointments">Appointments</Link>
                        <Link to="/toPatientInfoAdmin">Patients</Link>
                        <Link onClick={handleLogout}><i className="fas fa-sign-out-alt"></i><strong> Logout </strong></Link>
                    </div>
                </div>
            </nav>
           
            <div className='Update-Container'>
                <div className="divUpdate ">
                    <h1 className="update-h1"><strong>Add Doctor</strong></h1>
                    <div className="form-group">
                        <label><i className="fa-solid fa-hospital-user"></i> Username</label>
                        <input className="form-control" type="text" value={username} onChange={(e) => setUsername(e.target.value)} onBlur={validateUsername} />
                        {usernameError && <span className="text-danger">{usernameError}</span>}

                    </div>
                    {/* Password input field */}
                    <div className="form-group">
                        <label><i className="fa fa-unlock"></i> Password</label>
                        <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} onBlur={validatePassword} />
                        {passwordError && <span className="text-danger">{passwordError}</span>}
                    </div>
                    <div className="form-group">
                        <label><i className="fa fa-user-md"></i> Doctor Name</label>
                        <input className="form-control" type="text" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} onBlur={validateDoctorName} />
                        {doctorNameError && <span className="text-danger">{doctorNameError}</span>}
                    </div>
                    <div className="form-group">
                        <label><i className="fa fa-stethoscope"></i> Speciality</label>
                        <input className="form-control" type="text" value={speciality} onChange={(e) => setSpeciality(e.target.value)} onBlur={validateSpeciality} />
                        {specialityError && <span className="text-danger">{specialityError}</span>}
                    </div>
                    <div className="form-group">
                        <label><i className="fa fa-star"></i> Experience (Years)</label>
                        <input className="form-control" type="text" value={experience} onChange={(e) => setExperience(e.target.value)} onBlur={validateExperience} />
                        {experienceError && <span className="text-danger">{experienceError}</span>}
                    </div>
                    <div className="form-group">
                        <label><i className="fa fa-graduation-cap"></i> Qualification</label>
                        <input className="form-control" type="text" value={qualification} onChange={(e) => setQualification(e.target.value)} onBlur={validateQualification} />
                        {qualificationError && <span className="text-danger">{qualificationError}</span>}
                    </div>
                    <div className="form-group">
                        <label><i className="fa fa-briefcase"></i> Designation</label>
                        <input className="form-control" type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} onBlur={validateDesignation} />
                        {designationError && <span className="text-danger">{designationError}</span>}
                    </div>
                    <button type="submit" className="register-button" onClick={AddDoctor}>Add Doctor</button>
                </div>
            </div>
        </div>
    );
}

export default AddDoctor;