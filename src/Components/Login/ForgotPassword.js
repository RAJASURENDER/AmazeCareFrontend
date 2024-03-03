import React, { useState } from 'react';
import axios from 'axios';
import '../Register/Register.css'

const ResetPassword = () => {
    const [username, setUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");


    // Function to validate username input
    const validateUsername = () => {
        setUsernameError(username.length < 3 || username.length > 20 ? "Username must be between 3 and 20 characters long." : "");
    }

    // Function to validate password input
    const validatePassword = () => {
        setPasswordError(newPassword.length < 6 || newPassword.length > 20 ? "Password must be between 6 and 20 characters long." : "");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const response = await axios.put('http://localhost:5244/api/User/reset-password', {
                username,
                newPassword,
            });
            console.log(response.data); // Log the response data
            alert(response.data);

        } catch (error) {
            console.error(error.response.data); // Log the error response data
            alert(error.response.data);

        }
    };

    return (
        <div className="register-page">
            <nav className="Register-navbar navbar-expand-lg ">
                <a className="Register-navbar-brand" href="/">
                    <img src="images/logo-no-background.png" className="d-inline-block align-top" alt="" />
                </a>
            </nav>

            <form className="register-container" onSubmit={handleSubmit}>
                <div className="alert alert-success divregister ">
                    <h1 className="heading-tag-h1"><strong>Reset Password</strong></h1>
                    <div className="form-group">
                        <label><i className="fa-solid fa-hospital-user"></i> Username</label>
                        <input className="form-control" type="text" value={username} onChange={(e) => setUsername(e.target.value)} onBlur={validateUsername} />
                        {usernameError && <span className="text-danger">{usernameError}</span>}

                    </div>
                    <div className="form-group">
                        <label><i className="fa fa-unlock"></i> Password</label>
                        <input className="form-control" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} onBlur={validatePassword} />
                        {passwordError && <span className="text-danger">{passwordError}</span>}
                    </div>
                    <div className="form-group">
                        <label><i className="fa fa-unlock"></i> Confirm Password</label>
                        <input className="form-control" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onBlur={validatePassword} />
                        {passwordError && <span className="text-danger">{passwordError}</span>}
                    </div>
                    <button type="submit" className="register-button" onClick={handleSubmit}>Reset Password</button>
                </div >
            </form>

        </div>

    );
};

export default ResetPassword;