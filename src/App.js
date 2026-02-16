import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import UserProfile from './pages/UserProfile';
import DocumentVerification from './pages/DocumentVerification';
import ContactPage from './pages/ContactPage';
import ResourcesPage from './pages/ResourcesPage';
import PayChallan from './pages/PayChallan';
import NewsPage from './pages/NewsPage';
import SearchResults from './pages/SearchResults';
import AdminDashboard from './pages/AdminDashboard';
import LogPage from './pages/LogPage';
import BackgroundAnimation from './components/BackgroundAnimation';

import { useAuth } from './contexts/AuthContext';

const LoginModalWrapper = () => {
    const { isLoginModalOpen, closeLoginModal } = useAuth();
    return isLoginModalOpen ? <LoginPage isModal={true} onClose={closeLoginModal} /> : null;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <BackgroundAnimation />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/account" element={<Home />} />
                        <Route path="/profile" element={<UserProfile />} />
                        <Route path="/verify-documents" element={<DocumentVerification />} />
                        <Route path="/about-us" element={<ContactPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/resources/*" element={<ResourcesPage />} />
                        <Route path="/pay-challan" element={<PayChallan />} />
                        <Route path="/news" element={<NewsPage />} />
                        <Route path="/search" element={<SearchResults />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/history" element={<LogPage />} />
                    </Routes>
                    <LoginModalWrapper />
                </div>
            </Router>
        </AuthProvider>
    );
}
export default App;
