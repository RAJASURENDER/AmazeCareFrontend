import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import AdminDashboard from './Components/AdminDashboard/AdminDashboard';
import PatientDashboard from './Components/PatientDashboard/PatientDashboard';
import Register from './Components/Register/Register';
import DoctorDashboard from './Components/DoctorDashboard/DoctorDashboard';
import Login from './Components/Login/Login';
import Doctors from './Components/PatientDashboard/ViewAllDoctors/ViewAllDoctors';
import BookAppointment from './Components/PatientDashboard/ViewAllDoctors/BookAppointment/BookAppointment';
import PAppointment from './Components/PatientDashboard/ViewAppointments/ViewAppointments';
import MedicalRecords from './Components/PatientDashboard/ViewMedicalRecords/ViewMedicalRecords';
import ViewPrescriptionDetails from './Components/PatientDashboard/ViewMedicalRecords/ViewPrescription';
import Doctor from './Components/AdminDashboard/Doctors/Doctor';
import Appointment from './Components/AdminDashboard/Appointments/Appointment';
import Patient from './Components/AdminDashboard/Patient/Patient';
import UpdatePatient from './Components/AdminDashboard/Patient/UpdatePatient';
import AddPatient from './Components/AdminDashboard/Patient/AddPatient';
import AddDoctor from './Components/AdminDashboard/Doctors/AddDoctor';
import UpdateDoctor from './Components/AdminDashboard/Doctors/UpdateDoctor';
import ResetPassword from './Components/Login/ForgotPassword';
import DAppointment from './Components/DoctorDashboard/ViewDoctorAppointments/ViewDoctorAppointments';
import GenerateMedicalRecords from './Components/DoctorDashboard/ViewDoctorAppointments/WriteMedicalRecords/WriteMedicalRecords';
import CreatePrescription from './Components/DoctorDashboard/MedicalRecords/PrescriptionByRecord/AddPrescription';
import UpdatePrescriptions from './Components/DoctorDashboard/MedicalRecords/PrescriptionByRecord/UpdatePrescription';
import MedicalRecordByAppointment from './Components/DoctorDashboard/MedicalRecords/ViewMedicalRecordByAppointmentId';
import YourComponent from './Components/MainPage/MainPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<YourComponent />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login/register" element={<Register />} />
                <Route path="/forgot_password" element={<ResetPassword />} />

            {/*    dashboards*/}
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/doctor-dashboard/:doctorId" element={<DoctorDashboard />} />
                <Route path="/patient-dashboard/:patientId" element={<PatientDashboard />} />

             {/*   patient dashboard*/}
                <Route path="/doctors/:patientId" element={<Doctors />} />
                <Route path="/appointments/:patientId" element={<PAppointment />} />
                <Route path="/medical-history/:patientId" element={<MedicalRecords />} />
                <Route path="/book-appointment/:patientId/:doctorId" element={<BookAppointment />} />
                <Route path="/view-record/:patientId/:recordId" element={<ViewPrescriptionDetails />} />

                {/*  admin dashboard*/}
                <Route path="/toDoctors" element={<Doctor />} />
                <Route path="/toAdminViewAppointments" element={<Appointment />} />
                <Route path="/toPatientInfoAdmin" element={<Patient />} />
                <Route path="/updatePatient/:patientId" element={<UpdatePatient />} />
                <Route path="/addPatient" element={<AddPatient />} />
                <Route path="/addDoctor" element={<AddDoctor />} />
                <Route path="/updateDoctor/:doctorId" element={<UpdateDoctor />} />

                {/*   doctor dashboard*/}

                <Route path="/doctorappointment/:doctorId" element={<DAppointment />} />
                <Route path="/generate-medical-record/:appointmentId/:doctorId" element={<GenerateMedicalRecords />} />
                <Route path="/create-prescription/:recordId/:doctorId" element={<CreatePrescription />} />
                <Route path="/update-prescription/:recordId/:doctorId" element={<UpdatePrescriptions />} />
                <Route path="/medicalhistory/:doctorId" element={<MedicalRecordByAppointment />} />

          
            </Routes>
        </Router>
    );
}

export default App;