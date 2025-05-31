import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../features/auth/pages/LoginPage';
import SignUpPage from '../features/auth/pages/SignUpPage';
import DoctorSecondSignupPage from '../features/auth/pages/DoctorSecondSignupPage'
import PatientSecondSignupPage from '../features/auth/pages/PatientSecondSignupPage'
import InsuranceSignUp from '../features/auth/pages/InsuranceSecondSignupPage'
import InsuranceHome from '../features/insuranceDashboard/pages/InsuranceHome'
import DoctorHome from '../features/doctorDashboard/pages/DoctorHome'
import PatientHome from '../features/dashboard/pages/PatientHome';
import PatientNotification from '../features/dashboard/pages/PatienNotification';
import HistoryPage from '../features/dashboard/pages/HistoryPage';
import ProfilePage from '../features/dashboard/pages/ProfilePage';
import CalendarPage from '../features/dashboard/pages/CalendarPage';
import SearchPage from '../features/dashboard/pages/SearchPage';
import ReimbursementPage from '../features/dashboard/pages/ReimbursementPage';
import MedicalRecordPage from '../features/dashboard/pages/MedicalRecordPage';




export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signUp" element={<SignUpPage />} />
        <Route path='/doctorSignUp' element={<DoctorSecondSignupPage />} />
        <Route path='/patientSecondForm' element={<PatientSecondSignupPage />} />
        <Route path='/insuranceSignUp' element={<InsuranceSignUp />} />
        <Route path='/insuranceHome' element={<InsuranceHome />}></Route>
        <Route path='/doctorHome' element={<DoctorHome />}></Route>
        <Route path='/patientHome' element={<PatientHome />}></Route>
        <Route path='/patientNotification' element={<PatientNotification />}></Route>
        <Route path='/history' element={<HistoryPage />}></Route>
        <Route path='/profile' element={<ProfilePage />}></Route>
        <Route path='/calendar' element={<CalendarPage />}></Route>
        <Route path='/search' element={<SearchPage />}></Route>
        <Route path='/reimbursement' element={<ReimbursementPage />}></Route>
        <Route path='/medical-record' element={<MedicalRecordPage />}></Route>
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* <Route path="/profile" element={<Profile />} /> */}
        {/* <Route path="/settings" element={<Settings />} /> */}
        {/* <Route path="*" element={<NotFound />} /> */}

      </Routes>
    </Router>
  );
}
