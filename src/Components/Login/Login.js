import { useState } from 'react';

import { Link, Outlet } from 'react-router-dom';
import '../Register/Register.css'

function Login() {
    var [username, setUsername] = useState("");
    var [password, setPassword] = useState("");
    var [loggedin, setLoggedin] = useState(false);
    var user = {};
    var login = (e) => {
        e.preventDefault();
        user.username = username;
        user.password = password;
        user.role = "";
        user.token = "";
        var requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        }

        console.log(requestOptions);
        fetch("http://localhost:5244/Login", requestOptions)
            .then(res => res.json())
            .then(res => {
                sessionStorage.setItem("token", res.token);
                sessionStorage.setItem("username", res.username);
                alert("Login success - " + res.username);
                setLoggedin(true);
            })
            .catch(err => {
                console.log(err);
                setLoggedin(false);
            });
    };
    return (<div>
        {loggedin === true ? <h2 className='alert alert-success'>Welcome you have successfully logged in - {username}</h2> : null}


        <div className='register-page '>
            <nav className="Register-navbar navbar-expand-lg ">
                    <a className="Register-navbar-brand" href="/">
                        <img src="images/logo-no-background.png" className="d-inline-block align-top" alt="" />
                    </a>
            </nav>
            <div className='register-container'>
                <div className="alert alert-success divregister ">
                    <h1 className="heading-tag-h1"><strong>Login</strong></h1>

                    <div className="form-group">
                        <label><i class="fa-solid fa-hospital-user"></i> Username</label>

                        <input className="form-control" type="text" value={username}
                            onChange={(e) => setUsername(e.target.value)} />

                    </div>

                    <div className="form-group">
                        <label><i className="fa fa-unlock"></i> Password</label>
                        <input className="form-control" type="password" value={password}
                            onChange={(e) => setPassword(e.target.value)} />

                    </div>

                    <button type="submit" className="register-button" onClick={login} >Login</button>

                    <p class=" w3l-register-p">Don't have an account?<Link to='/register'> Register</Link></p>

                </div>

            </div>
        </div>
        <Outlet />
    </div >);
}

export default Login;