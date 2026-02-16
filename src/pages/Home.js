import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

import WorkflowAnimation from '../components/WorkflowAnimation';
import CleanStats from '../components/CleanStats';

const Home = () => {
    // Target counts for the statistics (Set to 0 as placeholders until real data is connected)
    const statsData = [
        { id: 1, label: "VEHICLES VERIFIED", target: 0, subtext: "OCR detection runs" },
        { id: 2, label: "E-CHALLANS GENERATED", target: 0, subtext: "Enforcement logic" },
        { id: 3, label: "INSURANCE VALIDATIONS", target: 0, subtext: "Status checks" },
        { id: 4, label: "PUC CERTIFICATES VERIFIED", target: 0, subtext: "Pollution control" },
        { id: 5, label: "FITNESS & PERMIT CHECKS", target: 0, subtext: "Compliance checks" },
        { id: 6, label: "PLATFORM VISITS", target: 0, subtext: "System interactions" }
    ];

    const [counts, setCounts] = useState([0, 0, 0, 0, 0, 0]);
    const [showWorkflow, setShowWorkflow] = useState(false);
    const [targets, setTargets] = useState([0, 0, 0, 0, 0, 0]);

    useEffect(() => {
        const fetchHomeStats = async () => {
            try {
                const response = await fetch('http://localhost:5000/dashboard_stats');
                if (response.ok) {
                    const data = await response.json();
                    const totalViolations = Object.values(data.violationCounts).reduce((a, b) => a + b, 0);
                    // Mock distribution for home page based on real totals
                    setTargets([
                        totalViolations * 5, // Vehicles verified (Est.)
                        totalViolations,
                        data.violationCounts['Expired Insurance'] || 0,
                        data.violationCounts['Expired PUC'] || 0,
                        (data.violationCounts['Expired Fitness'] || 0) + (data.violationCounts['No Permit'] || 0),
                        1402 // Platform visits (Mock)
                    ]);
                }
            } catch (err) {
                console.error("Home stats error:", err);
            }
        };
        fetchHomeStats();
    }, []);

    useEffect(() => {
        const duration = 2000;
        const steps = 60;
        const intervalTime = duration / steps;

        const timers = targets.map((target, index) => {
            if (target === 0) return null;
            const increment = target / steps;
            let current = 0;
            return setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timers[index]);
                }
                setCounts(prev => {
                    const newCounts = [...prev];
                    newCounts[index] = Math.floor(current);
                    return newCounts;
                });
            }, intervalTime);
        });

        return () => timers.forEach(t => t && clearInterval(t));
    }, [targets]);

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    return (
        <div style={{ backgroundColor: '#000000', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#ffffff', position: 'relative' }}>

            <Header />

            <main style={{ flex: 1, paddingTop: '0', paddingBottom: '0', width: '100%' }}>

                {/* Hero Section with Video */}
                <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            top: 0,
                            left: 0,
                            zIndex: 0,
                            filter: 'brightness(0.6)'
                        }}
                    >
                        <source src="/assets/v1.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    {/* Gradient Overlay */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)',
                        zIndex: 1
                    }}></div>

                    {/* Hero Content */}
                    <div style={{
                        position: 'relative',
                        zIndex: 10,
                        textAlign: 'center',
                        maxWidth: '900px',
                        padding: '0 20px',
                        animation: 'fadeInUp 1s ease-out'
                    }}>
                        <h1 style={{
                            fontSize: '4.5rem',
                            fontWeight: '800',
                            lineHeight: '1.1',
                            marginBottom: '20px',
                            background: 'linear-gradient(90deg, #fff, #F5821F)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: '0 10px 30px rgba(0,0,0,0.5)'
                        }}>
                            INTELLIGENT TRAFFIC CONTROL
                        </h1>
                        <p style={{
                            fontSize: '1.4rem',
                            color: 'rgba(255,255,255,0.9)',
                            marginBottom: '40px',
                            fontWeight: '300',
                            letterSpacing: '0.5px'
                        }}>
                            Next-Generation AI for Safer, Smarter, and More Efficient Roads.
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <button style={{
                                padding: '12px 30px',
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                borderRadius: '50px',
                                border: 'none',
                                background: '#F5821F',
                                color: '#fff',
                                cursor: 'pointer',
                                minWidth: '180px',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                boxShadow: '0 10px 20px rgba(245, 130, 31, 0.3)'
                            }}
                                onClick={() => setShowWorkflow(true)}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(245, 130, 31, 0.5)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(245, 130, 31, 0.3)'; }}
                            >
                                EXPLORE SYSTEM
                            </button>
                        </div>
                    </div>

                    {/* Scroll Down Indicator */}
                    <div style={{
                        position: 'absolute',
                        bottom: '40px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 10,
                        animation: 'bounce 2s infinite'
                    }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                        </svg>
                    </div>
                </div>

                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>



                    {/* Stats Section - Clean Design */}
                    <CleanStats statsData={statsData} counts={counts} formatNumber={formatNumber} />

                    {/* Infrastructure Gallery Section - Marquee */}
                    <div style={{ marginTop: '100px', marginBottom: '40px', overflow: 'hidden' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '30px', color: '#fff' }}>
                            <span style={{ color: '#F5821F' }}>Smart</span> Infrastructure
                        </h2>

                        <style>{`
                            @keyframes scroll {
                                0% { transform: translateX(0); }
                                100% { transform: translateX(-50%); }
                            }
                            .marquee-track {
                                display: flex;
                                width: max-content;
                                animation: scroll 30s linear infinite;
                            }
                            .marquee-track:hover {
                                animation-play-state: paused;
                            }
                            @keyframes fadeInUp {
                                from { opacity: 0; transform: translateY(20px); }
                                to { opacity: 1; transform: translateY(0); }
                            }
                            @keyframes bounce {
                                0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); }
                                40% { transform: translateY(-10px) translateX(-50%); }
                                60% { transform: translateY(-5px) translateX(-50%); }
                            }
                        `}</style>

                        <div className="marquee-track">
                            {/* Duplicate items for seamless loop (1-6 twice) */}
                            {[1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6].map((num, index) => (
                                <div key={`${num}-${index}`} style={{
                                    position: 'relative',
                                    height: '250px',
                                    width: '350px',
                                    flexShrink: 0,
                                    marginRight: '20px',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    border: '1px solid #333',
                                    cursor: 'pointer',
                                    transition: 'border-color 0.3s'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = '#F5821F';
                                        const img = e.currentTarget.querySelector('img');
                                        if (img) img.style.transform = 'scale(1.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = '#333';
                                        const img = e.currentTarget.querySelector('img');
                                        if (img) img.style.transform = 'scale(1)';
                                    }}
                                >
                                    <img
                                        src={`/assets/r${num}.jpg`}
                                        alt={`Infrastructure ${num}`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transition: 'transform 0.5s ease'
                                        }}
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)',
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                        padding: '20px'
                                    }}>
                                        <span style={{ color: '#fff', fontWeight: '600', letterSpacing: '0.5px' }}>
                                            Surveillance Unit 0{num}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </main>

            <Footer />

            {/* Workflow Animation Modal */}
            {showWorkflow && (
                <div
                    onClick={() => setShowWorkflow(false)} // Backdrop click to close
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.95)',
                        zIndex: 9000,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity: 1,
                        transition: 'opacity 0.3s ease',
                        backdropFilter: 'blur(10px)',
                        cursor: 'pointer' // Indicate clickable background
                    }}
                >


                    <h2 style={{ color: '#fff', marginBottom: '40px', fontSize: '2rem', cursor: 'default' }} onClick={e => e.stopPropagation()}>
                        System <span style={{ color: '#F5821F' }}>Workflow</span>
                    </h2>

                    <div
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on content
                        style={{ width: '90%', maxWidth: '1000px', cursor: 'default' }}
                    >
                        <WorkflowAnimation />
                    </div>
                </div>
            )}

            {/* Professional Animation Styles */}
            <style>{`
                @keyframes fadeInUp {
                    0% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* Custom Scrollbar for Stats Container */
                div::-webkit-scrollbar {
                    height: 6px;
                }

                div::-webkit-scrollbar-track {
                    background: #111;
                    border-radius: 10px;
                }

                div::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 10px;
                }

                div::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.5);
                }

                /* Responsive adjustments */
                @media (max-width: 768px) {
                    .stat-card-professional {
                        min-width: 150px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Home;
