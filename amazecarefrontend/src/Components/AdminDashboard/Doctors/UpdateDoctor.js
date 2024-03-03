import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../Register/Register.css';
import Navbar from '../../NavBar/navbar';

const token = sessionStorage.getItem('token');

function UpdateDoctor() {

    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const { doctorId } = useParams();
    const [doctorName, setDoctorName] = useState("");
    const [speciality, setSpeciality] = useState("");
    const [experience, setExperience] = useState("");
    const [qualification, setQualification] = useState("");
    const [designation, setDesignation] = useState("");

    const [usernameError, setUsernameError] = useState("");
    const [doctorNameError, setDoctorNameError] = useState("");
    const [specialityError, setSpecialityError] = useState("");
    const [experienceError, setExperienceError] = useState("");
    const [qualificationError, setQualificationError] = useState("");
    const [designationError, setDesignationError] = useState("");

    useEffect(() => {
        if (doctorId) {
            const fetchDoctorDetails = async () => {
                try {
                    const response = await axios.get(`http://localhost:5244/ViewDoctorById?id=${doctorId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const doctorData = response.data;
                    setUsername(doctorData.username);
                    setDoctorName(doctorData.doctorName);
                    setSpeciality(doctorData.speciality);
                    setExperience(doctorData.experience.toString());
                    setQualification(doctorData.qualification);
                    setDesignation(doctorData.designation);
                } catch (error) {
                    console.error('Error fetching doctor details:', error);
                }
            };

            fetchDoctorDetails();
        }
    }, [doctorId]);


    const validateUsername = () => {
        setUsernameError(username.length < 3 || username.length > 20 ? "Username must be between 3 and 20 characters long." : "");
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
        setQualificationError(qualification.length < 3 || qualification.length > 50 ? "Qualification must be between 3 and 50 characters long." : "");
    }

    const validateDesignation = () => {
        setDesignationError(designation.length < 3 || designation.length > 50 ? "Designation must be between 3 and 50 characters long." : "");
    }


    const updateDoctor = async () => {

        validateUsername();
        validateDoctorName();
        validateSpeciality();
        validateExperience();
        validateQualification();
        validateDesignation();

        if (doctorNameError || specialityError || experienceError || qualificationError || designationError || usernameError) {
            return;
        }

        const doctor = {

            username: username,
            doctorId: doctorId,
            doctorName: doctorName,
            speciality: speciality,
            experience: parseInt(experience),
            qualification: qualification,
            designation: designation
        };

        try {
            const response = await axios.put(`http://localhost:5244/UpdateWholeOfTheDoctor`, doctor,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response);
            alert("Doctor details updated successfully");
            navigate('/toDoctors');
        } catch (error) {
            console.error('Error updating doctor:', error);
            alert('Failed to update doctor details. Please try again.');
        }
    };

    return (
        <div className='Update-Doctor'>
            <Navbar/>
            <div className='Update-Container'>
                <div className="divUpdate ">
                    <h1 className="update-h1"><strong>Update Doctor</strong></h1>

                    <div className="form-group">
                        <label><i className="fa-solid fa-hospital-user"></i> Username</label>
                        <input className="form-control" type="text" value={username} Disabled/>
                        {usernameError && <span className="text-danger">{usernameError}</span>}
                    </div>
                    <div className="form-group">
                        <label><i className="fa fa-user-md"></i> Doctor Name</label>
                        <input className="form-control" type="text" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} />
                        {doctorNameError && <span className="text-danger">{doctorNameError}</span>}
                    </div>
                    <div className="form-group">
                        <label><i className="fa fa-stethoscope"></i> Speciality</label>
                        <input className="form-control" type="text" value={speciality} onChange={(e) => setSpeciality(e.target.value)} />
                        {specialityError && <span className="text-danger">{specialityError}</span>}
                    </div>
                    <div className="form-group">
                        <label><i className="fa fa-star"></i> Experience (Years)</label>
                        <input className="form-control" type="text" value={experience} onChange={(e) => setExperience(e.target.value)} />
                        {experienceError && <span className="text-danger">{experienceError}</span>}
                    </div>
                    <div className="form-group">
                        <label><i className="fa fa-graduation-cap"></i> Qualification</label>
                        <input className="form-control" type="text" value={qualification} onChange={(e) => setQualification(e.target.value)} />
                        {qualificationError && <span className="text-danger">{qualificationError}</span>}
                    </div>
                    <div className="form-group">
                        <label><i className="fa fa-briefcase"></i> Designation</label>
                        <input className="form-control" type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} />
                        {designationError && <span className="text-danger">{designationError}</span>}
                    </div>
                    <button type="submit" className="register-button" onClick={updateDoctor}>Update Doctor</button>
                </div>
            </div>
        </div>
    );
}

export default UpdateDoctor;