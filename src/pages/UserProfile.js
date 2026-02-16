
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';


function UserProfile() {
    const { currentUser: user, logout, openLoginModal } = useAuth();
    const navigate = useNavigate();

    // Default User Data (Simulated Fetch)
    const [userData, setUserData] = useState({
        name: 'Guest User',
        email: 'guest@example.com',
        dob: '',
        address: '',
        stateCode: '',
        rtoCode: ''
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ ...userData });

    const [profileImage, setProfileImage] = useState(null);
    const fileInputRef = React.useRef(null);

    // Initialize data from Auth Context and Local Storage
    useEffect(() => {
        if (user) {
            const userId = user.uid;
            const savedData = localStorage.getItem(`user_data_${userId}`);

            if (savedData) {
                const parsed = JSON.parse(savedData);
                setUserData(parsed);
                setEditForm(parsed);
            } else {
                const initialData = {
                    name: user.displayName || user.email.split('@')[0],
                    email: user.email,
                    dob: '',
                    address: '',
                    stateCode: '',
                    rtoCode: ''
                };
                setUserData(initialData);
                setEditForm(initialData);
            }

            // Load saved image from local storage if available (User Specific)
            const savedImage = localStorage.getItem(`user_profile_image_${userId}`);
            if (savedImage) setProfileImage(savedImage);
        }
    }, [user]);

    const handleEditToggle = () => {
        if (isEditing) {
            // Cancel mode - revert changes
            setEditForm({ ...userData });
        }
        setIsEditing(!isEditing);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
                // In a real app, you would upload 'file' to server here
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setProfileImage(null);
        if (user) {
            localStorage.removeItem(`user_profile_image_${user.uid}`);
        }
    };

    const handleSaveProfile = () => {
        // Validation (Basic)
        if (!editForm.name || !editForm.dob || !editForm.address || !editForm.stateCode || !editForm.rtoCode) {
            alert("Please fill all mandatory fields.");
            return;
        }

        // Save Logic (User Specific)
        const userId = user.uid;
        setUserData({ ...editForm });
        localStorage.setItem(`user_data_${userId}`, JSON.stringify(editForm));

        if (profileImage) {
            localStorage.setItem(`user_profile_image_${userId}`, profileImage);
        }
        setIsEditing(false);
        alert("Profile updated successfully!");
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch {
            console.error("Failed to log out");
        }
    };

    if (!user) {
        return (
            <div className="guest-view">

                <Header />
                <div className="guest-container">
                    <div className="guest-card">
                        <h2>Access Restricted</h2>
                        <p>Please log in to view your profile.</p>
                        <button onClick={openLoginModal} className="primary-btn">Log In</button>
                    </div>
                </div>
                <Footer />
                <style>{`
                 /* Global Page Styles */
                .profile-page {
                    min-height: 100vh;
                    background-color: #000000;
                    color: #fff;
                    font-family: 'Inter', sans-serif;
                    display: flex; flex-direction: column;
                }
                
                .main-container {
                    flex: 1;
                    padding: 100px 20px 60px;
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                }

                .profile-card {
                    background: #0a0a0a;
                    border: 1px solid #333;
                    border-radius: 20px;
                    width: 100%;
                    max-width: 900px;
                    padding: 40px;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                }

                /* Header */
                .profile-header {
                    display: flex;
                    align-items: center;
                    gap: 30px;
                    margin-bottom: 30px;
                }
                .avatar-container {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .avatar-circle {
                    width: 100px; height: 100px;
                    background: linear-gradient(135deg, #F5821F, #ff6b6b);
                    border-radius: 50%;
                    display: flex; justify-content: center; align-items: center;
                    font-size: 40px; font-weight: bold; color: #fff;
                    box-shadow: 0 10px 30px rgba(245, 130, 31, 0.4);
                    overflow: hidden;
                    border: 3px solid #1a1a1a;
                    margin-bottom: 10px;
                }
                .avatar-circle img {
                    width: 100%; height: 100%; object-fit: cover;
                }
                
                .image-controls {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                    align-items: center;
                    position: absolute;
                    bottom: -30px;
                    z-index: 10;
                    width: 100%;
                }
                
                .img-btn {
                    font-size: 11px;
                    padding: 4px 10px;
                    background: #ffffff;
                    color: #000;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 600;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    transition: transform 0.2s;
                    white-space: nowrap;
                }
                .img-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,0,0,0.3); }
                
                .img-btn.remove { 
                    background: rgba(255, 71, 87, 0.1); 
                    color: #ff4757; 
                    border: 1px solid rgba(255, 71, 87, 0.3);
                    background: #000; /* Contrast against the dark card */
                }
                .img-btn.remove:hover { background: #ff4757; color: white; border-color: #ff4757; }

                .header-info h1 { margin: 0 0 5px; font-size: 28px; }
                .header-info p { color: #888; margin: 0 0 15px; }
                .badge { 
                    background: rgba(22, 163, 74, 0.2); color: #16a34a; 
                    padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; 
                    border: 1px solid rgba(22, 163, 74, 0.4);
                }
                .header-actions { margin-left: auto; }


                /* Buttons */
                .edit-btn, .save-btn {
                    padding: 10px 25px; border-radius: 8px; font-weight: 600; cursor: pointer; border: none; white-space: nowrap;
                }
                .edit-btn { background: #333; color: #fff; transition: 0.3s; }
                .edit-btn:hover { background: #444; }
                
                .save-btn { background: #F5821F; color: #fff; margin-right: 10px; }
                .cancel-btn { background: transparent; color: #888; border: none; cursor: pointer; }
                .cancel-btn:hover { color: #fff; }

                .divider { height: 1px; background: #222; margin: 30px 0; }

                /* Form */
                .section-title { font-size: 18px; color: #F5821F; margin-bottom: 25px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }

                .form-grid {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 30px;
                }
                .form-group { display: flex; flex-direction: column; gap: 8px; }
                .form-group.full-width { grid-column: span 2; }
                
                label { color: #888; font-size: 13px; font-weight: 500; }
                .required { color: #dc2626; }

                input, textarea {
                    padding: 12px 15px; background: #111; border: 1px solid #333;
                    border-radius: 8px; color: #fff; font-size: 15px; font-family: 'Inter', sans-serif;
                    outline: none; transition: 0.3s;
                }
                .input-disabled { background: #050505; border-color: #222; color: #666; cursor: not-allowed; }
                .input-view { background: transparent; border-color: transparent; padding-left: 0; pointer-events: none; color: #ddd; font-weight: 500; font-size: 16px; } 
                .input-editable { border-color: #555; background: #1a1a1a; }
                .input-editable:focus { border-color: #F5821F; box-shadow: 0 0 0 2px rgba(245, 130, 31, 0.2); }

                .logout-link {
                    background: none; border: none; color: #dc2626; font-weight: 600;
                    cursor: pointer; padding: 0; font-size: 14px; margin-top: 10px;
                }
                .logout-link:hover { text-decoration: underline; }

                /* Guest View */
                .guest-view { min-height: 100vh; background: #000; color: #fff; display: flex; flex-direction: column; padding-top: 100px; box-sizing: border-box; }
                .guest-container { flex: 1; display: flex; justify-content: center; align-items: center; }
                .guest-card { background: #111; padding: 40px; border-radius: 16px; text-align: center; border: 1px solid #333; }
                .primary-btn { margin-top: 20px; padding: 10px 25px; background: #F5821F; color: white; border: none; border-radius: 6px; cursor: pointer; }

                /* Responsive */
                @media (max-width: 768px) {
                    .profile-header { flex-direction: column; text-align: center; gap: 40px; } /* Added gap for buttons */
                    .header-actions { margin-left: 0; margin-top: 20px; }
                    .form-grid { grid-template-columns: 1fr; }
                    .form-group.full-width { grid-column: span 1; }
                    .main-container { padding: 80px 20px; }
                    .image-controls { bottom: -35px; }
                }
                `}</style>
            </div>
        );
    }

    return (
        <div className="profile-page">

            <Header />

            <div className="main-container">
                <div className="profile-card">
                    {/* Header Section */}
                    <div className="profile-header">
                        <div className="avatar-container">
                            <div className="avatar-circle">
                                {profileImage ? (
                                    <img src={profileImage} alt="Profile" />
                                ) : (
                                    userData.name.charAt(0)
                                )}
                            </div>

                            {isEditing && (
                                <div className="image-controls">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                    />
                                    <button className="img-btn" onClick={() => fileInputRef.current.click()}>
                                        Update Photo
                                    </button>
                                    {profileImage && (
                                        <button className="img-btn remove" onClick={handleRemoveImage}>
                                            Remove Photo
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="header-info">
                            <h1>{userData.name}</h1>
                            <p>{userData.email}</p>
                            <span className="badge">Verified User</span>
                        </div>
                        <div className="header-actions">
                            {!isEditing ? (
                                <button onClick={handleEditToggle} className="edit-btn">Edit Profile</button>
                            ) : (
                                <div className="edit-actions">
                                    <button onClick={handleSaveProfile} className="save-btn">Save Changes</button>
                                    <button onClick={handleEditToggle} className="cancel-btn">Cancel</button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="divider"></div>

                    {/* Details Section */}
                    <div className="details-section">
                        <h3 className="section-title">Personal Information</h3>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Full Name <span className="required">*</span></label>
                                <input
                                    type="text"
                                    value={isEditing ? editForm.name : userData.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    disabled={!isEditing}
                                    className={isEditing ? 'input-editable' : 'input-view'}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input type="text" value={userData.email} disabled className="input-disabled" />
                            </div>

                            <div className="form-group">
                                <label>Date of Birth <span className="required">*</span></label>
                                <input
                                    type="date"
                                    value={editForm.dob}
                                    onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
                                    disabled={!isEditing}
                                    className={isEditing ? 'input-editable' : 'input-view'}
                                />
                            </div>
                            <div className="form-group">
                                <label>State Code <span className="required">*</span></label>
                                <input
                                    type="text"
                                    value={editForm.stateCode}
                                    onChange={(e) => setEditForm({ ...editForm, stateCode: e.target.value.toUpperCase() })}
                                    disabled={!isEditing}
                                    className={isEditing ? 'input-editable' : 'input-view'}
                                    placeholder="KA"
                                    maxLength="2"
                                />
                            </div>
                            <div className="form-group full-width">
                                <label>Address <span className="required">*</span></label>
                                <textarea
                                    rows="2"
                                    value={editForm.address}
                                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                    disabled={!isEditing}
                                    className={isEditing ? 'input-editable' : 'input-view'}
                                />
                            </div>
                            <div className="form-group">
                                <label>RTO Code <span className="required">*</span></label>
                                <input
                                    type="text"
                                    value={editForm.rtoCode}
                                    onChange={(e) => setEditForm({ ...editForm, rtoCode: e.target.value.toUpperCase() })}
                                    disabled={!isEditing}
                                    className={isEditing ? 'input-editable' : 'input-view'}
                                    placeholder="KA-01"
                                    maxLength="10"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="divider"></div>

                    <button onClick={handleLogout} className="logout-link">Log Out</button>

                </div>
            </div>

            <Footer />

            <style>{`
                /* Global Page Styles */
                .profile-page {
                    min-height: 100vh;
                    background-color: #000000;
                    color: #fff;
                    font-family: 'Inter', sans-serif;
                    display: flex; flex-direction: column;
                }
                
                .main-container {
                    flex: 1;
                    padding: 100px 20px 60px;
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                }

                .profile-card {
                    background: #0a0a0a;
                    border: 1px solid #333;
                    border-radius: 20px;
                    width: 100%;
                    max-width: 900px;
                    padding: 40px;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                }

                /* Header */
                .profile-header {
                    display: flex;
                    align-items: center;
                    gap: 40px;
                    margin-bottom: 40px;
                }
                
                .avatar-container {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .avatar-circle {
                    width: 140px; 
                    height: 140px;
                    background: linear-gradient(135deg, #F5821F, #ff6b6b);
                    border-radius: 50%;
                    display: flex; justify-content: center; align-items: center;
                    font-size: 50px; font-weight: bold; color: #fff;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    overflow: hidden; /* CRITICAL FIX */
                    border: 4px solid #1a1a1a;
                    flex-shrink: 0;
                }
                
                .avatar-circle img {
                    width: 100%; 
                    height: 100%; 
                    object-fit: cover; /* CRITICAL FIX */
                    display: block;
                }
                
                .image-controls {
                    display: flex;
                    gap: 10px;
                    margin-top: 20px;
                }
                
                .img-btn {
                    padding: 8px 16px;
                    font-size: 13px;
                    font-weight: 600;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: none;
                    background: #ffffff;
                    color: #000;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                }
                
                .img-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                }
                
                .img-btn.remove { 
                    background: #1a1a1a;
                    color: #ff4d4d;
                    border: 1px solid rgba(255, 77, 77, 0.3);
                }
                
                .img-btn.remove:hover {
                    background: #ff4d4d;
                    color: #fff;
                    border-color: #ff4d4d;
                }

                .header-info h1 { margin: 0 0 8px; font-size: 32px; letter-spacing: -0.5px; }
                .header-info p { color: #888; margin: 0 0 15px; font-size: 16px; }
                .badge { 
                    background: rgba(22, 163, 74, 0.2); color: #16a34a; 
                    padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; 
                    border: 1px solid rgba(22, 163, 74, 0.4);
                }
                .header-actions { margin-left: auto; align-self: flex-start; }

                /* Buttons */
                .edit-btn, .save-btn {
                    padding: 10px 25px; border-radius: 8px; font-weight: 600; cursor: pointer; border: none; white-space: nowrap;
                }
                .edit-btn { background: #333; color: #fff; transition: 0.3s; }
                .edit-btn:hover { background: #444; }
                
                .save-btn { background: #F5821F; color: #fff; margin-right: 10px; }
                .cancel-btn { background: transparent; color: #888; border: none; cursor: pointer; }
                .cancel-btn:hover { color: #fff; }

                .divider { height: 1px; background: #222; margin: 30px 0; }

                /* Form */
                .section-title { font-size: 18px; color: #F5821F; margin-bottom: 25px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }

                .form-grid {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 30px;
                }
                .form-group { display: flex; flex-direction: column; gap: 8px; }
                .form-group.full-width { grid-column: span 2; }
                
                label { color: #888; font-size: 13px; font-weight: 500; }
                .required { color: #dc2626; }

                input, textarea {
                    padding: 12px 15px; background: #111; border: 1px solid #333;
                    border-radius: 8px; color: #fff; font-size: 15px; font-family: 'Inter', sans-serif;
                    outline: none; transition: 0.3s;
                }
                .input-disabled { background: #050505; border-color: #222; color: #666; cursor: not-allowed; }
                .input-view { background: transparent; border-color: transparent; padding-left: 0; pointer-events: none; color: #ddd; font-weight: 500; font-size: 16px; } 
                .input-editable { border-color: #555; background: #1a1a1a; }
                .input-editable:focus { border-color: #F5821F; box-shadow: 0 0 0 2px rgba(245, 130, 31, 0.2); }

                .logout-link {
                    background: none; border: none; color: #dc2626; font-weight: 600;
                    cursor: pointer; padding: 0; font-size: 14px; margin-top: 10px;
                }
                .logout-link:hover { text-decoration: underline; }

                /* Guest View */
                .guest-view { min-height: 100vh; background: #000; color: #fff; display: flex; flex-direction: column; }
                .guest-container { flex: 1; display: flex; justify-content: center; align-items: center; }
                .guest-card { background: #111; padding: 40px; border-radius: 16px; text-align: center; border: 1px solid #333; }
                .primary-btn { margin-top: 20px; padding: 10px 25px; background: #F5821F; color: white; border: none; border-radius: 6px; cursor: pointer; }

                /* Responsive */
                @media (max-width: 768px) {
                    .profile-header { flex-direction: column; text-align: center; }
                    .header-actions { margin-left: 0; margin-top: 20px; }
                    .form-grid { grid-template-columns: 1fr; }
                    .form-group.full-width { grid-column: span 1; }
                    .main-container { padding: 80px 20px; }
                }
            `}</style>
        </div>
    );
}

export default UserProfile;
