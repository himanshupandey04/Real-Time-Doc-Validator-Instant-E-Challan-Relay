import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';


const ResourcesPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(null);

    useEffect(() => {
        if (location.pathname.includes('rules')) setActiveTab('rules');
        else if (location.pathname.includes('fines')) setActiveTab('fines');
        else if (location.pathname.includes('safety')) setActiveTab('safety');
        else setActiveTab(null);
    }, [location]);

    const tabs = [
        { id: 'rules', label: 'Rules & Regulations' },
        { id: 'fines', label: 'Fine Structure' },
        { id: 'safety', label: 'Road Safety' }
    ];

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff', display: 'flex', flexDirection: 'column' }}>

            <Header />

            <main style={{ flex: 1, paddingTop: '120px', paddingBottom: '60px' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>

                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
                            <span style={{ color: '#F5821F' }}>RTO</span> Resources
                        </h1>
                        <p style={{ color: '#888' }}>Essential information for vehicle owners and drivers.</p>
                    </div>

                    {/* Tabs */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px', flexWrap: 'wrap' }}>
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => navigate(`/resources/${tab.id}`)}
                                className={`btn-premium ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
                                style={{
                                    borderRadius: '30px',
                                    minWidth: '150px',
                                    fontSize: '0.9rem',
                                    margin: '0 5px'
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div style={{ background: '#111', padding: '40px', borderRadius: '20px', border: '1px solid #222' }}>

                        {!activeTab && (
                            <div className="animate-fade-in" style={{ textAlign: 'center', padding: '40px 0' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📚</div>
                                <h2 style={{ color: '#fff', marginBottom: '10px' }}>Select a Resource</h2>
                                <p style={{ color: '#888' }}>Choose a category from above to view details.</p>
                            </div>
                        )}

                        {activeTab === 'rules' && (
                            <div className="animate-fade-in">
                                <h2 style={{ color: '#fff', marginBottom: '20px' }}>Traffic Rules & Regulations</h2>
                                <p style={{ color: '#ccc', lineHeight: '1.6', marginBottom: '20px' }}>
                                    Adherence to traffic rules is mandatory for the safety of all road users. Key regulations include:
                                </p>
                                <ul style={{ color: '#aaa', lineHeight: '1.8', paddingLeft: '20px' }}>
                                    <li>Always carry valid driving license, registration certificate, and insurance.</li>
                                    <li>Wear seatbelts (for cars) and helmets (for two-wheelers) at all times.</li>
                                    <li>Do not use mobile phones while driving.</li>
                                    <li>Follow lane discipline and speed limits.</li>
                                    <li>Give way to emergency vehicles.</li>
                                </ul>
                            </div>
                        )}

                        {activeTab === 'fines' && (
                            <div className="animate-fade-in">
                                <h2 style={{ color: '#fff', marginBottom: '10px', fontSize: '2rem', fontWeight: '800' }}>e-Challan & Fine Structure</h2>
                                <p style={{ color: '#888', marginBottom: '20px', fontSize: '1rem' }}>
                                    Document verification-based e-Challan system under Motor Vehicles Act
                                </p>

                                {/* System Notice */}
                                <div style={{
                                    background: 'linear-gradient(135deg, rgba(245, 130, 31, 0.15) 0%, rgba(245, 130, 31, 0.05) 100%)',
                                    padding: '25px',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(245, 130, 31, 0.3)',
                                    marginBottom: '40px'
                                }}>
                                    <h3 style={{ color: '#F5821F', marginBottom: '15px', fontSize: '1.3rem', fontWeight: '700' }}>
                                        System Purpose
                                    </h3>
                                    <p style={{ color: '#ccc', lineHeight: '1.8', margin: 0, fontSize: '1rem' }}>
                                        This e-Challan system is designed for <strong style={{ color: '#fff' }}>document verification only</strong>.
                                        Challans are automatically issued when vehicle documents are found to be expired, invalid, or not available
                                        during verification checks. The system validates Insurance, PUC, Registration Certificate, Fitness Certificate,
                                        Permit, and Road Tax status against government databases.
                                    </p>
                                </div>

                                {/* Document-Based Violations */}
                                <div style={{ marginBottom: '30px' }}>
                                    <h3 style={{
                                        color: '#F5821F',
                                        marginBottom: '25px',
                                        fontSize: '1.6rem',
                                        fontWeight: '700',
                                        paddingBottom: '10px',
                                        borderBottom: '2px solid rgba(245, 130, 31, 0.3)'
                                    }}>
                                        Document-Based e-Challan Violations
                                    </h3>

                                    {/* 1. Insurance Status */}
                                    <div style={{
                                        background: '#0a0a0a',
                                        padding: '30px',
                                        borderRadius: '10px',
                                        border: '1px solid #222',
                                        marginBottom: '20px'
                                    }}>
                                        <div style={{ marginBottom: '20px' }}>
                                            <h4 style={{
                                                color: '#fff',
                                                fontSize: '1.3rem',
                                                fontWeight: '700',
                                                marginBottom: '8px'
                                            }}>
                                                1. Insurance Status
                                            </h4>
                                            <p style={{
                                                color: '#888',
                                                fontSize: '0.95rem',
                                                margin: 0,
                                                fontStyle: 'italic'
                                            }}>
                                                Law: Motor Vehicles Act, Section 146 / 196
                                            </p>
                                        </div>

                                        <div style={{ marginBottom: '15px' }}>
                                            <p style={{ color: '#ccc', marginBottom: '8px', fontSize: '1rem' }}>
                                                <strong style={{ color: '#fff' }}>Condition:</strong>
                                            </p>
                                            <p style={{ color: '#aaa', marginLeft: '20px', marginBottom: '5px' }}>
                                                • Status = Expired / Not Available
                                            </p>
                                            <p style={{ color: '#F5821F', marginLeft: '20px', fontWeight: '600' }}>
                                                → e-Challan can be issued
                                            </p>
                                        </div>

                                        <div style={{ marginBottom: '15px' }}>
                                            <p style={{ color: '#ccc', marginBottom: '8px', fontSize: '1rem' }}>
                                                <strong style={{ color: '#fff' }}>Fine:</strong>
                                            </p>
                                            <p style={{ color: '#aaa', marginLeft: '20px', marginBottom: '5px' }}>
                                                • ₹2,000 (first offence)
                                            </p>
                                            <p style={{ color: '#aaa', marginLeft: '20px' }}>
                                                • ₹4,000 (repeat offence)
                                            </p>
                                        </div>

                                        <div style={{
                                            background: 'rgba(245, 130, 31, 0.1)',
                                            padding: '12px 15px',
                                            borderRadius: '6px',
                                            borderLeft: '3px solid #F5821F'
                                        }}>
                                            <p style={{ color: '#ccc', margin: 0, fontSize: '0.9rem' }}>
                                                <strong style={{ color: '#F5821F' }}>Note:</strong> This is one of the strongest auto-detect violations.
                                            </p>
                                        </div>
                                    </div>

                                    {/* 2. PUC */}
                                    <div style={{
                                        background: '#0a0a0a',
                                        padding: '30px',
                                        borderRadius: '10px',
                                        border: '1px solid #222',
                                        marginBottom: '20px'
                                    }}>
                                        <div style={{ marginBottom: '20px' }}>
                                            <h4 style={{
                                                color: '#fff',
                                                fontSize: '1.3rem',
                                                fontWeight: '700',
                                                marginBottom: '8px'
                                            }}>
                                                2. PUC (Pollution Under Control)
                                            </h4>
                                            <p style={{
                                                color: '#888',
                                                fontSize: '0.95rem',
                                                margin: 0,
                                                fontStyle: 'italic'
                                            }}>
                                                Law: Section 190(2) MV Act
                                            </p>
                                        </div>

                                        <div style={{ marginBottom: '15px' }}>
                                            <p style={{ color: '#ccc', marginBottom: '8px', fontSize: '1rem' }}>
                                                <strong style={{ color: '#fff' }}>Condition:</strong>
                                            </p>
                                            <p style={{ color: '#aaa', marginLeft: '20px', marginBottom: '5px' }}>
                                                • Status = Expired
                                            </p>
                                            <p style={{ color: '#F5821F', marginLeft: '20px', fontWeight: '600' }}>
                                                → e-Challan valid
                                            </p>
                                        </div>

                                        <div style={{ marginBottom: '15px' }}>
                                            <p style={{ color: '#ccc', marginBottom: '8px', fontSize: '1rem' }}>
                                                <strong style={{ color: '#fff' }}>Fine:</strong>
                                            </p>
                                            <p style={{ color: '#aaa', marginLeft: '20px' }}>
                                                • Up to ₹10,000
                                            </p>
                                        </div>

                                        <div style={{
                                            background: 'rgba(245, 130, 31, 0.1)',
                                            padding: '12px 15px',
                                            borderRadius: '6px',
                                            borderLeft: '3px solid #F5821F'
                                        }}>
                                            <p style={{ color: '#ccc', margin: 0, fontSize: '0.9rem' }}>
                                                <strong style={{ color: '#F5821F' }}>Note:</strong> Very commonly used in real Indian enforcement systems.
                                            </p>
                                        </div>
                                    </div>

                                    {/* 3. Registration Certificate */}
                                    <div style={{
                                        background: '#0a0a0a',
                                        padding: '30px',
                                        borderRadius: '10px',
                                        border: '1px solid #222',
                                        marginBottom: '20px'
                                    }}>
                                        <div style={{ marginBottom: '20px' }}>
                                            <h4 style={{
                                                color: '#fff',
                                                fontSize: '1.3rem',
                                                fontWeight: '700',
                                                marginBottom: '8px'
                                            }}>
                                                3. Registration Certificate (RC)
                                            </h4>
                                            <p style={{
                                                color: '#888',
                                                fontSize: '0.95rem',
                                                margin: 0,
                                                fontStyle: 'italic'
                                            }}>
                                                Law: Section 39 / 192 MV Act
                                            </p>
                                        </div>

                                        <div style={{ marginBottom: '15px' }}>
                                            <p style={{ color: '#ccc', marginBottom: '8px', fontSize: '1rem' }}>
                                                <strong style={{ color: '#fff' }}>Condition:</strong>
                                            </p>
                                            <p style={{ color: '#aaa', marginLeft: '20px', marginBottom: '5px' }}>
                                                • RC expired
                                            </p>
                                            <p style={{ color: '#aaa', marginLeft: '20px', marginBottom: '5px' }}>
                                                • Vehicle not registered
                                            </p>
                                            <p style={{ color: '#aaa', marginLeft: '20px', marginBottom: '5px' }}>
                                                • Temporary registration expired
                                            </p>
                                            <p style={{ color: '#F5821F', marginLeft: '20px', fontWeight: '600' }}>
                                                → e-Challan valid
                                            </p>
                                        </div>
                                    </div>

                                    {/* 4. Fitness Certificate */}
                                    <div style={{
                                        background: '#0a0a0a',
                                        padding: '30px',
                                        borderRadius: '10px',
                                        border: '1px solid #222',
                                        marginBottom: '20px'
                                    }}>
                                        <div style={{ marginBottom: '20px' }}>
                                            <h4 style={{
                                                color: '#fff',
                                                fontSize: '1.3rem',
                                                fontWeight: '700',
                                                marginBottom: '8px'
                                            }}>
                                                4. Fitness Certificate (Commercial Vehicles Only)
                                            </h4>
                                            <p style={{
                                                color: '#888',
                                                fontSize: '0.95rem',
                                                margin: 0,
                                                fontStyle: 'italic'
                                            }}>
                                                Law: Section 56 / 192 MV Act
                                            </p>
                                        </div>

                                        <div style={{ marginBottom: '15px' }}>
                                            <p style={{ color: '#ccc', marginBottom: '8px', fontSize: '1rem' }}>
                                                <strong style={{ color: '#fff' }}>Condition:</strong>
                                            </p>
                                            <p style={{ color: '#aaa', marginLeft: '20px', marginBottom: '5px' }}>
                                                • Status = Expired
                                            </p>
                                            <p style={{ color: '#F5821F', marginLeft: '20px', fontWeight: '600' }}>
                                                → e-Challan valid
                                            </p>
                                        </div>

                                        <div style={{
                                            background: 'rgba(245, 130, 31, 0.1)',
                                            padding: '12px 15px',
                                            borderRadius: '6px',
                                            borderLeft: '3px solid #F5821F'
                                        }}>
                                            <p style={{ color: '#ccc', margin: 0, fontSize: '0.9rem' }}>
                                                <strong style={{ color: '#F5821F' }}>Applicability:</strong> Only applicable for transport/commercial vehicles.
                                            </p>
                                        </div>
                                    </div>

                                    {/* 5. Permit */}
                                    <div style={{
                                        background: '#0a0a0a',
                                        padding: '30px',
                                        borderRadius: '10px',
                                        border: '1px solid #222',
                                        marginBottom: '20px'
                                    }}>
                                        <div style={{ marginBottom: '20px' }}>
                                            <h4 style={{
                                                color: '#fff',
                                                fontSize: '1.3rem',
                                                fontWeight: '700',
                                                marginBottom: '8px'
                                            }}>
                                                5. Permit (Commercial Vehicles)
                                            </h4>
                                            <p style={{
                                                color: '#888',
                                                fontSize: '0.95rem',
                                                margin: 0,
                                                fontStyle: 'italic'
                                            }}>
                                                Law: Section 66 / 192A MV Act
                                            </p>
                                        </div>

                                        <div style={{ marginBottom: '15px' }}>
                                            <p style={{ color: '#ccc', marginBottom: '8px', fontSize: '1rem' }}>
                                                <strong style={{ color: '#fff' }}>Condition:</strong>
                                            </p>
                                            <p style={{ color: '#aaa', marginLeft: '20px', marginBottom: '5px' }}>
                                                • No permit
                                            </p>
                                            <p style={{ color: '#aaa', marginLeft: '20px', marginBottom: '5px' }}>
                                                • Expired permit
                                            </p>
                                            <p style={{ color: '#F5821F', marginLeft: '20px', fontWeight: '600' }}>
                                                → e-Challan valid
                                            </p>
                                        </div>
                                    </div>

                                    {/* 6. Road Tax */}
                                    <div style={{
                                        background: '#0a0a0a',
                                        padding: '30px',
                                        borderRadius: '10px',
                                        border: '1px solid #222',
                                        marginBottom: '20px'
                                    }}>
                                        <div style={{ marginBottom: '20px' }}>
                                            <h4 style={{
                                                color: '#fff',
                                                fontSize: '1.3rem',
                                                fontWeight: '700',
                                                marginBottom: '8px'
                                            }}>
                                                6. Road Tax Status (State Dependent)
                                            </h4>
                                            <p style={{
                                                color: '#888',
                                                fontSize: '0.95rem',
                                                margin: 0,
                                                fontStyle: 'italic'
                                            }}>
                                                Law: State Motor Vehicles Taxation Act
                                            </p>
                                        </div>

                                        <div style={{ marginBottom: '15px' }}>
                                            <p style={{ color: '#ccc', marginBottom: '8px', fontSize: '1rem' }}>
                                                <strong style={{ color: '#fff' }}>Condition:</strong>
                                            </p>
                                            <p style={{ color: '#aaa', marginLeft: '20px', marginBottom: '5px' }}>
                                                • Tax unpaid
                                            </p>
                                            <p style={{ color: '#aaa', marginLeft: '20px', marginBottom: '5px' }}>
                                                • Tax expired
                                            </p>
                                            <p style={{ color: '#F5821F', marginLeft: '20px', fontWeight: '600' }}>
                                                → e-Challan possible
                                            </p>
                                        </div>

                                        <div style={{
                                            background: 'rgba(245, 130, 31, 0.1)',
                                            padding: '12px 15px',
                                            borderRadius: '6px',
                                            borderLeft: '3px solid #F5821F'
                                        }}>
                                            <p style={{ color: '#ccc', margin: 0, fontSize: '0.9rem' }}>
                                                <strong style={{ color: '#F5821F' }}>Note:</strong> Depends on state implementation and integration.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Important Information */}
                                <div style={{ marginTop: '40px' }}>
                                    <h3 style={{
                                        color: '#F5821F',
                                        marginBottom: '25px',
                                        fontSize: '1.6rem',
                                        fontWeight: '700',
                                        paddingBottom: '10px',
                                        borderBottom: '2px solid rgba(245, 130, 31, 0.3)'
                                    }}>
                                        Important Information
                                    </h3>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                                        {/* Payment Methods */}
                                        <div style={{ background: '#0a0a0a', padding: '25px', borderRadius: '10px', border: '1px solid #222' }}>
                                            <h4 style={{ color: '#fff', marginBottom: '15px', fontSize: '1.1rem', fontWeight: '700' }}>Payment Methods</h4>
                                            <ul style={{ color: '#aaa', lineHeight: '1.8', paddingLeft: '20px', margin: 0 }}>
                                                <li><strong style={{ color: '#F5821F' }}>Online:</strong> parivahan.gov.in</li>
                                                <li><strong style={{ color: '#F5821F' }}>Online:</strong> State Traffic Police Apps</li>
                                                <li><strong style={{ color: '#F5821F' }}>Offline:</strong> Designated Payment Centers</li>
                                            </ul>
                                        </div>

                                        {/* Verification Process */}
                                        <div style={{ background: '#0a0a0a', padding: '25px', borderRadius: '10px', border: '1px solid #222' }}>
                                            <h4 style={{ color: '#fff', marginBottom: '15px', fontSize: '1.1rem', fontWeight: '700' }}>Verification Process</h4>
                                            <ul style={{ color: '#aaa', lineHeight: '1.8', paddingLeft: '20px', margin: 0 }}>
                                                <li>Automated document status check</li>
                                                <li>Real-time database validation</li>
                                                <li>Instant e-Challan generation</li>
                                                <li>SMS/Email notification to owner</li>
                                            </ul>
                                        </div>

                                        {/* Important Warnings */}
                                        <div style={{ background: 'rgba(245, 130, 31, 0.1)', padding: '25px', borderRadius: '10px', border: '1px solid rgba(245, 130, 31, 0.3)' }}>
                                            <h4 style={{ color: '#F5821F', marginBottom: '15px', fontSize: '1.1rem', fontWeight: '700' }}>Important Warnings</h4>
                                            <ul style={{ color: '#ccc', lineHeight: '1.8', paddingLeft: '20px', margin: 0 }}>
                                                <li>Pay within <strong style={{ color: '#F5821F' }}>45 days</strong> to avoid service block</li>
                                                <li>Keep all documents updated and valid</li>
                                                <li>Renewal reminders sent 30 days before expiry</li>
                                                <li>Multiple violations may lead to vehicle seizure</li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Legal Framework */}
                                    <div style={{ marginTop: '20px', padding: '20px', background: '#0a0a0a', borderRadius: '10px', border: '1px solid #222', textAlign: 'center' }}>
                                        <p style={{ color: '#F5821F', fontWeight: '700', fontSize: '1.1rem', marginBottom: '5px' }}>Motor Vehicles Act, 1988 (Amended 2019)</p>
                                        <p style={{ color: '#888', fontSize: '0.9rem', margin: 0 }}>Ministry of Road Transport & Highways, Government of India</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'safety' && (
                            <div className="animate-fade-in">
                                <h2 style={{ color: '#fff', marginBottom: '20px' }}>Road Safety Guidelines</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                                    {[
                                        { title: 'Defensive Driving', desc: 'Anticipate scenarios and drive proactively.' },
                                        { title: 'Vehicle Maintenance', desc: 'Regulary check brakes, tires, and lights.' },
                                        { title: 'Pedestrian Safety', desc: 'Always yield to pedestrians at crossings.' },
                                        { title: 'Night Driving', desc: 'Use low beams when facing oncoming traffic.' }
                                    ].map((item, i) => (
                                        <div key={i} style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
                                            <h3 style={{ color: '#F5821F', fontSize: '1.1rem', marginBottom: '10px' }}>{item.title}</h3>
                                            <p style={{ color: '#888', fontSize: '0.9rem' }}>{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                </div>
            </main >
            <Footer />
        </div >
    );
};

export default ResourcesPage;
