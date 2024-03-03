import { useParams ,useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../Register/Register.css';
import Navbar from '../../NavBar/navbar';

const token = sessionStorage.getItem('token');

function UpdatePatient() {
    const navigate = useNavigate();
    const { patientId } = useParams();
    const [username, setUsername] = useState("");
    const [patientName, setPatientName] = useState("");
    var [age, setAge] = useState(""); // Change age to string
    const [gender, setGender] = useState("");
    var [dateOfBirth, setDateOfBirth] = useState(new Date().toISOString().split('T')[0]); // Initialize dateOfBirth with current date in "yyyy-MM-dd" format
    const [contactNumber, setContactNumber] = useState("");

    const [usernameError, setUsernameError] = useState("");
    const [patientNameError, setPatientNameError] = useState("");
    const [ageError, setAgeError] = useState("");
    const [genderError, setGenderError] = useState("");
    const [dateOfBirthError, setDateOfBirthError] = useState("");
    const [contactNumberError, setContactNumberError] = useState("");

    useEffect(() => {
        if (patientId) {
            // Fetch patient details by ID and update state
            const fetchPatientDetails = async () => {
                try {
                    const response = await axios.get(`http://localhost:5244/ViewPatientById?id=${patientId}`,{
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const patientData = response.data;
                    setUsername(patientData.username);
                    setPatientName(patientData.patientName);
                    setAge(patientData.age.toString()); // Convert age to string
                    setGender(patientData.gender);
                    setDateOfBirth(patientData.dateOfBirth.split('T')[0]); // Format dateOfBirth as "yyyy-MM-dd"
                    setContactNumber(patientData.contactNumber);
                } catch (error) {
                    console.error('Error fetching patient details:', error);
                }
            };

            fetchPatientDetails();
        }
    }, [patientId]);

    const validateUsername = () => {
        setUsernameError(username.length < 3 || username.length > 20 ? "Username must be between 3 and 20 characters long." : "");
    }

    // const validatePassword = () => {
    //     setPasswordError(password.length < 6 || password.length > 20 ? "Password must be between 6 and 20 characters long." : "");
    // }

    const validatePatientName = () => {
        setPatientNameError(patientName.length < 3 || patientName.length > 50 ? "Name must be between 3 and 50 characters long." : "");
    }

    const validateAge = () => {
        setAgeError(isNaN(age) || age < 1 || age > 120 ? "Age must be a number between 1 and 120." : "");
    }

    const validateGender = () => {
        setGenderError(gender === "" ? "Please select a gender." : "");
    }

    const validateDateOfBirth = () => {
        setDateOfBirthError(dateOfBirth instanceof Date && dateOfBirth !== new Date() ? "Please select a date of birth." : "");
    }

    const validateContactNumber = () => {
        setContactNumberError(contactNumber.length !== 10 ? "Contact number must be 10 digits long." : "");
    }

    const updatePatient = async () => {
        // Validation logic goes here
        validateUsername();
        // validatePassword();
        validatePatientName();
        validateAge();
        validateGender();
        validateDateOfBirth();
        validateContactNumber();

        if (usernameError || patientNameError || ageError || genderError || dateOfBirthError || contactNumberError) {
            return;
        }

        const patient = {
            patientId: patientId, // Add patientId to the patient object
            username: username,
            patientName: patientName,
            age: parseInt(age), // Convert age back to number
            gender: gender,
            dateOfBirth: dateOfBirth,
            contactNumber: contactNumber
        };

        try {
            const response = await axios.put(`http://localhost:5244/UpdateAllDetailsOfThePatient`, patient,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response);
            alert("Patient details updated successfully");
            navigate('/toPatientInfoAdmin');
        } catch (error) {
            console.error('Error updating patient:', error);
            alert('Failed to update patient details. Please try again.');
        }
    };

    return (
        <div className='Update-Doctor'>
            <Navbar/>
            <div className='Update-Container'>
                <div className="divUpdate ">
                    <h1 className="update-h1"><strong>Update Patient</strong></h1>
                    <div className="form-group">
                        <label><i className="fa-solid fa-hospital-user"></i> Username</label>
                        <input className="form-control" type="text" value={username} disabled  />
                        {usernameError && <span className="text-danger">{usernameError}</span>}
                    </div>
                    <div className="form-group">
                        <label><i className="fa fa-user"></i> Name</label>
                        <input className="form-control" type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} onBlur={validateUsername}/>
                        {patientNameError && <span className="text-danger">{patientNameError}</span>}
                    </div>
                    <div className="form-group">
                        <label><i className="fa fa-child" aria-hidden="true"></i> Age</label>
                        <input className="form-control" type="text" value={age} onChange={(e) => setAge(e.target.value)} onBlur={validateUsername}/>
                        {ageError && <span className="text-danger">{ageError}</span>}
                    </div>
                    <div className="form-group">
                        <label><i className="fa-solid fa-venus-mars"></i> Gender</label>
                        <select className="form-control" value={gender} onChange={(e) => setGender(e.target.value)}onBlur={validateUsername}>
                            <option value="">--select Gender--</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Others">Others</option>
                        </select>
                        {genderError && <span className="text-danger">{genderError}</span>}
                    </div>
                    <div className="form-group">
                        <label><i className="fa-regular fa-calendar-days"></i> Date of Birth</label>
                        <input className="form-control" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)}onBlur={validateUsername} />
                        {dateOfBirthError && <span className="text-danger">{dateOfBirthError}</span>}
                    </div>
                    <div className="form-group">
                        <label><i className="fa fa-phone"></i> Phone</label>
                        <input className="form-control" type="text" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} onBlur={validateUsername}/>
                        {contactNumberError && <span className="text-danger">{contactNumberError}</span>}
                    </div>
                    <button type="submit" className="register-button" onClick={updatePatient}>Update Patient</button>
                </div>
            </div>
        </div>
    );
}

export default UpdatePatient;