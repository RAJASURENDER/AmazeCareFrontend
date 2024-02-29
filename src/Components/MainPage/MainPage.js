import React, { useState } from 'react';
import { Link } from "react-router-dom";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './MainPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const YourComponent = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };
    return (
        <div>
            {/* Navbar Start */}
            <header className="header_wrapper">
                <nav className="navbar navbar-expand-lg ">
                    <div className="container">
                        <a className="navbar-brand" href="/">
                            <img src="images/logo-no-background.png" className="img-fluid" width="200" height="200" alt="Logo" />
                        </a>
                        <button className="navbar-toggler" type="button" onClick={toggleNavbar}>
                            <FontAwesomeIcon icon={faBars} style={{ color: "#1767cf" }}/>
                        </button>
                        <div className={`collapse navbar-collapse justify-content-end ${isOpen ? 'show' : ''}`}>
                            <ul className="navbar-nav menu-navbar-nav">
                                <li className="nav-item">
                                    <a className="nav-link active" aria-current="page" href="#home">Home</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#about">About</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#services">Services</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#team">Team</a>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to='/register'>Register</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to='/login'>Login</Link> 
                                </li>
                                <li className="nav-item mt-3 mt-lg-0">
                                    <a className="nav-link" href="#contact">Contact</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Banner section */}
            <section id="home" className="home">
                <div className="banner_wrapper wrapper">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-md-6 order-md-1 order-2">
                                <h3>Welcome To</h3>
                                <h1>AmazeCare</h1>
                                <p>Pioneering compassionate healthcare, where patient well-being takes center stage, ensuring a seamless
                                    experience from appointment scheduling to world-className medical services.</p>
                            </div>
                            <div className="col-md-6 order-md-2 order-1 mb-md-0 mb-5">
                                <div className="top-right-sec">
                                    <div className="animate-img">
                                        <img decoding="async" className="aimg1" src="./images/top-banner/woman-brush.png" alt =""/>
                                            <img decoding="async" className="aimg2" src="./images/top-banner/doctor.png" alt =""/>
                                            </div>
                                            <img decoding="async" className="img-fluid ms-xl-5" src="./images/top-banner/hospital.png" alt =""/>
                                            </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="wrapper pb-0">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-4 col-sm-6 mb-4">
                                        <div className="card text-center">
                                            <div className="icon-box">
                                                <img decoding="async" src="./images/top-banner/Appointment.png" alt =""/>
                                            </div>
                                            <div>
                                                <h4>Easy Appointment</h4>
                                                <p> Easy Appointments aim to provide a hassle-free experience for customer satisfaction.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4 col-sm-6 mb-4">
                                        <div className="card text-center">
                                            <div className="icon-box">
                                                <img decoding="async" src="./images/top-banner/Emergency-icon.png" alt =""/>
                                            </div>
                                            <div>
                                                <h4>Emergency Service</h4>
                                                <p>Emergency services play a crucial role in safeguarding communities and individuals during unforeseen crises</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4 col-sm-6 mb-4">
                                        <div className="card text-center">
                                            <div className="icon-box">
                                                <img decoding="async" src="./images/top-banner/7-Service-icon.png" alt =""/>
                                            </div>
                                            <div>
                                                <h4>24/7 Service</h4>
                                                <p>24/7 Service will ensure you that at any point of time, whenever you need us, we will be there for you</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
            </section>

            {/* About section */}
            <section id="about" className="about_wrapper wrapper">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-6 mb-mb-0 mb-5">
                                    <div className="position-relative">
                                        <img decoding="async" src="./images/about/amb.png" className="img-fluid" alt =""/>
                                            <img decoding="async" src="./images/about/nurse.png" className="about-animate" alt =""/>
                                            </div>
                                    </div>
                                    <div className="col-md-6 text-center text-md-start">
                                        <h2>Welcome to a Family</h2>
                                        <p>Welcome to AmazeCare – a beacon of health and healing.
                                            At AmazeCare, we embrace a patient-centric approach,
                                            providing compassionate care and innovative medical solutions. With a dedicated team of professionals and state-of-the-art facilities, we strive to create a nurturing environment where your well-being is our utmost priority. Experience healthcare reimagined at AmazeCare, where we journey with you towards a healthier, happier life.</p>
                                        <div className="mt-5 card">
                                            <div className="about-clinic">
                                                <h4>500+</h4>
                                                <p>Happy Patients</p>
                                            </div>
                                            <div className="about-clinic">
                                                <h4>88+</h4>
                                                <p>Qualified Doctors</p>
                                            </div>
                                            <div className="about-clinic">
                                                <h4>25+</h4>
                                                <p>Years Experience</p>
                                            </div>
                                            <div className="about-clinic">
                                                <h4>55+</h4>
                                                <p>Healthcare Awards</p>
                                            </div>
                                            <span className="line-1"></span>
                                            <span className="line-2"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
            </section>

            {/* Services section */}
            <section id="services" className="services_wrapper wrapper">
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-12 text-center mb-5">
                                    <h3>Our Services</h3>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4 col-sm-6 mb-4">
                                    <div className="card">
                                        <div className="icon-box">
                                            <img decoding="async" src="./images/services/checkup.png" width="200" height="200" alt =""/>
                                        </div>
                                        <div>
                                            <h4>Routine Checkups</h4>
                                            <p>The service of Routine Checkup is available in our Hospital</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 col-sm-6 mb-4">
                                    <div className="card">
                                        <div className="icon-box">
                                            <img decoding="async" src="./images/services/vaccine.png" width="200" height="200" alt =""/>
                                        </div>
                                        <div>
                                            <h4>Vaccination</h4>
                                            <p>For Most of the Diseases Vaccination is available.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 col-sm-6 mb-4">
                                    <div className="card">
                                        <div className="icon-box">
                                            <img decoding="async" src="./images/services/consult.jpg" width="200" height="200" alt =""/>
                                        </div>
                                        <div>
                                            <h4>Specialty Consultations</h4>
                                            <p>Access to specialized medical professionals across various fields </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 col-sm-6 mb-4">
                                    <div className="card">
                                        <div className="icon-box">
                                            <img decoding="async" src="./images/services/diagnosis.jpg" width="200" height="200" alt =""/>
                                        </div>
                                        <div>
                                            <h4>Diagnostic Services</h4>
                                            <p>Advanced imaging and Laboratory tests for blood, urine, and other diagnostic purposes are available.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 col-sm-6 mb-4">
                                    <div className="card">
                                        <div className="icon-box">
                                            <img decoding="async" src="./images/services/virtual.jpg" width="200" height="200" alt =""/>
                                        </div>
                                        <div>
                                            <h4>Telehealth Services</h4>
                                            <p>Virtual consultations for non-emergency medical concerns and Remote monitoring for certain health conditions services</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 col-sm-6 mb-4">
                                    <div className="card">
                                        <div className="icon-box">
                                            <img decoding="async" src="./images/services/wellness.webp" width="200" height="200" alt =""/>
                                        </div>
                                        <div>
                                            <h4>Wellness and Preventive Programs</h4>
                                            <p>Health education and wellness programs and Preventive care initiatives </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
            </section>

            {/* Doctors Section */}
            <section id="team" className="team_wrapper wrapper">
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-12 text-center mb-5">
                                    <h4 className="text-black">Our Doctors</h4>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4 col-sm-6 mb-4">
                                    <div className="card rounded-3">
                                        <div className="team-img">
                                            <img decoding="async" src="./images/team/team1.png" className="img-fluid" alt =""/>
                                        </div>
                                        <div className="team-info pt-4 text-center">
                                            <h5>Darry Milin</h5>
                                            <p>Neurologist</p>

                                        </div>

                                    </div>
                                </div>
                                <div className="col-md-4 col-sm-6 mb-4">
                                    <div className="card rounded-3">
                                        <div className="team-img">
                                            <img decoding="async" src="./images/team/team2.png" className="img-fluid" alt =""/>
                                        </div>
                                        <div className="team-info pt-4 text-center">
                                            <h5>Salman Ahmed</h5>
                                            <p>Heart Surgeon</p>
                                        </div>

                                    </div>
                                </div>
                                <div className="col-md-4 col-sm-6 mb-4">
                                    <div className="card rounded-3">
                                        <div className="team-img">
                                            <img decoding="async" src="./images/team/team3.png" className="img-fluid" alt =""/>
                                        </div>
                                        <div className="team-info pt-4 text-center">
                                            <h5>Santa Binte</h5>
                                            <p>Oncologist</p>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
            </section>

            {/* Footer section  */}
            <section id="contact" className="footer_wrapper wrapper">
                        <div className="container pb-3">
                            <div className="row">
                                <div className="col-lg-3 col-md-6 mb-4">
                                    <h5>Clinic Location</h5>
                                    <p className="ps-0">For any Query, come to the Hospital or Call us on the given number or mail us on the given EmailId</p>
                                    <div className="contact-info">
                                        <ul className="list-unstyled p-0">
                                            <li><a href="/"><i className="fa fa-home me-3"></i>96, ABC street, Mumbai, Maharashtra </a></li>
                                            <li><a href="/"><i className="fa fa-phone me-3"></i>05311-283421</a></li>
                                            <li><a href="/"><i className="fa fa-envelope me-3"></i>AmazeCareHelpline@gmail.com</a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6 mb-4">
                                    <h5>More Links</h5>
                                    <ul className="link-widget p-0">
                                        <li><a href="/">About Us</a></li>
                                        <li><a href="/">Our Hospital</a></li>
                                        <li><a href="/">Programs</a></li>
                                        <li><a href="/">Insurance</a></li>
                                        <li><a href="/">Departments</a></li>
                                        <li><a href="/">Awards</a></li>
                                        <li><a href="/">Policy</a></li>
                                    </ul>
                                </div>
                                <div className="col-lg-3 col-md-6 mb-4">
                                    <h5>More Links</h5>
                                    <ul className="link-widget p-0">
                                    <li><a href="/">About Us</a></li>
                                        <li><a href="/">Our Hospital</a></li>
                                        <li><a href="/">Programs</a></li>
                                        <li><a href="/">Insurance</a></li>
                                        <li><a href="/">Departments</a></li>
                                        <li><a href="/">Awards</a></li>
                                        <li><a href="/">Policy</a></li>
                                    </ul>
                                </div>

                                <div className="col-lg-3 col-md-6 mb-4">

                                    <h5>Stay Connected</h5>
                                    <ul className="social-network d-flex align-items-center p-0 ">
                                        <li><a href="/"><i className="fab fa-facebook-f"></i></a></li>
                                        <li><a href="/"><i className="fab fa-twitter"></i></a></li>
                                        <li><a href="/"><i className="fab fa-google-plus-g"></i></a></li>
                                        <li><a href="/"><i className="fab fa-vimeo-v"></i></a></li>
                                    </ul>
                                </div>



                            </div>
                        </div>
                        <div className="container-fluid copyright-section">
                            <p className="p-0">Copyright <a href="/">© AMAZECARE</a> All Rights Reserved</p>
                        </div>
            </section>
        </div>
    );
};

export default YourComponent;