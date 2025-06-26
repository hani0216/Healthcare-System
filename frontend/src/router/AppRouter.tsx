import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../features/auth/pages/LoginPage';
import SignUpPage from '../features/auth/pages/SignUpPage';
import DoctorSecondSignupPage from '../features/auth/pages/DoctorSecondSignupPage'
import PatientSecondSignupPage from '../features/auth/pages/PatientSecondSignupPage'
import InsuranceSignUp from '../features/auth/pages/InsuranceSecondSignupPage'
import InsuranceHome from '../features/insuranceDashboard/pages/InsuranceHome'
import ReimbursementsPage from '../features/insuranceDashboard/pages/ReimbursementsPage'
import DoctorHome from '../features/doctorDashboard/pages/DoctorHome'
import PatientHome from '../features/dashboard/pages/PatientHome';
import PatientNotification from '../features/dashboard/pages/PatienNotification';
import HistoryPage from '../features/dashboard/pages/HistoryPage';
import ProfilePage from '../features/dashboard/pages/ProfilePage';
import CalendarPage from '../features/dashboard/pages/CalendarPage';
import SearchPage from '../features/dashboard/pages/SearchPage';
import ReimbursementPage from '../features/dashboard/pages/ReimbursementPage';
import MedicalRecordPage from '../features/dashboard/pages/MedicalRecordPage';
import DoctorMedicalRecordPage from '../features/doctorDashboard/pages/DoctorMedicalRecordPage';
import MessagesPage from "../features/doctorDashboard/pages/MessagesPage";
import DoctorProfile from '../features/doctorDashboard/pages/DoctorProfile';
import AdminDashboard from '../features/adminDashboard/AdminDashboard';
import InsuranceProfile from '../features/insuranceDashboard/pages/InsuranceProfile';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signUp" element={<SignUpPage />} />
      <Route path='/doctorSignUp' element={<DoctorSecondSignupPage />} />
      <Route path='/patientSecondForm' element={<PatientSecondSignupPage />} />
      <Route path='/insuranceSignUp' element={<InsuranceSignUp />} />
      <Route path='/insuranceHome' element={<InsuranceHome />}></Route>
      <Route path='/insuranceReimbursements' element={<ReimbursementsPage />}></Route>
      <Route path='/doctorHome' element={<DoctorHome />}></Route>
      <Route path='/patientHome' element={<PatientHome />}></Route>
      <Route path='/patientNotification' element={<PatientNotification />}></Route>
      <Route path='/history' element={<HistoryPage />}></Route>
      <Route path='/profile' element={<ProfilePage />}></Route>
      <Route path='/calendar' element={<CalendarPage />}></Route>
      <Route path='/search' element={<SearchPage />}></Route>
      <Route path='/reimbursement' element={<ReimbursementPage />}></Route>
      <Route path='/medical-record' element={<MedicalRecordPage />}></Route>
      <Route path="/doctor/patient/:patientId/medical-record" element={<DoctorMedicalRecordPage />} />
      <Route path="/messages" element={<MessagesPage />} />
      <Route path="/doctorProfile" element={<DoctorProfile />} />
      <Route path="/adminDashboard" element={<AdminDashboard />} />
      <Route path="/insuranceProfile" element={<InsuranceProfile />} />

      {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      {/* <Route path="/profile" element={<Profile />} /> */}
      {/* <Route path="/settings" element={<Settings />} /> */}
      {/* <Route path="*" element={<NotFound />} /> */}

    </Routes>
  );
}
