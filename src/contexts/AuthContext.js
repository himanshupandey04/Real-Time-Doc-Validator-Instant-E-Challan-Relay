import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    auth
} from '../firebase';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from "firebase/auth";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("Firebase Auth State Changed: USER LOGGED IN", user.email);
                // Check if admin (Mock check: if email contains admin)
                user.isAdmin = user.email.includes('admin');
                setCurrentUser(user);
                user.getIdToken().then(t => {
                    setToken(t);
                    localStorage.setItem('token', t);
                    console.log("Token Updated:", t.substring(0, 10) + "...");
                });
            } else {
                console.log("Firebase Auth State Changed: USER LOGGED OUT");
                setCurrentUser(null);
                setToken(null);
                localStorage.removeItem('token');
            }
            setLoading(false);
        });

        // Safety timeout to prevent permanent blank screen if Firebase hangs
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 5000);

        return () => {
            unsubscribe();
            clearTimeout(timeout);
        };
    }, []);

    const login = async (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const register = async (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);

    const value = {
        currentUser,
        token,
        login,
        register,
        logout,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div style={{
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#000',
                    color: '#fff',
                    fontFamily: 'Inter, sans-serif'
                }}>
                    <div className="loader-container" style={{ textAlign: 'center' }}>
                        <div className="spinner" style={{
                            width: '40px',
                            height: '40px',
                            border: '3px solid rgba(255,255,255,0.1)',
                            borderTopColor: '#F5821F',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 20px'
                        }}></div>
                        <p style={{ letterSpacing: '2px', fontSize: '0.8rem', opacity: 0.7 }}>INITIALIZING ECR NETWORK...</p>
                    </div>
                    <style>{`
                        @keyframes spin { to { transform: rotate(360deg); } }
                    `}</style>
                </div>
            ) : children}
        </AuthContext.Provider>
    );
}
