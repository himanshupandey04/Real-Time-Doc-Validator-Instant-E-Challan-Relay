import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalUnpaid: 0,
        violationCounts: {},
        recentChallans: []
    });

    const [activeTab, setActiveTab] = useState(localStorage.getItem('adminActiveTab') || 'overview');
    const [loading, setLoading] = useState(true);
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [scanError, setScanError] = useState(null);

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [manualEmail, setManualEmail] = useState("");
    const [isSendingEmail, setIsSendingEmail] = useState(false);

    // Live Monitoring Refs
    const videoRef = React.useRef(null);
    const canvasRef = React.useRef(null);
    const fileVideoRef = React.useRef(null); // Ref for uploaded video playback
    const [isLive, setIsLive] = useState(false);
    const [liveInterval, setLiveInterval] = useState(null);

    // Camera Devices
    const [devices, setDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState('');

    // Viewing specific challan from history
    const [viewChallan, setViewChallan] = useState(null);

    const fetchStats = async () => {
        try {
            const response = await fetch('http://localhost:5000/dashboard_stats');
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard stats", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser && !currentUser.email.includes('admin')) {
            navigate('/');
        }
        fetchStats();
        return () => {
            if (liveInterval) clearInterval(liveInterval);
        };
    }, [currentUser, navigate]);

    // Persist active tab
    useEffect(() => {
        localStorage.setItem('adminActiveTab', activeTab);
    }, [activeTab]);

    // Enumerate cameras
    useEffect(() => {
        const getDevices = async () => {
            try {
                // Must ask simply first to get labels
                await navigator.mediaDevices.getUserMedia({ video: true });
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(d => d.kind === 'videoinput');
                setDevices(videoDevices);
                if (videoDevices.length > 0 && !selectedDeviceId) {
                    setSelectedDeviceId(videoDevices[0].deviceId);
                }
            } catch (err) {
                console.warn("Camera permission issue", err);
            }
        };
        getDevices();
    }, []);

    const startMonitoring = async () => {
        try {
            const constraints = {
                video: selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : true
            };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsLive(true);
                const interval = setInterval(captureFrame, 3000);
                setLiveInterval(interval);
            }
        } catch (err) {
            console.warn("Selected camera failed, trying default...", err);
            // Fallback to any available camera
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setIsLive(true);
                    const interval = setInterval(captureFrame, 3000);
                    setLiveInterval(interval);
                }
            } catch (fallbackErr) {
                alert("Camera Error: " + fallbackErr.message + ". Please clear permissions and try again.");
            }
        }
    };

    const stopMonitoring = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        if (liveInterval) clearInterval(liveInterval);
        setIsLive(false);
        setScanResult(null);
    };

    const captureFrame = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        const context = canvasRef.current.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, 640, 480);

        canvasRef.current.toBlob(async (blob) => {
            if (!blob) return;
            const formData = new FormData();
            formData.append('file', blob, 'capture.jpg');
            formData.append('type', 'image'); // Reuse image logic

            try {
                const res = await fetch('http://localhost:5000/api/upload_scan', {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();
                if (data.success) {
                    setScanResult(data);
                    // Optional: stop if found? or Keep running? User said "give report", implies showing result.
                    // For now, let's just show it. If we want to pause on detection:
                    // stopMonitoring();
                }
            } catch (err) {
                // console.error(err);
            }
        }, 'image/jpeg');
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setScanResult(null);
        setScanError(null);
    };

    const performScan = async () => {
        if (!selectedFile) return;

        // Auto-play video in slow motion (0.5x) for analysis visualization
        if (activeTab === 'video' && fileVideoRef.current) {
            fileVideoRef.current.playbackRate = 0.5;
            fileVideoRef.current.play().catch(err => console.log("Auto-play prevented", err));
        }

        setIsScanning(true);
        setScanError(null);
        setScanResult(null);
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('type', activeTab);
        formData.append('official_id', currentUser?.uid || 'ADMIN');
        formData.append('official_name', currentUser?.displayName || currentUser?.email || 'System Admin');

        try {
            const res = await fetch('http://localhost:5000/api/upload_scan', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                setScanResult(data);
                fetchStats();
            } else {
                setScanError(data.message || "Number Plate Not Detected");
            }
        } catch (err) {
            setScanError("Server Connection Failed");
        } finally {
            setIsScanning(false);
        }
    };

    const sendManualEmail = async () => {
        if (!manualEmail || !scanResult?.challan_id) return;
        setIsSendingEmail(true);
        try {
            const res = await fetch('http://localhost:5000/api/send_manual_email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: manualEmail,
                    challan_id: scanResult.challan_id,
                    plate: scanResult.plate,
                    violation: Array.isArray(scanResult.violations) ? scanResult.violations.join(', ') : scanResult.violations,
                    amount: scanResult.total_fine || 0
                })
            });
            const data = await res.json();
            if (data.success) alert("Email sent successfully!");
            else alert("Failed to send email: " + (data.error || "Unknown error"));
        } catch (err) {
            console.error(err);
            alert("Connection error: Ensure backend on port 5000 is reachable.");
        } finally {
            setIsSendingEmail(false);
        }
    };

    const cancelSelection = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setScanResult(null);
        setScanError(null);
        if (isLive) stopMonitoring();
    };

    const downloadPDF = (cid) => {
        window.open(`http://localhost:5000/api/download_challan/${cid}`);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'live':
                return (
                    <div className="tab-pane animate-fade-in">
                        <div className="pane-header">
                            <h2>Live Traffic Monitoring</h2>
                            <p style={{ color: '#64748b' }}>Real-time camera feed analysis for instant violation detection.</p>
                        </div>

                        {devices.length > 0 && (
                            <div style={{ marginBottom: '15px', textAlign: 'center' }}>
                                <select
                                    className="camera-select"
                                    value={selectedDeviceId}
                                    onChange={(e) => setSelectedDeviceId(e.target.value)}
                                    disabled={isLive}
                                >
                                    {devices.map((device, index) => (
                                        <option key={device.deviceId} value={device.deviceId}>
                                            {device.label || `Camera ${index + 1}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="live-feed-container">
                            <video ref={videoRef} autoPlay playsInline muted className="live-video" style={{ display: isLive ? 'block' : 'none' }} />
                            <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }} />

                            {!isLive && (
                                <div className="placeholder-text">
                                    <div className="placeholder-icon">📷</div>
                                    <span>Select Camera & Start Monitoring</span>
                                </div>
                            )}

                            {isLive && (
                                <div className="live-status">
                                    <div className="blink-dot"></div> LIVE FEED ACTIVE
                                </div>
                            )}
                        </div>

                        <div className="live-controls">
                            {!isLive ? (
                                <button className="btn-professional" onClick={startMonitoring}>Start Monitoring</button>
                            ) : (
                                <button className="btn-professional red" onClick={stopMonitoring}>Stop Monitoring</button>
                            )}
                        </div>

                        {scanResult && (
                            <div className="scan-result-pane animate-slide-up" style={{ marginTop: '40px' }}>
                                <div className="result-main">
                                    <div className="result-details-box" style={{ width: '100%' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <label>LATEST DETECTION</label>
                                            <span className="tag">JUST NOW</span>
                                        </div>
                                        <div className="plate-badge-large" style={{ marginTop: '10px' }}>{scanResult.plate}</div>
                                        <div className="conf-score">Confidence: <strong>{scanResult.confidence}%</strong></div>
                                    </div>
                                </div>

                                <div className="report-section">
                                    <h3>Compliance Report</h3>
                                    <table className="report-table">
                                        <thead>
                                            <tr>
                                                <th>Document</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr><td>RC Status</td><td><span className={`status-pill ${scanResult.rc_status === 'Valid' ? 'v' : 'e'}`}>{scanResult.rc_status}</span></td><td>{scanResult.rc_status !== 'Valid' ? 'Flag' : '-'}</td></tr>
                                            <tr><td>Insurance</td><td><span className={`status-pill ${scanResult.insurance_status === 'Valid' ? 'v' : 'e'}`}>{scanResult.insurance_status}</span></td><td>{scanResult.insurance_status !== 'Valid' ? 'Challan' : '-'}</td></tr>
                                            <tr><td>PUC</td><td><span className={`status-pill ${scanResult.puc_status === 'Valid' ? 'v' : 'e'}`}>{scanResult.puc_status}</span></td><td>{scanResult.puc_status !== 'Valid' ? 'Fine' : '-'}</td></tr>
                                        </tbody>
                                    </table>

                                    {scanResult.challan_id && (
                                        <div className="challan-issued-box">
                                            <div className="box-header">
                                                <h4>Violation Detected! Challan Generated: {scanResult.challan_id}</h4>
                                            </div>
                                            <div className="action-row">
                                                <button className="btn-small-doc" onClick={() => downloadPDF(scanResult.challan_id)}>Download Report</button>
                                                <div className="manual-email-input">
                                                    <input
                                                        type="email"
                                                        placeholder="Owner Email ID"
                                                        value={manualEmail}
                                                        onChange={(e) => setManualEmail(e.target.value)}
                                                    />
                                                    <button className="btn-send-email" onClick={sendManualEmail} disabled={isSendingEmail}>
                                                        {isSendingEmail ? "Sending..." : "Send Notice"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'image':
            case 'video':
                return (
                    <div className="tab-pane animate-fade-in">
                        <div className="pane-header">
                            <h2>{activeTab === 'image' ? 'Manual Image Scan' : 'Video Analysis Scan'}</h2>
                            <p style={{ color: '#64748b' }}>Upload {activeTab} for automated plate detection and document verification.</p>
                        </div>

                        {!selectedFile && (
                            <div className="upload-section">
                                <input type="file" id="pane-up" accept={activeTab === 'image' ? 'image/*' : 'video/*'} style={{ display: 'none' }} onChange={handleFileSelect} />
                                <label htmlFor="pane-up" className="drop-zone">
                                    <div className="dz-icon">{activeTab === 'image' ? '📸' : '🎥'}</div>
                                    <p style={{ fontWeight: 600 }}>Select {activeTab.toUpperCase()} for AI detection</p>
                                    <div className="btn-professional">Choose File</div>
                                </label>
                            </div>
                        )}

                        {selectedFile && !scanResult && (
                            <div className="preview-container">
                                <div className="media-preview">
                                    {activeTab === 'image' ? (
                                        <img src={previewUrl} alt="Preview" />
                                    ) : (
                                        <video ref={fileVideoRef} src={previewUrl} controls />
                                    )}
                                    {isScanning ? (
                                        <div className="scan-status">
                                            <div className="loader-small"></div>
                                            <span>AI Detecting Number Plate...</span>
                                            <button className="btn-professional red" style={{ marginLeft: '15px' }} onClick={() => { setIsScanning(false); setScanError("Scan aborted by user."); }}>STOP</button>
                                        </div>
                                    ) : (
                                        <>
                                            <button className="btn-professional" onClick={performScan}>Start AI Scan</button>
                                            <button className="btn-text-only" onClick={cancelSelection}>Cancel</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {scanError && (
                            <div className="error-banner animate-fade-in" style={{ padding: '20px', background: '#fee2e2', border: '1px solid #ef4444', borderRadius: '8px', marginTop: '20px', color: '#b91c1c' }}>
                                <strong>⚠️ Detection Failed:</strong> {scanError}
                                <p style={{ fontSize: '0.9rem', marginTop: '5px' }}>Reason: Image quality low, angle too steep, or plate obscured.</p>
                            </div>
                        )}

                        {scanResult && (
                            <div className="scan-result-pane animate-slide-up">
                                <div className="result-main">
                                    <div className="result-img-wrapper">
                                        <img src={`http://localhost:5000${scanResult.image_url}`} alt="Detected" />
                                        <div className="plate-highlight-tag">PLATE DETECTED</div>
                                    </div>
                                    <div className="result-details-box">
                                        <label>PLATE NUMBER</label>
                                        <div className="plate-badge-large">{scanResult.plate}</div>
                                        <div className="conf-score">Detection Confidence: <strong>{scanResult.confidence}%</strong></div>
                                    </div>
                                </div>

                                <div className="report-section">
                                    <h3>Vehicle Compliance Report</h3>
                                    <table className="report-table">
                                        <thead>
                                            <tr>
                                                <th>Document Type</th>
                                                <th>Status</th>
                                                <th>Action Required</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Registration Certificate (RC)</td>
                                                <td><span className={`status-pill ${scanResult.rc_status === 'Valid' ? 'v' : 'e'}`}>{scanResult.rc_status || 'Checking...'}</span></td>
                                                <td>{scanResult.rc_status !== 'Valid' ? 'Renewal Required' : 'None'}</td>
                                            </tr>
                                            <tr>
                                                <td>Insurance Policy</td>
                                                <td><span className={`status-pill ${scanResult.insurance_status === 'Valid' ? 'v' : 'e'}`}>{scanResult.insurance_status || 'Checking...'}</span></td>
                                                <td>{scanResult.insurance_status !== 'Valid' ? 'Immediate Renewal' : 'None'}</td>
                                            </tr>
                                            <tr>
                                                <td>PUC Certificate</td>
                                                <td><span className={`status-pill ${scanResult.puc_status === 'Valid' ? 'v' : 'e'}`}>{scanResult.puc_status || 'Checking...'}</span></td>
                                                <td>{scanResult.puc_status !== 'Valid' ? 'Emission Test Required' : 'None'}</td>
                                            </tr>
                                            <tr>
                                                <td>Fitness Certificate</td>
                                                <td><span className={`status-pill ${scanResult.fitness_status === 'Valid' ? 'v' : 'e'}`}>{scanResult.fitness_status || 'Checking...'}</span></td>
                                                <td>{scanResult.fitness_status !== 'Valid' ? 'Safety Inspection' : 'None'}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <div className="enforcement-actions">
                                        {scanResult.challan_id ? (
                                            <div className="challan-issued-box">
                                                <div className="box-header">
                                                    <h4>E-CHALLAN GENERATED: {scanResult.challan_id}</h4>
                                                </div>
                                                <div className="action-row">
                                                    <button className="btn-small-doc" onClick={() => downloadPDF(scanResult.challan_id)}>PDF Report</button>

                                                    <div className="manual-email-input">
                                                        <input
                                                            type="email"
                                                            placeholder="Manual Email ID"
                                                            value={manualEmail}
                                                            onChange={(e) => setManualEmail(e.target.value)}
                                                        />
                                                        <button className="btn-send-email" onClick={sendManualEmail} disabled={isSendingEmail}>
                                                            {isSendingEmail ? "Sending" : "Send Email"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="compliant-box">Vehicle is fully compliant. No enforcement required.</div>
                                        )}
                                        <button className="btn-link" onClick={cancelSelection}>Scan New Vehicle</button>
                                    </div>

                                    {/* VIDEO ANALYSIS REPORT TABLE */}
                                    {scanResult?.all_detections && scanResult.all_detections.length > 0 && (
                                        <div style={{ marginTop: '30px', background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                            <h4 style={{ margin: '0 0 20px 0', color: '#0f172a', fontSize: '16px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ fontSize: '20px' }}>📹</span> Video Analysis Report: All Detected Vehicles
                                            </h4>
                                            <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                                    <thead>
                                                        <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                                                            <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>Plate Number</th>
                                                            <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>Status</th>
                                                            <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>Reason / Violation</th>
                                                            <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>Confidence</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {scanResult.all_detections.map((det, idx) => (
                                                            <tr key={idx} style={{ borderBottom: idx !== scanResult.all_detections.length - 1 ? '1px solid #e2e8f0' : 'none', background: det.status === 'Challan Issued' ? '#fff1f2' : '#fff' }}>
                                                                <td style={{ padding: '12px 16px', fontWeight: '700', fontFamily: 'JetBrains Mono, monospace', color: det.status === 'Challan Issued' ? '#be123c' : '#0f172a' }}>
                                                                    {det.plate}
                                                                </td>
                                                                <td style={{ padding: '12px 16px' }}>
                                                                    <span style={{
                                                                        padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
                                                                        background: det.status === 'Challan Issued' ? '#ffe4e6' : (det.status === 'Clean' ? '#dcfce7' : '#f1f5f9'),
                                                                        color: det.status === 'Challan Issued' ? '#e11d48' : (det.status === 'Clean' ? '#166534' : '#64748b'),
                                                                        border: `1px solid ${det.status === 'Challan Issued' ? '#fecdd3' : (det.status === 'Clean' ? '#bbf7d0' : '#cbd5e1')}`
                                                                    }}>
                                                                        {det.status?.toUpperCase() || 'UNKNOWN'}
                                                                    </span>
                                                                </td>
                                                                <td style={{ padding: '12px 16px', color: '#334155', fontWeight: '500' }}>{det.reason}</td>
                                                                <td style={{ padding: '12px 16px', color: '#64748b' }}>{det.confidence}%</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                );
            default:
                return (
                    <div className="overview-pane animate-fade-in">
                        <div className="metrics-grid">
                            <div className="metric-card">
                                <span className="m-label">Total Revenue Collection</span>
                                <div className="m-value">₹{(stats.totalRevenue || 0).toLocaleString()}</div>
                            </div>
                            <div className="metric-card">
                                <span className="m-label">Awaiting Payment</span>
                                <div className="m-value">₹{(stats.totalUnpaid || 0).toLocaleString()}</div>
                            </div>
                            <div className="metric-card">
                                <span className="m-label">Total Recorded Cases (30D)</span>
                                <div className="m-value">{stats.recentChallans.length}</div>
                            </div>
                        </div>

                        <div className="dashboard-grid">
                            <div className="card-box" style={{ height: 'fit-content' }}>
                                <h3>Violation Distribution</h3>
                                <div className="v-list">
                                    {Object.entries(stats.violationCounts || {}).map(([type, count]) => (
                                        <div key={type} className="v-item">
                                            <div className="v-label"><span>{type}</span><span>{count}</span></div>
                                            <div className="prog-bg"><div className="prog-fill" style={{ width: `${Math.min(100, count * 10)}%` }}></div></div>
                                        </div>
                                    ))}
                                    {Object.keys(stats.violationCounts || {}).length === 0 && <p style={{ opacity: 0.5 }}>No data available</p>}
                                </div>
                            </div>

                            <div className="card-box">
                                <h3>Enforcement History Log (Past 30 Days)</h3>
                                <div className="table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>PLATE</th>
                                                <th>VIOLATION</th>
                                                <th>STATUS</th>
                                                <th style={{ textAlign: 'right' }}>ACTIONS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stats.recentChallans.map((c, i) => (
                                                <tr key={i}>
                                                    <td className="id">{c.id}</td>
                                                    <td style={{ fontWeight: 700 }}>{c.plate}</td>
                                                    <td style={{ fontSize: '11px' }}>{c.type}</td>
                                                    <td><span className={`tag ${c.status.toLowerCase()}`}>{c.status}</span></td>
                                                    <td style={{ textAlign: 'right' }}>
                                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                            <button className="btn-minimal" onClick={() => setViewChallan(c)}>VIEW</button>
                                                            <button className="btn-minimal" onClick={() => downloadPDF(c.id)} title="Download PDF">📥</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {stats.recentChallans.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', opacity: 0.5, padding: '20px' }}>No records found</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="admin-layout">
            <Header darkTheme={false} />

            <div className="admin-container">
                {/* SIDEBAR NAVIGATION */}
                <aside className="admin-sidebar">
                    <div className="sidebar-title">
                        SYSTEM ADMINISTRATION
                    </div>
                    <nav className="sidebar-nav">
                        <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => { setActiveTab('overview'); cancelSelection(); }}>
                            Overview Dashboard
                        </button>
                        <div className="nav-divider">Enforcement Tools</div>
                        <button className={activeTab === 'live' ? 'active' : ''} onClick={() => { setActiveTab('live'); cancelSelection(); }}>
                            Live Monitoring Hub
                        </button>
                        <button className={activeTab === 'image' ? 'active' : ''} onClick={() => { setActiveTab('image'); cancelSelection(); }}>
                            Manual Image Scan
                        </button>
                        <button className={activeTab === 'video' ? 'active' : ''} onClick={() => { setActiveTab('video'); cancelSelection(); }}>
                            Video Analysis Scan
                        </button>
                    </nav>
                </aside>

                {/* MAIN CONTENT AREA */}
                <main className="admin-main">
                    <div className="main-header-row">
                        <h1>Traffic Management <span className="sub-title">System</span></h1>
                        <div className="status-stripe">
                            <span className="dot"></span> LIVE SYSTEM ACTIVE
                        </div>
                    </div>
                    {renderContent()}
                </main>
            </div>

            {/* QUICK VIEW MODAL */}
            {viewChallan && (
                <div className="quick-view-overlay" onClick={() => setViewChallan(null)}>
                    <div className="quick-view-card animate-slide-up" onClick={e => e.stopPropagation()}>
                        <div className="qv-header">
                            <h3>CHALLAN DETAILS: {viewChallan.id}</h3>
                            <button onClick={() => setViewChallan(null)} className="qv-close">×</button>
                        </div>
                        <div className="qv-body">
                            <div className="qv-media">
                                {viewChallan.image_path ? (
                                    <img src={`http://localhost:5000${viewChallan.image_path}`} alt="Evidence" />
                                ) : (
                                    <div className="no-media">No visual evidence found</div>
                                )}
                            </div>
                            <div className="qv-info">
                                <div className="info-item"><label>VEHICLE PLATE</label><span>{viewChallan.plate}</span></div>
                                <div className="info-item"><label>VIOLATION TYPE</label><span>{viewChallan.type}</span></div>
                                <div className="info-item"><label>FINE AMOUNT</label><span style={{ color: '#ef4444' }}>₹{viewChallan.amount}</span></div>
                                <div className="info-item"><label>ISSUE DATE</label><span>{viewChallan.date}</span></div>
                                <div className="info-item"><label>PAYMENT STATUS</label><span className={`tag ${viewChallan.status.toLowerCase()}`}>{viewChallan.status}</span></div>
                            </div>
                        </div>
                        <div className="qv-footer">
                            <button className="btn-professional" onClick={() => downloadPDF(viewChallan.id)}>📥 Download Official PDF</button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />

            <style>{`
                .admin-layout { background: #f8fafc; min-height: 100vh; font-family: 'Inter', sans-serif; }
                .admin-container { display: flex; max-width: 1400px; margin: 0 auto; padding-top: 100px; padding-bottom: 60px; min-height: 85vh; gap: 20px; }
                
                .admin-sidebar { width: 280px; background: #fff; border: 1px solid #cbd5e1; border-radius: 16px; padding: 24px; display: flex; flex-direction: column; align-self: flex-start; position: sticky; top: 100px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
                .sidebar-title { font-size: 11px; font-weight: 800; color: #475569; letter-spacing: 1px; margin-bottom: 24px; padding-left: 12px; border-left: 3px solid #F5821F; }
                
                .sidebar-nav { display: flex; flex-direction: column; gap: 4px; }
                .nav-divider { font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; margin: 20px 0 8px 12px; }
                .sidebar-nav button { 
                    background: none; border: none; padding: 14px 16px; border-radius: 8px;
                    text-align: left; color: #334155; font-weight: 700; font-size: 14px; cursor: pointer; transition: 0.2s;
                }
                .sidebar-nav button:hover { background: #f1f5f9; color: #000; }
                .sidebar-nav button.active { background: #1e293b; color: #fff; box-shadow: 0 4px 12px rgba(30, 41, 59, 0.2); }

                .admin-main { flex: 1; background: #fff; border: 1px solid #cbd5e1; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
                .main-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; padding-bottom: 20px; border-bottom: 2px solid #f1f5f9; }
                .main-header-row h1 { font-size: 26px; font-weight: 900; color: #0f172a; margin: 0; }
                .sub-title { color: #64748b; font-weight: 600; font-size: 20px; }
                
                .status-stripe { font-size: 11px; font-weight: 800; color: #1e293b; background: #f1f5f9; padding: 8px 16px; border-radius: 50px; display: flex; align-items: center; gap: 8px; border: 1px solid #e2e8f0; }
                .status-stripe .dot { width: 10px; height: 10px; background: #22c55e; border-radius: 50%; box-shadow: 0 0 10px rgba(34, 197, 94, 0.6); }

                .metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 32px; }
                .metric-card { background: #fff; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; border-left: 4px solid #1e293b; transition: transform 0.2s; }
                .m-label { font-size: 12px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; }
                .m-value { font-size: 32px; font-weight: 900; color: #0f172a; margin-top: 8px; }

                .dashboard-grid { display: grid; grid-template-columns: 1fr 1.6fr; gap: 30px; }
                .card-box h3 { font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 24px; }

                .v-label { display: flex; justify-content: space-between; font-size: 14px; font-weight: 700; margin-bottom: 8px; color: #1e293b; }
                .prog-bg { height: 8px; background: #f1f5f9; border-radius: 10px; }
                .prog-fill { height: 100%; background: #475569; border-radius: 10px; }

                th { text-align: left; padding: 16px 12px; font-size: 11px; color: #475569; letter-spacing: 1px; border-bottom: 2px solid #f1f5f9; font-weight: 800; }
                td { padding: 18px 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #0f172a; font-weight: 600; }
                /* ENFORCEMENT ACTIONS */
                .enforcement-actions { margin-top: 25px; }
                .challan-issued-box { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
                .box-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; color: #be123c; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px; }
                .box-header h4 { margin: 0; font-size: 16px; font-weight: 800; display: flex; align-items: center; gap: 8px; }
                .box-header h4::before { content: '🚨'; font-size: 18px; }
                
                .action-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
                
                .btn-small-doc { background: #f8fafc; border: 1px solid #cbd5e1; color: #334155; height: 42px; padding: 0 20px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 6px; white-space: nowrap; }
                .btn-small-doc:hover { background: #fff; border-color: #be123c; color: #be123c; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }

                .manual-email-input { display: flex; align-items: center; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; background: #fff; height: 42px; flex: 1; min-width: 280px; max-width: 450px; transition: border 0.2s; }
                .manual-email-input:focus-within { border-color: #be123c; box-shadow: 0 0 0 3px rgba(190, 18, 60, 0.1); }
                .manual-email-input input { border: none; padding: 0 15px; font-size: 13px; outline: none; flex: 1; color: #334155; height: 100%; background: transparent; }
                .btn-send-email { background: #be123c; color: #fff; border: none; padding: 0 24px; font-weight: 700; font-size: 13px; cursor: pointer; height: 100%; border-left: 1px solid #9f1239; white-space: nowrap; transition: background 0.2s; }
                .btn-send-email:hover { background: #9f1239; }
                .btn-send-email:disabled { opacity: 0.7; cursor: not-allowed; background: #cbd5e1; border-color: #94a3b8; }

                .compliant-box { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; padding: 15px; border-radius: 12px; font-weight: 700; font-size: 14px; text-align: center; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; gap: 8px; }
                .compliant-box::before { content: '✅'; font-size: 18px; }

                .btn-link { background: #f1f5f9; border: 1px dashed #94a3b8; color: #475569; font-weight: 700; font-size: 13px; cursor: pointer; padding: 12px; border-radius: 8px; width: 100%; text-align: center; transition: 0.2s; margin-top: 10px; }
                .btn-link:hover { background: #e2e8f0; color: #0f172a; border-style: solid; border-color: #cbd5e1; }
            
                .id { font-family: 'JetBrains Mono', monospace; font-weight: 800; color: #F5821F; }
                .tag { padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
                .tag.pending { background: #fee2e2; color: #b91c1c; }
                .tag.paid { background: #dcfce7; color: #166534; }
                
                .btn-minimal { background: #f1f5f9; border: 1px solid #cbd5e1; color: #475569; padding: 4px 10px; border-radius: 4px; font-size: 10px; font-weight: 800; cursor: pointer; transition: 0.2s; }
                .btn-minimal:hover { background: #1e293b; color: #fff; border-color: #1e293b; }

                .report-table { width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #e2e8f0; }
                .report-table td, .report-table th { padding: 12px 16px; border: 1px solid #e2e8f0; font-size: 13px; }
                .status-pill { padding: 4px 10px; border-radius: 4px; font-weight: 800; font-size: 10px; text-transform: uppercase; }
                .status-pill.v { background: #dcfce7; color: #166534; }
                .status-pill.e { background: #fee2e2; color: #991b1b; }

                /* QUICK VIEW STYLES */
                .quick-view-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.85); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(4px); }
                .quick-view-card { background: #fff; width: 100%; max-width: 900px; border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
                .qv-header { padding: 20px 30px; background: #fff; border-bottom: 2px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
                .qv-header h3 { margin: 0; font-size: 18px; font-weight: 900; color: #1e293b; }
                .qv-close { background: none; border: none; font-size: 28px; cursor: pointer; opacity: 0.5; }
                .qv-body { display: grid; grid-template-columns: 1.5fr 1fr; gap: 30px; padding: 30px; }
                .qv-media img { width: 100%; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
                .qv-info { display: flex; flex-direction: column; gap: 20px; }
                .info-item label { display: block; font-size: 10px; font-weight: 800; color: #94a3b8; letter-spacing: 1px; margin-bottom: 6px; }
                .info-item span { font-size: 15px; font-weight: 700; color: #0f172a; }
                .qv-footer { padding: 20px 30px; background: #f8fafc; border-top: 1px solid #f1f5f9; text-align: right; }

                /* SHARED UI */
                .btn-professional { background: #1e293b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; text-transform: uppercase; letter-spacing: 0.5px; min-width: 160px; transition: transform 0.2s, background 0.2s; }
                .btn-professional:hover { background: #334155; transform: translateY(-2px); }
                .btn-professional.red { background: #dc2626; }
                .btn-professional.red:hover { background: #ef4444; }
                
                .btn-text-only { background: none; border: 1px solid transparent; color: #64748b; padding: 12px 24px; font-weight: 700; cursor: pointer; font-size: 13px; min-width: 100px; }
                .btn-text-only:hover { color: #0f172a; text-decoration: underline; }

                .media-preview { position: relative; width: 100%; max-width: 600px; border-radius: 12px; overflow: hidden; background: #000; border: 1px solid #cbd5e1; }
                .media-preview img, .media-preview video { width: 100%; display: block; }
                .scanner-overlay { position: absolute; inset: 0; z-index: 5; pointer-events: none; }
                .scan-line { height: 3px; width: 100%; background: #F5821F; position: absolute; top: 0; left: 0; box-shadow: 0 0 15px #F5821F; animation: scanMove 2s linear infinite; }
                .scan-box { position: absolute; top: 30%; left: 30%; width: 40%; height: 20%; border: 2px solid #22c55e; border-radius: 4px; box-shadow: 0 0 10px #22c55e; animation: boxPulse 1s ease-in-out infinite; }
                @keyframes scanMove { 0% { top: 0; } 100% { top: 100%; } }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                /* LIVE MONITORING STYLES */
                .live-feed-container { position: relative; width: 100%; max-width: 800px; margin: 0 auto; background: #e2e8f0; border-radius: 12px; overflow: hidden; border: 1px solid #cbd5e1; min-height: 400px; display: flex; align-items: center; justify-content: center; flex-direction: column; }
                .live-video { width: 100%; height: 100%; object-fit: cover; }
                .live-controls { display: flex; justify-content: center; gap: 20px; margin-top: 20px; align-items: center; }
                .live-status { position: absolute; top: 10px; right: 10px; padding: 5px 10px; background: rgba(0,0,0,0.7); color: #fff; border-radius: 4px; font-size: 11px; font-weight: 700; display: flex; align-items: center; gap: 6px; z-index: 10; }
                .blink-dot { width: 8px; height: 8px; background: #ef4444; border-radius: 50%; animation: blink 1s infinite; }
                @keyframes blink { 50% { opacity: 0; } }
                
                .camera-select { padding: 10px 15px; border-radius: 8px; border: 1px solid #cbd5e1; font-weight: 600; color: #334155; outline: none; background: #fff; min-width: 200px; }
                .placeholder-text { color: #64748b; font-weight: 600; font-size: 1.1rem; display: flex; flex-direction: column; align-items: center; gap: 10px; }
                .placeholder-icon { font-size: 3rem; opacity: 0.5; }

                /* UPLOAD ZONE */
                .upload-section { margin-bottom: 30px; }
                .drop-zone { 
                    border: 2px dashed #cbd5e1; border-radius: 12px; padding: 40px; text-align: center; cursor: pointer; transition: 0.2s; background: #f8fafc;
                    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px; 
                }
                .drop-zone:hover { border-color: #F5821F; background: #fff; }
                .dz-icon { font-size: 40px; margin-bottom: 10px; }
                
                /* BUTTON SIZES */
                .btn-minimal { background: #f1f5f9; border: 1px solid #cbd5e1; color: #475569; padding: 8px 16px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer; transition: 0.2s; min-width: 70px; text-align: center; }
                .btn-minimal:hover { background: #1e293b; color: #fff; border-color: #1e293b; }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
