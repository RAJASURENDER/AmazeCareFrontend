import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Register/Register.css';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loggedin, setLoggedin] = useState(false);

    const fetchUserId = async (role) => {
        try {
            let apiUrl;
            if (role === 'Doctor') {
                apiUrl = `http://localhost:5244/api/Doctors/GetDoctorIdByUsername?username=${username}`;

            } else if (role === 'Patient') {
                apiUrl = `http://localhost:5244/api/Patient/GetPatientIdByUsername?username=${username}`;
            }

            const response = await fetch(apiUrl);

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                console.error(`Failed to fetch ${role} userId. Response status: ${response.status}`);
                return null;
            }
        } catch (error) {
            console.error(`Error fetching ${role} userId:`, error);
            return null;
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = {
            username: username,
            password: password,
            role: "",
            token: "",
        };

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        };

        try {
            const response = await fetch("http://localhost:5244/Login", requestOptions);
            if (response.ok) {
                const data = await response.json();
                sessionStorage.setItem("token", data.token);
                sessionStorage.setItem("username", data.username);
                sessionStorage.setItem("userId", data.userId);
                sessionStorage.setItem("role", data.role);

                alert("Login success - " + data.username);
                setLoggedin(true);

                // Fetch userId based on the user's role
                const userId = await fetchUserId(data.role);
                console.log('Final userId:', userId); // Log the final userId

                switch (data.role) {
                    case 'Admin':
                        window.location.href = `/admin-dashboard`;
                        break;
                    case 'Doctor':
                        window.location.href = `/doctor-dashboard/${userId}`;
                        break;
                    case 'Patient':
                        window.location.href = `/patient-dashboard/${userId}`;
                        break;
                    default:
                        console.log("Unknown role");
                }
            } else {
                alert("Invalid username or password");
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setLoggedin(false);
        }
    };

    return (
        <div className='register-page '>
            <nav className="navbarr">
                <a className="navbar-brand" href="/">
                    <img src="images/logo-no-background.png" className="img-fluid" alt="AMAZLogo" width="200" height="200" />
                </a>
            </nav>
            <div className='register-container'>
                <div className="alert alert-success divregister ">
                    <h1 className="heading-tag-h1"><strong>Login</strong></h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label><i className="fa-solid fa-hospital-user"></i> Username</label>
                            <input className="form-control" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </div>

                        <div className="form-group">
                            <label><i className="fa fa-unlock"></i> Password</label>
                            <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>

                        <button type="submit" className="register-button" style={{ marginBottom: '3%'}}>Login</button>
                        <p><Link to='/ForgotPassword' style={{ padding: '1%', marginLeft: '35%'}}> Forgot Password?</Link></p>

                        <p className="w3l-register-p">Don't have an account?<Link to='/register'> Register</Link></p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;