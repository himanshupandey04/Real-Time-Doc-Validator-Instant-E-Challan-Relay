import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';


function DocumentVerification() {
    const navigate = useNavigate();
    const [regNo, setRegNo] = useState('');
    const [vehicleData, setVehicleData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('rc');
    const [activeCard, setActiveCard] = useState(null);

    const handleVerify = async () => {
        if (!regNo) return;
        setLoading(true);

        try {
            const response = await fetch(`http://localhost:5000/api/vehicle/${regNo}`);
            const result = await response.json();

            if (result.found) {
                const d = result.data;
                setVehicleData({
                    summary: {
                        regNo: d.plate_number,
                        owner: d.owner_name,
                        makeModel: d.make_model,
                        class: d.vehicle_type,
                        status: d.rc_status === 'Valid' ? 'Active' : 'Mismatched'
                    },
                    status: {
                        rc: d.rc_status,
                        insurance: d.insurance_status,
                        puc: d.puc_status,
                        fitness: d.fitness_status,
                        permit: d.permit_status
                    },
                    rcDetails: {
                        regNo: d.plate_number,
                        ownerName: d.owner_name,
                        vehicleClass: d.vehicle_type,
                        makeModel: d.make_model,
                        fuel: d.fuel_type || 'N/A',
                        chassis: d.raw_data?.Chassis_Number || 'N/A',
                        engine: d.raw_data?.Engine_Number || 'N/A',
                        regDate: d.raw_data?.Registration_Date || 'N/A',
                        rcStatus: d.rc_status
                    },
                    insurance: {
                        policyNo: d.raw_data?.Insurance_Policy_Number || 'N/A',
                        insurer: d.raw_data?.Insurer || 'N/A',
                        expiryDate: d.raw_data?.Insurance_Expiry || 'N/A',
                        status: d.insurance_status
                    },
                    puc: {
                        number: d.raw_data?.PUC_Number || 'N/A',
                        expiryDate: d.raw_data?.PUC_Expiry || 'N/A',
                        status: d.puc_status
                    },
                    fitness: {
                        expiryDate: d.raw_data?.Fitness_Expiry || 'N/A',
                        status: d.fitness_status
                    },
                    permit: {
                        status: d.permit_status
                    }
                });
            } else {
                alert("Vehicle not found in database.");
                setVehicleData(null);
            }
        } catch (err) {
            console.error(err);
            alert("Verification failed.");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        if (status === 'Valid' || status === 'Active') return '#16a34a';
        if (status === 'Expired') return '#dc2626';
        if (status === 'Expiring Soon') return '#f59e0b';
        return '#9ca3af';
    };

    const handlePrint = () => {
        window.print();
    };

    const cardDetails = {
        compliance: {
            title: "Mandatory Document Compliance (MVA 1988)",
            content: (
                <div>
                    <p>According to the <strong>Motor Vehicles Act, 1988</strong> and Central Motor Vehicle Rules (CMVR), all vehicles must carry valid digital or physical copies of:</p>
                    <ul style={{ textAlign: 'left', marginTop: '15px' }}>
                        <li><strong>Section 39:</strong> Registration Certificate (RC) is mandatory for vehicle use.</li>
                        <li><strong>Section 146:</strong> Valid Third-Party Insurance is compulsory.</li>
                        <li><strong>Section 115(7):</strong> Pollution Under Control (PUC) certificate is required (valid for 6 months/1 year).</li>
                        <li><strong>Commercial Vehicles:</strong> Must strictly hold a valid Fitness Certificate and Permit.</li>
                    </ul>
                    <div className="highlight-box-modal">
                        Non-compliance leads to immediate e-challan generation and potential vehicle impoundment.
                    </div>
                </div>
            )
        },
        traffic: {
            title: "Document Related Penalties (2019 Amendment)",
            content: (
                <div>
                    <p>Penalties for driving without valid documents under the <strong>Motor Vehicles (Amendment) Act, 2019</strong>:</p>
                    <table className="penalty-table">
                        <thead><tr><th>Document / Violation</th><th>Fine Amount</th><th>Details</th></tr></thead>
                        <tbody>
                            <tr><td><strong>Registration (RC)</strong></td><td>₹5,000</td><td>Driving unregistered vehicle (Sec 192)</td></tr>
                            <tr><td><strong>Insurance</strong></td><td>₹2,000</td><td>First Offense (Sec 196)</td></tr>
                            <tr><td><strong>PUC Certificate</strong></td><td>₹10,000</td><td>Pollution Norm Violation (Sec 190(2))</td></tr>
                            <tr><td><strong>Driving License</strong></td><td>₹5,000</td><td>Driving w/o License (Sec 181)</td></tr>
                            <tr><td><strong>Fitness / Permit</strong></td><td>₹10,000</td><td>Commercial Vehicle Rules (Sec 192A)</td></tr>
                        </tbody>
                    </table>
                    <p style={{ marginTop: '15px', fontSize: '13px', color: '#999' }}>* Repeat offenses may attract double penalties or imprisonment.</p>
                </div>
            )
        },
        digital: {
            title: "Smart Traffic Monitoring & E-Enforcement",
            content: (
                <div>
                    <p>The ECR Portal integrates with the <strong>ITMS (Intelligent Traffic Management System)</strong> to ensure seamless enforcement:</p>
                    <ul style={{ textAlign: 'left', marginTop: '15px' }}>
                        <li><strong>ANPR Cameras:</strong> Automatic Number Plate Recognition cameras scan plates at junctions.</li>
                        <li><strong>Instant Verification:</strong> Scanned plates are cross-referenced with the VAHAN database in real-time.</li>
                        <li><strong>Digital Challan:</strong> Violations (Speeding, Red Light, No Helmet) generate automatic SMS/Email notices.</li>
                        <li><strong>Evidence:</strong> All challans are backed by photographic/video evidence attached to your vehicle record.</li>
                    </ul>
                </div>
            )
        }
    };

    const openCardModal = (type) => {
        setActiveCard(type);
    };

    const closeCardModal = () => {
        setActiveCard(null);
    };

    return (
        <div className="doc-verify-page">

            <Header />

            <div className="container main-content">
                {/* 1. Hero & Search Section - Takes primary focus */}
                <section className="search-section-wrapper">
                    <div className="search-card">
                        <div className="search-content">
                            <h1 className="hero-title">Vehicle Document Verification</h1>
                            <p className="hero-subtext">
                                Verify Registration, Insurance, PUC, and Fitness status of your vehicle to ensure regulatory compliance under the Motor Vehicles Act.
                            </p>

                            <div className="search-box">
                                <input
                                    type="text"
                                    placeholder="Enter Vehicle Registration Number (e.g. KA01AB1234)"
                                    value={regNo}
                                    onChange={(e) => setRegNo(e.target.value)}
                                    className="reg-input"
                                />
                                <button onClick={handleVerify} className="btn-premium btn-primary verify-btn-override" disabled={loading}>
                                    {loading ? 'Verifying...' : 'Verify'}
                                </button>
                            </div>
                        </div>
                        <div className="search-illustration">
                            <div className="doc-scanner-anim">
                                <div className="scanner-box">
                                    <svg width="100" height="120" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        {/* Document Outline */}
                                        <rect x="10" y="10" width="80" height="100" rx="4" stroke="#555" strokeWidth="2" fill="#111" />
                                        {/* Lines representing text */}
                                        <line x1="25" y1="30" x2="75" y2="30" stroke="#333" strokeWidth="2" strokeLinecap="round" />
                                        <line x1="25" y1="45" x2="75" y2="45" stroke="#333" strokeWidth="2" strokeLinecap="round" />
                                        <line x1="25" y1="60" x2="65" y2="60" stroke="#333" strokeWidth="2" strokeLinecap="round" />
                                        <line x1="25" y1="75" x2="75" y2="75" stroke="#333" strokeWidth="2" strokeLinecap="round" />
                                        <line x1="25" y1="90" x2="55" y2="90" stroke="#333" strokeWidth="2" strokeLinecap="round" />

                                        {/* Badge/Stamp */}
                                        <circle cx="70" cy="90" r="12" stroke="#444" strokeWidth="2" />
                                        <path d="M66 90L69 93L75 86" stroke="#444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>

                                    {/* Scanning Line */}
                                    <div className="scan-line"></div>
                                </div>
                                <div className="scanner-status">
                                    <span className="dot"></span> Live Database Sync
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Info Cards (Visible below the fold or after a scroll) */}
                {!vehicleData && !loading && (
                    <>
                        <div className="info-cards-grid">
                            <div className="info-card" onClick={() => openCardModal('compliance')}>
                                <div className="icon">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#F5821F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                    </svg>
                                </div>
                                <h3>Ensure Legal Compliance</h3>
                                <p>Mandatory requirements under Motor Vehicles Act, 1988</p>
                                <span className="read-more">View Details &gt;</span>
                            </div>

                            <div className="info-card" onClick={() => openCardModal('traffic')}>
                                <div className="icon">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#F5821F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="8" x2="12" y2="12"></line>
                                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                    </svg>
                                </div>
                                <h3>Avoid Traffic Penalties</h3>
                                <p>Updated fines and penalties as per 2019 Amendment</p>
                                <span className="read-more">View Fines &gt;</span>
                            </div>

                            <div className="info-card" onClick={() => openCardModal('digital')}>
                                <div className="icon">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#F5821F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                </div>
                                <h3>Digital Traffic Monitoring</h3>
                                <p>How ITMS & ANPR cameras enforce road safety 24/7</p>
                                <span className="read-more">Learn More &gt;</span>
                            </div>
                        </div>

                        <div className="preview-list">
                            <h3>Documents Verified Include:</h3>
                            <ul>
                                <li>✔ Registration Certificate (RC)</li>
                                <li>✔ Insurance Policy</li>
                                <li>✔ Pollution Under Control (PUC)</li>
                                <li>✔ Fitness Certificate</li>
                                <li>✔ Permit Details</li>
                            </ul>
                        </div>
                    </>
                )}

                {/* INFO CARD MODAL */}
                {activeCard && (
                    <div className="modal-overlay" onClick={closeCardModal}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>{cardDetails[activeCard].title}</h2>
                                <button className="close-btn" onClick={closeCardModal}>&times;</button>
                            </div>
                            <div className="modal-body">
                                {cardDetails[activeCard].content}
                            </div>
                        </div>
                    </div>
                )}

                {vehicleData && (
                    <div className="results-container">

                        {/* Summary & Compliance */}
                        <div className="card vehicle-summary">
                            <div className="summary-grid">
                                <div><label>Vehicle Number</label><h3>{vehicleData.summary.regNo}</h3></div>
                                <div><label>Owner Name</label><h3>{vehicleData.summary.owner}</h3></div>
                                <div><label>Make & Model</label><h3>{vehicleData.summary.makeModel}</h3></div>
                                <div><label>Vehicle Class</label><h3>{vehicleData.summary.class}</h3></div>
                                <div><label>Registration Status</label><h3 style={{ color: '#16a34a' }}>✅ {vehicleData.summary.status}</h3></div>
                            </div>
                        </div>

                        <div className="section-title">Compliance Overview</div>
                        <div className="compliance-grid">
                            {Object.entries(vehicleData.status).map(([key, status]) => (
                                <div key={key} className="compliance-card" style={{ borderTop: `4px solid ${getStatusColor(status)}` }}>
                                    <div className="comp-title">{key.toUpperCase()}</div>
                                    <div className="comp-status" style={{ color: getStatusColor(status) }}>
                                        {status === 'Valid' || status === 'Active' ? '✅' : status === 'Expired' ? '❌' : '⚠️'} {status.toUpperCase()}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Tabs */}
                        <div className="tabs-container">
                            <div className="tabs-header">
                                {['rc', 'insurance', 'puc', 'fitness', 'permit'].map(tab => (
                                    <button
                                        key={tab}
                                        className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                                        onClick={() => setActiveTab(tab)}
                                    >
                                        {tab === 'rc' ? 'Registration Certificate' :
                                            tab === 'puc' ? 'PUC Certificate' :
                                                `${tab.charAt(0).toUpperCase() + tab.slice(1)} Details`}
                                    </button>
                                ))}
                            </div>

                            <div className="tab-content card">
                                {activeTab === 'rc' && (
                                    <div className="details-grid">
                                        <div className="col">
                                            {Object.entries(vehicleData.rcDetails).slice(0, 9).map(([k, v]) => (
                                                <div key={k} className="field-row"><label>{k.replace(/([A-Z])/g, ' $1').trim()}</label> <span>{v}</span></div>
                                            ))}
                                        </div>
                                        <div className="col">
                                            {Object.entries(vehicleData.rcDetails).slice(9).map(([k, v]) => (
                                                <div key={k} className="field-row"><label>{k.replace(/([A-Z])/g, ' $1').trim()}</label> <span>{v}</span></div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'insurance' && (
                                    <div className="details-grid single-col">
                                        {Object.entries(vehicleData.insurance).map(([k, v]) => (
                                            <div key={k} className="field-row"><label>{k.replace(/([A-Z])/g, ' $1').trim()}</label> <span>{v}</span></div>
                                        ))}
                                    </div>
                                )}
                                {(activeTab === 'puc' || activeTab === 'fitness' || activeTab === 'permit') && (
                                    <div className="details-grid single-col">
                                        {Object.entries(vehicleData[activeTab]).map(([k, v]) => (
                                            <div key={k} className="field-row"><label>{k.replace(/([A-Z])/g, ' $1').trim()}</label> <span>{v}</span></div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="action-section">
                            <button className="action-btn outline" onClick={handlePrint}>Download Verification Report (PDF)</button>
                            <button className="action-btn primary" onClick={() => navigate('/pay-challan', { state: { vehicleNo: regNo } })}>Proceed to E-Challan</button>
                        </div>

                        <div className="legal-note-bottom">
                            *This verification is based on structured demonstration datasets and does not access live VAHAN or RTO databases.
                        </div>
                    </div>
                )}
            </div>

            <Footer />

            {/* PRINT TEMPLATE (Hidden on Screen) */}
            {vehicleData && (
                <div id="printable-report">
                    <div className="print-header">
                        <div className="print-logo-container">
                            <img src="/assets/ECR_LOGO.svg" alt="ECR Logo" className="print-logo-img" />
                            <div className="print-title-block">
                                <h1 className="print-main-title">ECR ENFORCEMENT PORTAL</h1>
                                <p className="print-sub-title">OFFICIAL VEHICLE COMPLIANCE REPORT</p>
                            </div>
                        </div>
                        <div className="print-meta">
                            <p><strong>REPORT ID:</strong> VR-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                            <p><strong>DATE:</strong> {new Date().toLocaleDateString('en-IN')}</p>
                            <p><strong>TIME:</strong> {new Date().toLocaleTimeString('en-IN')}</p>
                        </div>
                    </div>

                    <div className="print-status-banner" style={{
                        backgroundColor: vehicleData.summary.status === 'Active' ? '#f0fdf4' : '#fef2f2',
                        border: `1px solid ${vehicleData.summary.status === 'Active' ? '#16a34a' : '#dc2626'}`,
                        color: vehicleData.summary.status === 'Active' ? '#16a34a' : '#dc2626'
                    }}>
                        STATUS: {vehicleData.summary.status === 'Active' ? 'COMPLIANT' : 'NON-COMPLIANT'}
                    </div>

                    <div className="print-grid">
                        <div className="print-section">
                            <h3 className="section-header">VEHICLE SUMMARY</h3>
                            <div className="print-data-row"><span>Registration No:</span> <strong>{vehicleData.summary.regNo}</strong></div>
                            <div className="print-data-row"><span>Owner Name:</span> <strong>{vehicleData.summary.owner}</strong></div>
                            <div className="print-data-row"><span>Make & Model:</span> <strong>{vehicleData.summary.makeModel}</strong></div>
                            <div className="print-data-row"><span>Vehicle Class:</span> <strong>{vehicleData.summary.class}</strong></div>
                        </div>

                        <div className="print-section">
                            <h3 className="section-header">COMPLIANCE STATUS</h3>
                            <div className="print-data-row"><span>RC Status:</span> <span className={vehicleData.status.rc === 'Valid' ? 'status-ok' : 'status-err'}>{vehicleData.status.rc}</span></div>
                            <div className="print-data-row"><span>Insurance:</span> <span className={vehicleData.status.insurance === 'Valid' ? 'status-ok' : 'status-err'}>{vehicleData.status.insurance}</span></div>
                            <div className="print-data-row"><span>PUC Certificate:</span> <span className={vehicleData.status.puc === 'Valid' ? 'status-ok' : 'status-err'}>{vehicleData.status.puc}</span></div>
                            <div className="print-data-row"><span>Fitness:</span> <span className={vehicleData.status.fitness === 'Valid' ? 'status-ok' : 'status-err'}>{vehicleData.status.fitness}</span></div>
                        </div>
                    </div>

                    <div className="print-section full-width" style={{ marginTop: '20px' }}>
                        <h3 className="section-header">DETAILED VERIFICATION RECORD</h3>
                        <table className="print-table">
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Detail / Document Number</th>
                                    <th>Expiry / Information</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Registration (RC)</td>
                                    <td>{vehicleData.rcDetails.chassis || "N/A"} (Chassis)</td>
                                    <td>Reg: {vehicleData.rcDetails.regDate}</td>
                                    <td>{vehicleData.rcDetails.rcStatus}</td>
                                </tr>
                                <tr>
                                    <td>Insurance</td>
                                    <td>{vehicleData.insurance.policyNo}</td>
                                    <td>Expires: {vehicleData.insurance.expiryDate}</td>
                                    <td>{vehicleData.insurance.status}</td>
                                </tr>
                                <tr>
                                    <td>Pollution (PUC)</td>
                                    <td>{vehicleData.puc.number}</td>
                                    <td>Expires: {vehicleData.puc.expiryDate}</td>
                                    <td>{vehicleData.puc.status}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="print-footer">
                        <div className="print-seal">
                            <div className="seal-circle">VERIFIED</div>
                            <p>Digital Signature Not Required</p>
                        </div>
                        <div className="print-disclaimer">
                            <p>This document is generated by the ECR Intelligent Traffic Enforcement Portal. It is used for reference of vehicle compliance and may be used as proof of verification at checkpoints.</p>
                            <p>© {new Date().getFullYear()} ECR Enforcement Network. All Rights Reserved.</p>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                /* Global Page Styles */
                .doc-verify-page {
                    min-height: 100vh;
                    background-color: #000000;
                    color: #fff;
                    font-family: 'Inter', sans-serif;
                    display: flex; flex-direction: column;
                    position: relative; /* For background containment */
                }
                .main-content {
                    flex: 1;
                    padding: 80px 40px 40px; /* Reduced padding */
                    width: 100%;
                    max-width: 1240px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    z-index: 1;
                }

                /* Search Card - Single Section Visibility */
                .search-section-wrapper { 
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    padding: 30px 0; /* Reduced padding */
                }
                .search-card {
                    background: #0a0a0a;
                    border: 1px solid #333;
                    border-radius: 20px;
                    padding: 40px; /* Reduced padding */
                    display: flex;
                    align-items: center;
                    gap: 40px; /* Reduced gap */
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                    width: 100%;
                    max-width: 1200px;
                    backdrop-filter: blur(10px);
                }
                .search-content { flex: 2; }
                .search-illustration { 
                    flex: 1; 
                    display: flex; 
                    justify-content: center; 
                    align-items: center;
                    border-left: 1px solid #333;
                    height: 100%;
                }
                .doc-scanner-anim {
                    display: flex; flex-direction: column; align-items: center; gap: 20px;
                }
                .scanner-box {
                    position: relative;
                    width: 100px; height: 120px;
                }
                .scan-line {
                    position: absolute; left: 0; width: 100%; height: 2px;
                    background: linear-gradient(90deg, transparent, #fff, transparent);
                    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
                    animation: scan 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                    opacity: 0.8;
                }
                @keyframes scan {
                    0% { top: 10%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 90%; opacity: 0; }
                }

                .scanner-status {
                    font-size: 13px; font-weight: 500; color: #888; letter-spacing: 1px;
                    display: flex; align-items: center; gap: 8px; text-transform: uppercase;
                }
                .dot {
                    width: 8px; height: 8px; background: #fff; border-radius: 50%;
                    box-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
                    animation: blink 1.5s infinite;
                }
                @keyframes blink { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }

                .hero-title { font-size: 32px; font-weight: 700; color: #fff; margin-bottom: 10px; letter-spacing: -1px; }
                .hero-subtext { color: #888; margin-bottom: 25px; line-height: 1.6; font-size: 16px; }
                
                .search-box {
                    display: flex;
                    align-items: center;
                    background: #111;
                    border: 1px solid #333;
                    border-radius: 8px;
                    padding: 8px 8px 8px 25px;
                }
                .reg-input {
                    background: transparent; border: none; color: #fff;
                    padding: 12px 0; font-size: 18px; width: 100%;
                    outline: none; text-transform: uppercase;
                }
                .verify-btn-override {
                    margin-left: 10px;
                    font-size: 16px;
                    padding: 16px 45px; /* Maintain the large size for the hero section */
                }

                /* Info Cards */
                .info-cards-grid {
                    display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px; margin-bottom: 40px;
                    max-width: 1400px; margin: 0 auto 40px;
                }
                .info-card {
                    background: rgba(10, 10, 10, 0.8); /* Slight transparency */
                    padding: 25px 20px; border-radius: 16px;
                    border: 1px solid #222; text-align: center;
                    transition: 0.3s; cursor: pointer;
                    min-height: 200px;
                    display: flex; flex-direction: column; justify-content: center; align-items: center;
                    backdrop-filter: blur(5px);
                }
                .info-card:hover { transform: translateY(-5px); border-color: #F5821F; box-shadow: 0 10px 30px rgba(245, 130, 31, 0.1); }
                .info-card .icon { margin-bottom: 15px; }
                .info-card h3 { font-size: 18px; margin-bottom: 8px; color: #fff; }
                .info-card p { font-size: 14px; color: #666; line-height: 1.5; margin-bottom: 15px; }
                .read-more { color: #F5821F; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }

                /* MODAL STYLES */
                .modal-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.8); backdrop-filter: blur(10px);
                    display: flex; justify-content: center; align-items: center; z-index: 9999;
                    padding: 20px; animation: fadeIn 0.3s;
                }
                .modal-content {
                    background: #111; width: 100%; max-width: 600px;
                    border-radius: 16px; border: 1px solid #333;
                    box-shadow: 0 25px 80px rgba(0,0,0,0.7);
                    overflow: hidden; animation: slideUp 0.3s;
                }
                .modal-header {
                    padding: 20px 30px; border-bottom: 1px solid #222;
                    display: flex; justify-content: space-between; align-items: center;
                    background: #1a1a1a;
                }
                .modal-header h2 { font-size: 20px; color: #fff; margin: 0; }
                .modal-body { padding: 30px; color: #ccc; line-height: 1.7; }
                .close-btn { background: none; border: none; font-size: 30px; color: #888; cursor: pointer; }
                .close-btn:hover { color: #fff; }
                .penalty-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                .penalty-table th, .penalty-table td { border: 1px solid #333; padding: 10px; text-align: left; font-size: 14px; }
                .penalty-table th { background: #222; color: #fff; }
                .highlight-box-modal { background: rgba(220, 38, 38, 0.1); border-left: 4px solid #dc2626; padding: 15px; margin-top: 20px; color: #ffcccc; font-size: 14px; }

                .preview-list {
                    background: rgba(10, 10, 10, 0.8); border: 1px dashed #333;
                    border-radius: 16px; padding: 25px; text-align: center;
                    max-width: 900px; margin: 0 auto 40px;
                    backdrop-filter: blur(5px);
                }
                .preview-list h3 { color: #fff; margin-bottom: 25px; font-size: 18px; }
                .preview-list ul { list-style: none; padding: 0; display: flex; flex-wrap: wrap; justify-content: center; gap: 30px; }
                .preview-list li { color: #888; font-size: 15px; display: flex; align-items: center; gap: 8px; }
                .preview-list li span { color: #fff; } /* Checkmark color */

                /* Results Section Styles */
                .results-container { width: 100%; max-width: 1200px; margin: 0 auto; z-index: 1; }
                
                .card { background: #0a0a0a; padding: 30px; border-radius: 16px; border: 1px solid #222; margin-bottom: 30px; }
                
                .section-title { font-size: 20px; margin-bottom: 25px; color: #fff; border-left: 3px solid #fff; padding-left: 15px; font-weight: 600; }
                
                .compliance-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 20px; margin-bottom: 50px; }
                .compliance-card { background: #111; padding: 25px 15px; border-radius: 12px; text-align: center; border: 1px solid #222; }
                .comp-title { color: #888; font-size: 11px; font-weight: 700; margin-bottom: 12px; letter-spacing: 1px; text-transform: uppercase; }
                .comp-status { font-weight: 700; font-size: 15px; display: flex; align-items: center; justify-content: center; gap: 6px; }
                
                .summary-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 20px; text-align: center; }
                .summary-grid label { color: #666; font-size: 11px; text-transform: uppercase; margin-bottom: 12px; display: block; letter-spacing: 1px; font-weight: 700; }
                .summary-grid h3 { font-size: 16px; margin: 0; color: #fff; font-weight: 700; word-break: break-all; }

                .tabs-header { display: flex; gap: 10px; border-bottom: 1px solid #222; margin-bottom: 30px; overflow-x: auto; padding-bottom: 10px; }
                .tab-btn { background: none; border: none; color: #666; padding: 12px 25px; cursor: pointer; border-bottom: 2px solid transparent; transition: 0.3s; white-space: nowrap; font-size: 14px; font-weight: 500; }
                .tab-btn.active { color: #fff; border-bottom-color: #fff; }
                .tab-btn:hover { color: #ccc; }

                .details-grid { display: flex; gap: 80px; }
                .details-grid.single-col { flex-direction: column; gap: 0; max-width: 600px; }
                .col { flex: 1; }
                .field-row { display: flex; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid #222; }
                .field-row label { color: #888; font-size: 15px; }
                .field-row span { color: #fff; font-weight: 500; font-size: 15px; text-align: right; }

                .action-section { display: flex; gap: 20px; justify-content: center; margin-top: 50px; }
                .action-btn { padding: 16px 35px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 15px; border: none; transition: 0.3s; }
                .action-btn.outline { background: transparent; border: 1px solid #444; color: #fff; }
                .action-btn.outline:hover { border-color: #fff; }
                .action-btn.primary { background: #fff; color: #000; }
                .action-btn.primary:hover { background: #ddd; }

                .legal-note-bottom { text-align: center; font-size: 13px; color: #444; margin-top: 60px; max-width: 600px; margin-left: auto; margin-right: auto; line-height: 1.5; }

                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

                /* PRINT PDF STYLES */
                #printable-report { display: none; }

                @media print {
                    @page { margin: 1cm; }
                    body { background: white !important; color: black !important; }
                    .doc-verify-page > *, .header, .footer { display: none !important; }
                    
                    #printable-report { 
                        display: block !important; 
                        background: white; 
                        color: black; 
                        padding: 20px;
                        font-family: 'Helvetica', 'Arial', sans-serif;
                    }

                    .print-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-bottom: 3px solid #000;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }

                    .print-logo-container {
                        display: flex;
                        align-items: center;
                        gap: 20px;
                    }

                    .print-logo-img {
                        height: 80px;
                        width: auto;
                    }

                    .print-main-title {
                        font-size: 24px;
                        font-weight: 800;
                        margin: 0;
                        color: #000;
                    }

                    .print-sub-title {
                        font-size: 14px;
                        margin: 5px 0 0;
                        color: #444;
                        letter-spacing: 1px;
                        text-transform: uppercase;
                    }

                    .print-meta {
                        text-align: right;
                        font-size: 12px;
                        line-height: 1.6;
                    }

                    .print-status-banner {
                        width: 100%;
                        padding: 15px;
                        text-align: center;
                        font-weight: 800;
                        font-size: 18px;
                        margin-bottom: 30px;
                        border-radius: 4px;
                        -webkit-print-color-adjust: exact;
                    }

                    .print-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 40px;
                        margin-bottom: 30px;
                    }

                    .section-header {
                        font-size: 16px;
                        font-weight: 700;
                        border-bottom: 1px solid #ddd;
                        padding-bottom: 10px;
                        margin-bottom: 15px;
                        color: #000;
                    }

                    .print-data-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 8px 0;
                        border-bottom: 1px solid #f0f0f0;
                        font-size: 13px;
                    }

                    .status-ok { color: #16a34a !important; font-weight: bold; }
                    .status-err { color: #dc2626 !important; font-weight: bold; }

                    .print-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 10px;
                    }

                    .print-table th, .print-table td {
                        border: 1px solid #ddd;
                        padding: 12px;
                        text-align: left;
                        font-size: 12px;
                    }

                    .print-table th {
                        background-color: #f8f9fa !important;
                        -webkit-print-color-adjust: exact;
                        font-weight: 700;
                    }

                    .print-footer {
                        margin-top: 60px;
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        border-top: 1px solid #ddd;
                        padding-top: 30px;
                    }

                    .print-seal {
                        text-align: center;
                    }

                    .seal-circle {
                        width: 100px;
                        height: 100px;
                        border: 4px double #16a34a;
                        color: #16a34a;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: 800;
                        font-size: 14px;
                        transform: rotate(-15deg);
                        margin: 0 auto 10px;
                    }

                    .print-disclaimer {
                        max-width: 60%;
                        font-size: 10px;
                        color: #666;
                        line-height: 1.4;
                    }
                }

                @media (max-width: 768px) {
                    .search-card { flex-direction: column; text-align: center; padding: 30px; gap: 30px; }
                    .search-illustration { border-left: none; border-top: 1px solid #222; padding-top: 20px; width: 100%; }
                    .details-grid { flex-direction: column; gap: 0; }
                    .search-box { padding: 10px; }
                    .verify-btn { width: 100%; margin-left: 0; margin-top: 10px; }
                    .search-box { flex-direction: column; background: transparent; border: none; padding: 0; }
                    .reg-input { background: #111; border: 1px solid #333; border-radius: 8px; padding: 15px; margin-bottom: 10px; text-align: center; }
                    .main-content { padding: 40px 20px; }
                    
                    .search-section-wrapper { min-height: 70vh; }
                    .info-cards-grid { margin-top: 20px; }
                }
            `}</style>
        </div>
    );
}

export default DocumentVerification;
