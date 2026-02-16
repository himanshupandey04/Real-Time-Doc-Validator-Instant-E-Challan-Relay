import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LogPage = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/recent_captures');
                if (response.ok) {
                    const data = await response.json();
                    setLogs(data);
                }
            } catch (err) {
                console.error("Failed to fetch logs", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    return (
        <div className="log-page" style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff' }}>
            <Header />
            <div className="admin-container animate-fade-up" style={{ paddingTop: '120px', maxWidth: '1200px', margin: '0 auto', paddingLeft: '20px', paddingRight: '20px' }}>
                <div style={{ marginBottom: '40px' }}>
                    <h1 className="highlight-orange" style={{ fontSize: '2.5rem', fontWeight: 800 }}>ENFORCEMENT SYSTEM LOGS</h1>
                    <p style={{ opacity: 0.7 }}>Historical records of system captures, plate detections, and confidence metrics.</p>
                </div>

                <div className="glass-card">
                    <div className="table-container" style={{ overflowX: 'auto' }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Capture ID</th>
                                    <th>Timestamp</th>
                                    <th>Detected Plate</th>
                                    <th>Confidence Score</th>
                                    <th>Visual Evidence</th>
                                    <th>Location Tag</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log, idx) => (
                                    <tr key={idx}>
                                        <td style={{ color: '#888' }}># {log.id}</td>
                                        <td>{new Date(log.timestamp).toLocaleString()}</td>
                                        <td><span className="status-pill info" style={{ background: 'rgba(245, 130, 31, 0.2)', color: 'var(--accent-orange)', padding: '5px 12px', border: '1px solid var(--accent-orange)' }}>{log.plate_number}</span></td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ flex: 1, height: '4px', background: '#333', borderRadius: '2px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${log.confidence * 100}%`, height: '100%', background: log.confidence > 0.8 ? 'var(--success)' : 'var(--accent-orange)' }}></div>
                                                </div>
                                                <span style={{ fontSize: '0.85rem' }}>{(log.confidence * 100).toFixed(1)}%</span>
                                            </div>
                                        </td>
                                        <td>
                                            <button className="btn-premium btn-secondary" style={{ padding: '5px 15px', fontSize: '0.8rem' }} onClick={() => window.open(`http://localhost:5000${log.image_path}`)}>VIEW</button>
                                        </td>
                                        <td style={{ fontSize: '0.8rem', color: '#888' }}>{log.location || 'Delhi Zone 04'}</td>
                                    </tr>
                                ))}
                                {logs.length === 0 && !loading && (
                                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '50px', opacity: 0.5 }}>No recent captures found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default LogPage;
