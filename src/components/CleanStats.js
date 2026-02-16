import React from 'react';

const CleanStats = ({ statsData, counts, formatNumber }) => {
    return (
        <div style={{ marginBottom: '80px', overflow: 'hidden' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '20px', color: '#fff', textAlign: 'center' }}>
                Real-Time <span style={{ color: '#F5821F' }}>Performance</span>
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#a0a0a0', maxWidth: '800px', margin: '0 auto 50px', textAlign: 'center' }}>
                Monitoring millions of data points daily to ensure traffic compliance and public safety.
            </p>

            {/* Clean Stats Line - No Containers */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0',
                flexWrap: 'nowrap',
                padding: '20px 0'
            }}>
                {statsData.map((stat, index) => (
                    <React.Fragment key={stat.id}>
                        <div
                            className="stat-item-clean"
                            style={{
                                textAlign: 'center',
                                padding: '0 30px',
                                position: 'relative',
                                opacity: 0,
                                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`
                            }}
                        >
                            <div style={{
                                marginBottom: '8px',
                                fontSize: '0.65rem',
                                color: 'rgba(255, 255, 255, 0.5)',
                                fontWeight: '600',
                                letterSpacing: '1px',
                                textTransform: 'uppercase',
                                whiteSpace: 'nowrap'
                            }}>
                                {stat.label}
                            </div>
                            <div
                                className="stat-number"
                                style={{
                                    fontSize: '2.5rem',
                                    fontWeight: '700',
                                    fontFamily: 'Inter, sans-serif',
                                    color: '#ffffff',
                                    marginBottom: '4px',
                                    letterSpacing: '-1px',
                                    animation: `numberScale 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.1}s both`,
                                    transition: 'transform 0.3s ease, color 0.3s ease',
                                    cursor: 'default'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.15)';
                                    e.currentTarget.style.color = '#F5821F';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.color = '#ffffff';
                                }}
                            >
                                {formatNumber(counts[index])}
                            </div>
                            <div style={{
                                fontSize: '0.65rem',
                                color: 'rgba(255, 255, 255, 0.4)',
                                fontWeight: '400',
                                whiteSpace: 'nowrap'
                            }}>
                                {stat.subtext}
                            </div>
                        </div>
                        {index < statsData.length - 1 && (
                            <div style={{
                                width: '1px',
                                height: '60px',
                                background: 'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.1), transparent)',
                                opacity: 0,
                                animation: `fadeIn 0.6s ease-out ${(index + 1) * 0.1}s forwards`
                            }}></div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            <style>{`
                @keyframes numberScale {
                    0% {
                        transform: scale(0.5);
                        opacity: 0;
                    }
                    60% {
                        transform: scale(1.1);
                    }
                    100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default CleanStats;
