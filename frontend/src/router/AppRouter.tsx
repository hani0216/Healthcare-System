import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../features/auth/pages/LoginPage';

export default function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </Router>
    );
}
