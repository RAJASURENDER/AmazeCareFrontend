import { useState } from "react"; // Importing React and useState hook
import axios from 'axios'; // Importing axios for API requests
import './Register.css';
import { Link, useNavigate } from "react-router-dom";

// Defining the Register component
function Register() {
    const navigate = useNavigate(); // Creating a variable to handle navigation between pages using useNavigate hook
    // State variables for form inputs
    // const keyword, setusername etc is Setter function of React Hook usestate, [username, setUsername]: This syntax is called array destructuring,
    const [username, setUsername] = useState(""); // this line of code is declaring a state variable username with an initial value of an empty string, and a setter function setUsername that can be used to update the username state. and same goes for Every variables
    const [password, setPassword] = useState("");
    const [patientName, setPatientName] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [contactNumber, setContactNumber] = useState("");

    // State variables for form input errors
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [patientNameError, setPatientNameError] = useState("");
    const [ageError, setAgeError] = useState("");
    const [genderError, setGenderError] = useState("");
    const [dateOfBirthError, setDateOfBirthError] = useState("");
    const [contactNumberError, setContactNumberError] = useState("");

    // Function to validate username input
    const validateUsername = () => {
        setUsernameError(username.length < 3 || username.length > 20 ? "Username must be between 3 and 20 characters long." : "");
    }

    // Function to validate password input
    const validatePassword = () => {
        setPasswordError(password.length < 6 || password.length > 20 ? "Password must be between 6 and 20 characters long." : "");
    }

    // Function to validate patient name input
    const validatePatientName = () => {
        setPatientNameError(patientName.length < 3 || patientName.length > 50 ? "Name must be between 3 and 50 characters long." : "");
    }

    // Function to validate age input
    const validateAge = () => {
        setAgeError(isNaN(age) || age < 1 || age > 120 ? "Age must be a number between 1 and 120." : "");
    }

    // Function to validate gender input
    const validateGender = () => {
        setGenderError(gender === "" ? "Please select a gender." : "");
    }

    // Function to validate date of birth input
    const validateDateOfBirth = () => {
        setDateOfBirthError(dateOfBirth instanceof Date && dateOfBirth !== new Date() ? "Please select a date of birth." : "");
    }

    // Function to validate contact number input
    const validateContactNumber = () => {
        setContactNumberError(contactNumber.length !== 10 ? "Contact number must be 10 digits long." : "");
    }

    // Function to handle user registration
    const register = async () => {
        validateUsername();
        validatePassword();
        validatePatientName();
        validateAge();
        validateGender();
        validateDateOfBirth();
        validateContactNumber();

        // Check if any field has an error
        //If the condition is true, return; is called, which exits This means that if there are any errors 
        //in the form any error messages are displayed and it stop the registration process till the errors are fixed

        if (usernameError || passwordError || patientNameError || ageError || genderError || dateOfBirthError || contactNumberError) {
            return;
        }

        // Construct patient object with form data
        const patient = {
            username: username,
            password: password,
            role: "Patient", // Role is hardcoded to "Patient"
            patientName: patientName,
            age: age,
            gender: gender,
            dateOfBirth: dateOfBirth,
            contactNumber: contactNumber
        };

        // Log patient object to console
        console.log(patient);

        // Send API request to register user
        try {
            const response = await axios.post("http://localhost:5244/RegisterPatient", patient);
            console.log(response);
            alert("Registration successful!"); // Display success message
            navigate('/login'); // Redirect to patient dashboard
        } catch (error) {
            console.log(error);
            if (!error?.response) {
                alert("Server not responding. Please try again later."); // Display error message
            } else if (error.response.status === 400) {
                alert("Enter All fields!!!");
            }
            else {
                //alert("UserName already taken. Try Diffrent username.");
                alert(error.response.data)
            }

        }
    };


    return (

        <div className="register-page">
            <nav className="Register-navbar navbar-expand-lg ">
                <a className="Register-navbar-brand" href="/">
                    <img src="images/logo-no-background.png" className="d-inline-block align-top" alt="" />
                </a>
            </nav>

            <div className="register-container">
                <div className="alert alert-success divregister ">
                    <h1 className="heading-tag-h1"><strong>Sign Up</strong></h1>


                    {/* Username input field */}
                    {/* onBlur={validateUsername} This is used  to call the validate function when the field loses focus */}
                    {/* onChange={(e) => setUsername(e.target.value)} It is  used to update the state of username when a change occurs in the input field. The value entered by User */}

                    <div className="form-group">
                        <label><i class="fa-solid fa-hospital-user"></i> Username</label>
                        <input className="form-control" type="text" value={username} onChange={(e) => setUsername(e.target.value)} onBlur={validateUsername} />
                        {usernameError && <span className="text-danger">{usernameError}</span>}

                    </div>
                    {/* Password input field */}
                    <div className="form-group">
                        <label><i className="fa fa-unlock"></i> Password</label>
                        <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} onBlur={validatePassword} />
                        {passwordError && <span className="text-danger">{passwordError}</span>}
                    </div>
                    {/* Patient name input field */}
                    <div className="form-group">
                        <label><i className="fa fa-user"></i> Name</label>
                        <input className="form-control" type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} onBlur={validatePatientName} />
                        {patientNameError && <span className="text-danger">{patientNameError}</span>}
                    </div>
                    {/* Age input field */}
                    <div className="form-group">
                        <label><i class="fa fa-child" aria-hidden="true"></i> Age</label>
                        <input className="form-control" type="text" value={age} onChange={(e) => setAge(e.target.value)} onBlur={validateAge} />
                        {ageError && <span className="text-danger">{ageError}</span>}
                    </div>
                    {/* Gender input field */}
                    <div className="form-group">
                        <label><i class="fa-solid fa-venus-mars"></i> Gender</label>
                        <select className="form-control" value={gender} onChange={(e) => setGender(e.target.value)} onBlur={validateGender}>
                            <option value="">--select Gender--</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Others">Others</option>
                        </select>
                        {genderError && <span className="text-danger">{genderError}</span>}
                    </div>
                    {/* Date of birth input field */}
                    <div className="form-group">
                        <label><i class="fa-regular fa-calendar-days"></i> Date of Birth</label>
                        <input className="form-control" type="date" value={dateOfBirth} max={new Date().toISOString().split('T')[0]} onChange={(e) => setDateOfBirth(e.target.value)} onBlur={validateDateOfBirth} />
                        {dateOfBirthError && <span className="text-danger">{dateOfBirthError}</span>}
                    </div>
                    {/* Contact number input field */}
                    <div className="form-group">
                        <label><i class="fa fa-phone"></i> Phone</label>
                        <input className="form-control" type="text" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} onBlur={validateContactNumber} />
                        {contactNumberError && <span className="text-danger">{contactNumberError}</span>}
                    </div>
                    {/* Register button */}

                    <button type="submit" className="register-button" onClick={register}>Register</button>
                    <p class="w3l-register-p">Already have an account?<Link to='/login'> Login</Link></p>
                </div>

            </div>
        </div>
    );
}

export default Register;