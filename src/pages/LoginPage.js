import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


function LoginPage({ isModal, onClose }) {
    // -- State --
    const [isRegistering, setIsRegistering] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Login Form State
    const [formData, setFormData] = useState({ email: '', password: '' });

    // Register Form State
    const [regData, setRegData] = useState({ name: '', email: '', password: '', confirmPassword: '' });

    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const { login, register } = useAuth();
    const navigate = useNavigate();

    // -- Handlers --

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors([]);
    };

    const handleRegChange = (e) => {
        const { name, value } = e.target;
        setRegData(prev => ({ ...prev, [name]: value }));
        setErrors([]);
    };

    const validateLogin = () => {
        const newErrors = [];
        if (!formData.email.trim()) newErrors.push({ field: 'email', message: 'User ID is required' });
        if (!formData.password) newErrors.push({ field: 'password', message: 'Password is required' });
        return newErrors;
    };

    const validateRegister = () => {
        const newErrors = [];
        if (!regData.name.trim()) newErrors.push({ field: 'name', message: 'Name is required' });
        if (!regData.email.trim()) newErrors.push({ field: 'email', message: 'User ID (Email) is required' });
        if (!regData.password) newErrors.push({ field: 'password', message: 'Password is required' });
        if (regData.password !== regData.confirmPassword) newErrors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
        return newErrors;
    };

    const getErrorClass = (fieldName) => {
        return errors.some(e => e.field === fieldName) ? 'error-input' : '';
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        const errs = validateLogin();
        if (errs.length) return setErrors(errs);

        setIsLoading(true);
        try {
            await login(formData.email, formData.password);
            if (isModal && onClose) onClose();
            else {
                // If it's an admin email, redirect to /admin
                if (formData.email.includes('admin')) {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            }
        } catch (error) {
            setErrors([{ message: 'Invalid User ID or Password' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        const errs = validateRegister();
        if (errs.length) return setErrors(errs);

        setIsLoading(true);
        try {
            await register(regData.email, regData.password);
            // Registration successful - Firebase auto-logs in
            setIsLoading(false);
            setShowSuccess(true);

            setTimeout(() => {
                setShowSuccess(false);
                setIsRegistering(false);
                navigate('/');
            }, 2500);
        } catch (error) {
            setErrors([{ message: error.message || 'Registration failed' }]);
            setIsLoading(false);
        }
    };

    return (
        <div className={`login-page ${isModal ? 'modal-mode' : ''}`}>

            {/* Always show background, even in modal mode */}
            <div className={`login-bg ${showSuccess ? 'blur-bg' : ''}`}></div>

            <style>{`
                @keyframes zoom { 0% { transform: scale(1); } 100% { transform: scale(1.1); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                
                .login-page {
                  min-height: 100vh; display: flex; align-items: center; justify-content: center;
                  background: #000000; font-family: 'Inter', sans-serif; padding: 20px;
                  position: relative; overflow: hidden; color: #ffffff;
                }
                .login-page.modal-mode {
                    position: fixed;
                    inset: 0;
                    z-index: 8000; /* Lower than Header (9999) */
                    background: rgba(0, 0, 0, 0.85);
                    backdrop-filter: blur(10px);
                    padding: 20px;
                    overflow: auto;
                    min-height: 100vh;
                }
                .login-page * { box-sizing: border-box; }
                
                .login-bg {
                    display: none;
                }

                .success-overlay {
                    position: absolute; inset: 0; z-index: 100;
                    background: black;
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    animation: fadeIn 0.5s ease-out;
                    color: white; font-family: 'Inter', sans-serif;
                    border-radius: 24px;
                }
                .success-icon {
                    width: 80px; height: 80px; border: 4px solid white; border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    margin-bottom: 20px;
                }
                /* Close button style removed */
            `}</style>

            {showSuccess && (
                <div className="success-overlay">
                    <div className="success-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <h2>Thank You!</h2>
                    <p>Registration Successful</p>
                </div>
            )}

            {!showSuccess && (
                <div className="login-container">
                    {/* Close button removed */}
                    {/* Left: Graphic Side */}
                    <div className="graphic-side">
                        <div className="pes-circles">
                            {/* Reusing existing circle divs */}
                            <div className="ring r1" style={{ width: '450px', height: '450px', borderTopColor: 'rgba(0, 198, 255, 0.3)', animation: 'spin 25s linear infinite' }}></div>
                            <div className="ring r2" style={{ width: '350px', height: '350px', borderBottomColor: 'rgba(0, 114, 255, 0.3)', animation: 'spin 20s linear reverse infinite' }}></div>
                        </div>
                        <div className="content">
                            <img src="/assets/login_con.png" alt="Traffic Control" className="hero-img" onError={(e) => e.target.style.display = 'none'} />
                            <p className="tagline">Smart Traffic Solutions for a Connected World.</p>
                        </div>
                    </div>

                    {/* Right: Form Side */}
                    <div className="form-side">
                        <div className="form-wrapper">
                            <div className="header">
                                <img src="/assets/ECR_LOGO.svg" alt="ECR Logo" className="logo" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML += '<span>ECR Portal</span>' }} />
                                <h1>{isRegistering ? 'Create Account' : 'Welcome Back'}</h1>
                                <p className="sub">{isRegistering ? 'Join the network' : 'Login to your account'}</p>
                            </div>

                            <form onSubmit={isRegistering ? handleRegisterSubmit : handleLoginSubmit}>
                                {/* Only show banner for non-field errors (like Invalid Creds) */}
                                {errors.filter(e => !e.field).map((e, i) => (
                                    <div key={i} className="error-banner">{e.message}</div>
                                ))}

                                {isRegistering ? (
                                    <>
                                        <div className="group">
                                            <input name="name" placeholder="Full Name" value={regData.name} onChange={handleRegChange} disabled={isLoading} className={getErrorClass('name')} />
                                        </div>
                                        <div className="group">
                                            <input name="email" placeholder="User ID (Email)" value={regData.email} onChange={handleRegChange} disabled={isLoading} className={getErrorClass('email')} />
                                        </div>
                                        <div className="group">
                                            <input type="password" name="password" placeholder="Password" value={regData.password} onChange={handleRegChange} disabled={isLoading} className={getErrorClass('password')} />
                                        </div>
                                        <div className="group">
                                            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={regData.confirmPassword} onChange={handleRegChange} disabled={isLoading} className={getErrorClass('confirmPassword')} />
                                        </div>
                                        <button type="submit" disabled={isLoading}>
                                            {isLoading ? 'Creating...' : 'Create Account'}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="group">
                                            <label>User ID</label>
                                            <input name="email" value={formData.email} onChange={handleLoginChange} disabled={isLoading} placeholder="Enter your ID" className={getErrorClass('email')} />
                                        </div>
                                        <div className="group">
                                            <label>Password</label>
                                            <input type="password" name="password" value={formData.password} onChange={handleLoginChange} disabled={isLoading} placeholder="Enter password" className={getErrorClass('password')} />
                                        </div>
                                        <button type="submit" disabled={isLoading}>
                                            {isLoading ? 'Logging In...' : 'Login'}
                                        </button>
                                    </>
                                )}
                            </form>

                            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#888' }}>
                                {isRegistering ? "Already have an account? " : "Don't have an account? "}
                                <span
                                    onClick={() => { setIsRegistering(!isRegistering); setErrors([]); }}
                                    style={{ color: '#F5821F', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    {isRegistering ? 'Login' : 'Create Account'}
                                </span>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* Embed existing CSS but updated */}
            <style>{`
                .login-page {
                  min-height: 100vh; display: flex; align-items: center; justify-content: center;
                  background: #000000; font-family: 'Inter', sans-serif; padding: 20px;
                  position: relative; overflow: hidden; color: #ffffff;
                }
                .login-page * { box-sizing: border-box; }
                
                .login-container {
                  position: relative; z-index: 10; display: flex;
                  width: 100%; max-width: 900px; min-height: 550px;
                  background: rgba(20, 20, 20, 0.6); backdrop-filter: blur(20px);
                  border: 1px solid rgba(255, 255, 255, 0.1);
                  border-radius: 24px; overflow: hidden;
                  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
                }

                .graphic-side {
                    flex: 1.2; position: relative; overflow: hidden;
                    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
                    display: flex; align-items: center; justify-content: center;
                    border-right: 1px solid rgba(255, 255, 255, 0.05);
                }
                .pes-circles { position: absolute; inset: 0; pointer-events: none; }
                .ring { position: absolute; top: 50%; left: 50%; border-radius: 50%; transform: translate(-50%, -50%); border: 1px solid rgba(255, 255, 255, 0.05); }
                @keyframes spin { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

                .content { position: relative; z-index: 2; text-align: center; padding: 20px; }
                .hero-img { width: 380px; filter: drop-shadow(0 0 20px rgba(142, 45, 226, 0.3)); animation: float 6s ease-in-out infinite; object-fit: contain; }
                .tagline { margin-top: 25px; color: rgba(255,255,255,0.7); font-size: 14px; letter-spacing: 1px; text-transform: uppercase; }

                .form-side { flex: 1; padding: 40px; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.2); }
                .form-wrapper { width: 100%; max-width: 320px; }
                .header { text-align: center; margin-bottom: 25px; }
                .logo { width: 120px; display: block; margin: 0 auto 15px; }
                h1 { color: #ffffff; font-size: 24px; font-weight: 700; margin: 0; }
                .sub { color: #F5821F; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 8px; }

                .group { margin-bottom: 15px; }
                label { display: block; color: rgba(255, 255, 255, 0.6); font-size: 11px; font-weight: 500; text-transform: uppercase; margin-bottom: 5px; }
                input {
                    width: 100%; padding: 12px; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px;
                    background: rgba(255, 255, 255, 0.03); font-size: 14px; color: #ffffff; transition: all 0.3s ease;
                }
                input:focus { outline: none; border-color: #F5821F; background: rgba(245, 130, 31, 0.05); }
                .error-input { border-color: #ff4d4d !important; background: rgba(255, 77, 77, 0.05) !important; box-shadow: 0 0 0 3px rgba(255, 77, 77, 0.2) !important; }
                button {
                    width: 100%; padding: 14px; border: none; border-radius: 50px;
                    background: #F5821F;
                    color: white; font-weight: 700; font-size: 14px; text-transform: uppercase; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); margin-top: 10px;
                    box-shadow: 0 10px 20px rgba(245, 130, 31, 0.2);
                }
                button:hover:not(:disabled) { transform: translateY(-3px); filter: brightness(1.1); box-shadow: 0 15px 30px rgba(245, 130, 31, 0.4); }
                .error-banner { background: rgba(255, 77, 77, 0.1); border: 1px solid rgba(255, 77, 77, 0.2); color: #ff4d4d; padding: 8px; border-radius: 6px; font-size: 12px; margin-bottom: 15px; text-align: center; }
                
                @media (max-width: 900px) {
                  .login-container { flex-direction: column; max-width: 450px; }
                  .graphic-side { padding: 40px 20px; border-right: none; }
                  .hero-img { width: 200px; }
                }
            `}</style>
        </div>
    );
}

export default LoginPage;
