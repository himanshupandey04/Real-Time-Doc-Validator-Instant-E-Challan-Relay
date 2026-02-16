import React from 'react';

const WorkflowAnimation = () => {
    return (
        <div className="workflow-container">
            <style>{`
                .workflow-container {
                    width: 100%;
                    max-width: 1200px; /* Increased to fit more steps */
                    margin: 0 auto;
                    background: #000;
                    padding: 40px;
                    border-radius: 20px;
                    border: 1px solid #111;
                    position: relative;
                    overflow: hidden;
                    font-family: 'Inter', sans-serif;
                }

                /* Grid Background */
                .grid-bg {
                    position: absolute;
                    inset: 0;
                    background-image: 
                        linear-gradient(#111 1px, transparent 1px),
                        linear-gradient(90deg, #111 1px, transparent 1px);
                    background-size: 40px 40px;
                    opacity: 0.3;
                    z-index: 0;
                }

                /* Icons & Elements */
                .stage-icon {
                    fill: #000;
                    stroke: #FFFFFF; 
                    stroke-width: 1.5;
                    filter: drop-shadow(0 0 3px rgba(255,255,255,0.3));
                }
                
                .white-outline {
                    stroke: rgba(255,255,255,0.4);
                    stroke-width: 1;
                }

                /* Text Labels */
                .tech-label {
                    fill: #bbb;
                    font-size: 10px;
                    font-weight: 500;
                    text-transform: uppercase;
                    opacity: 0.7;
                    transition: all 0.5s;
                }
                .tech-label.active {
                    fill: #F5821F;
                    font-weight: 700;
                    opacity: 1;
                    font-size: 11px;
                }

                /* Animations */
                @keyframes pulse {
                    0%, 100% { stroke: #FFF; filter: drop-shadow(0 0 2px rgba(255,255,255,0.5)); }
                    50% { stroke: #F5821F; filter: drop-shadow(0 0 8px rgba(245, 130, 31, 0.8)); }
                }

                @keyframes flowLine {
                    to { stroke-dashoffset: 0; }
                }

                @keyframes slideInCar {
                    0% { transform: translateX(-80px); opacity: 0; }
                    10% { transform: translateX(0); opacity: 1; }
                    90% { transform: translateX(0); opacity: 1; }
                    100% { transform: translateX(80px); opacity: 0; }
                }

                @keyframes beamScan {
                    0% { opacity: 0; transform: scaleY(0); }
                    10% { opacity: 0.6; transform: scaleY(1); }
                    20% { opacity: 0; transform: scaleY(0); }
                    100% { opacity: 0; }
                }
                
                @keyframes popUp {
                    0% { transform: scale(0); opacity: 0; }
                    10% { transform: scale(1); opacity: 1; }
                    90% { transform: scale(1); opacity: 1; }
                    100% { transform: scale(0); opacity: 0; }
                }

                .flow-path {
                    stroke: #444;
                    stroke-dasharray: 5;
                    fill: none;
                }
                .flow-path.active {
                    stroke: #F5821F;
                    animation: flowLine 1s linear forwards;
                }

                /* Timing Groups */
                .step-1 { animation: highlight 8s infinite 0s; } /* Camera */
                .step-2 { animation: highlight 8s infinite 1.5s; } /* Pre-Proc */
                .step-3 { animation: highlight 8s infinite 3s; } /* Seg */
                .step-4 { animation: highlight 8s infinite 4.5s; } /* OCR */
                .step-5 { animation: highlight 8s infinite 5.5s; } /* DB */
                .step-6 { animation: highlight 8s infinite 6.5s; } /* Challan */
                
                @keyframes highlight {
                    0%, 100% { stroke: #FFF; }
                    10%, 30% { stroke: #F5821F; filter: drop-shadow(0 0 5px #F5821F); }
                }
            `}</style>

            <div className="grid-bg"></div>

            <svg viewBox="0 0 900 350" style={{ width: '100%', height: 'auto', zIndex: 1, position: 'relative' }}>

                {/* 1. ENTRY / CAMERA (Top Left) */}
                <g transform="translate(100, 20)"> {/* Moved Right to not overlap with edge */}
                    {/* Camera pointing down */}
                    <path d="M10,10 L30,10 L40,20 L40,30 L30,40 L10,40 Z" className="stage-icon step-1" />
                    <circle cx="25" cy="25" r="5" fill="#111" stroke="#FFF" className="step-1" />
                    <text x="25" y="-5" textAnchor="middle" className="tech-label">CAMERA</text>

                    {/* Beam */}
                    <path d="M25,40 L-10,180 L60,180 Z" fill="url(#beamGrad)" style={{ transformOrigin: '25px 40px', animation: 'beamScan 8s infinite 0s' }} />
                </g>

                {/* CAR (Bottom Left) */}
                <g transform="translate(80, 200)" style={{ animation: 'slideInCar 8s infinite 0s' }}> {/* Adjusted Start Position */}
                    <path d="M0,20 L10,10 L30,10 L40,20 L70,20 L70,45 L0,45 Z" className="stage-icon" />
                    <circle cx="15" cy="45" r="8" className="stage-icon" />
                    <circle cx="55" cy="45" r="8" className="stage-icon" />
                    <rect x="15" y="25" width="40" height="10" fill="#222" stroke="#FFF" fontSize="6">
                        <animate attributeName="stroke" values="#FFF;#F5821F;#FFF" dur="8s" begin="0.8s" />
                    </rect>
                    <text x="35" y="32" fontSize="5" fill="#FFF" textAnchor="middle">RJ 12 AB 3456</text>
                </g>

                {/* Path 1: Cam to Pre-Proc */}
                <path d="M120,220 L160,220" stroke="#888" strokeWidth="1.5" strokeDasharray="3" markerEnd="url(#arrowhead)" />

                {/* 2. PRE-PROCESSING (Bottom Left-Center) */}
                <g transform="translate(170, 190)">
                    <rect x="0" y="0" width="100" height="60" rx="4" className="stage-icon step-2" />
                    <text x="50" y="15" textAnchor="middle" className="tech-label" fill="#fff" style={{ fill: '#F5821F' }}>Pre-Processing</text>

                    {/* Content */}
                    <rect x="25" y="25" width="50" height="15" stroke="#FFF" fill="none" rx="2" strokeDasharray="2" opacity="0.7" />
                    <rect x="20" y="20" width="60" height="25" stroke="#F5821F" fill="none" opacity="0">
                        <animate attributeName="opacity" values="0;1;0" dur="8s" begin="1.5s" />
                    </rect>
                    <text x="50" y="35" fontSize="8" fill="#FFF" textAnchor="middle">RJ 12 AB 3456</text>
                </g>

                {/* Path 2 */}
                <path d="M270,220 L340,220" stroke="#888" strokeWidth="1.5" strokeDasharray="3" markerEnd="url(#arrowhead)" />


                {/* 3. CHAR SEGMENTATION (Bottom Center) */}
                <g transform="translate(350, 190)">
                    <rect x="0" y="0" width="130" height="60" rx="4" className="stage-icon step-3" />
                    <text x="65" y="15" textAnchor="middle" className="tech-label" style={{ fill: '#F5821F' }}>Character Segmentation</text>

                    {/* Segmented Boxes - RJ 12 AB 3456 */}
                    <g transform="translate(15, 25)">
                        {['R', 'J', '1', '2', 'A', 'B', '3', '4', '5', '6'].map((char, i) => (
                            <g key={i} transform={`translate(${i * 10}, 0)`}>
                                <rect x="0" y="0" width="8" height="15" stroke="#F5821F" fill="none" opacity="0">
                                    <animate attributeName="opacity" values="0;1;0" dur="8s" begin={`${3.0 + (i * 0.1)}s`} />
                                </rect>
                                <text x="4" y="10" fontSize="6" fill="#FFF" textAnchor="middle">
                                    {char}
                                </text>
                            </g>
                        ))}
                    </g>
                </g>

                {/* Path 3: Up to OCR */}
                <path d="M480,220 L500,220 L500,100 L520,100" stroke="#888" strokeWidth="1.5" fill="none" strokeDasharray="3" markerEnd="url(#arrowhead)" />

                {/* 4. OCR (Top Center) */}
                <g transform="translate(530, 70)">
                    <rect x="0" y="0" width="90" height="60" rx="4" className="stage-icon step-4" /> {/* Slightly wider for full text */}
                    <text x="45" y="15" textAnchor="middle" className="tech-label" style={{ fill: '#F5821F' }}>OCR</text>
                    <text x="45" y="40" textAnchor="middle" fontSize="10" fill="#FFF" fontWeight="bold" opacity="0">
                        RJ 12 AB 3456
                        <animate attributeName="opacity" values="0;1;0" dur="8s" begin="4.5s" />
                    </text>

                    {/* Mag Glass Icon */}
                    <circle cx="65" cy="45" r="8" stroke="#F5821F" fill="none" opacity="0">
                        <animate attributeName="opacity" values="0;1;0" dur="8s" begin="4.5s" />
                    </circle>
                </g>

                {/* Path 4 */}
                <path d="M580,100 L610,100" stroke="#888" strokeWidth="1.5" strokeDasharray="3" markerEnd="url(#arrowhead)" />

                {/* 5. DATABASE (Top Right) */}
                <g transform="translate(620, 70)">
                    {/* Cloud */}
                    <path d="M10,20 Q10,5 25,5 Q35,5 40,15 Q50,10 60,20 Q70,20 70,35 Q70,50 55,50 L20,50 Q5,50 5,35 Q5,25 10,20" fill="none" stroke="#FFF" className="step-5" />
                    <text x="35" y="-5" textAnchor="middle" className="tech-label">CLOUD DB</text>

                    {/* Cylinder */}
                    <g transform="translate(15, 60)">
                        <path d="M0,10 L0,40 A20,8 0 0 0 40,40 L40,10" fill="#111" stroke="#FFF" className="step-5" />
                        <ellipse cx="20" cy="10" rx="20" ry="8" fill="#111" stroke="#FFF" className="step-5" />
                        <text x="20" y="65" textAnchor="middle" fontSize="8" fill="#BBB">Registration</text>
                    </g>
                </g>

                {/* Path 5: Down to Match */}
                <path d="M660,160 L660,200" stroke="#888" strokeWidth="1.5" strokeDasharray="3" markerEnd="url(#arrowhead)" />

                {/* DATA COMPARISON (Bottom Right) */}
                <g transform="translate(620, 200)">
                    <rect x="-20" y="0" width="80" height="40" rx="10" fill="#111" stroke="#444" />
                    <text x="20" y="15" textAnchor="middle" fontSize="8" fill="#FFF">Data Comparison</text>
                    <text x="20" y="30" textAnchor="middle" fontSize="8" fill="#F5821F" opacity="0">
                        MATCH FOUND
                        <animate attributeName="opacity" values="0;1;0" dur="8s" begin="5.8s" />
                    </text>
                </g>

                {/* Path 6 */}
                <path d="M700,220 L740,220" stroke="#888" strokeWidth="1.5" strokeDasharray="3" markerEnd="url(#arrowhead)" />


                {/* 6. E-CHALLAN SCREEN (Bottom Far Right) */}
                <g transform="translate(750, 180)">
                    <rect x="0" y="0" width="90" height="60" rx="2" className="stage-icon step-6" fill="#111" />
                    <rect x="0" y="60" width="90" height="5" fill="#333" />
                    <rect x="40" y="60" width="10" height="15" fill="#333" />

                    <text x="45" y="15" textAnchor="middle" fontSize="7" fill="#FFF" fontWeight="bold">TRAFFIC E-CHALLAN</text>
                    <rect x="5" y="20" width="80" height="35" fill="#222" />

                    {/* Mock Data */}
                    <line x1="10" y1="25" x2="80" y2="25" stroke="#444" strokeWidth="1" />
                    <line x1="10" y1="35" x2="80" y2="35" stroke="#444" strokeWidth="1" />
                    <line x1="10" y1="45" x2="80" y2="45" stroke="#444" strokeWidth="1" />

                    <text x="45" y="40" textAnchor="middle" fontSize="10" fill="#F5821F" fontWeight="bold" opacity="0">
                        GENERATED
                        <animate attributeName="opacity" values="0;1;0" dur="8s" begin="6.5s" />
                    </text>
                </g>

                {/* 7. PHONE (Floating Top) */}
                <g transform="translate(800, 80)"> {/* Moved entirely to right */}
                    <rect x="0" y="0" width="30" height="50" rx="4" className="stage-icon" fill="#111" />
                    {/* Bubble Tail */}
                    <path d="M-10,10 L-10,-5 L0,5 Z" fill="#F5821F" opacity="0">
                        <animate attributeName="opacity" values="0;1;0" dur="8s" begin="7s" />
                    </path>
                    {/* Bubble Body */}
                    <rect x="-80" y="-15" width="70" height="25" rx="4" fill="#F5821F" opacity="0">
                        <animate attributeName="opacity" values="0;1;0" dur="8s" begin="7s" />
                    </rect>
                    <text x="-45" y="0" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#FFF" opacity="0">
                        NOTIFICATION
                        <animate attributeName="opacity" values="0;1;0" dur="8s" begin="7s" />
                    </text>
                </g>

                <defs>
                    <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                        <path d="M0,0 L6,3 L0,6 Z" fill="#666" />
                    </marker>
                    <linearGradient id="beamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </linearGradient>
                </defs>

            </svg>
        </div>
    );
};

export default WorkflowAnimation;
