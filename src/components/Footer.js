import React, { useState, useEffect } from 'react';

// Legal Content Data
const legalContent = {
    disclaimer: {
        title: "LEGAL DISCLAIMER",
        content: `
            <div class="legal-body">
                <p><strong>Application Name:</strong> Real-Time Doc Validator & Instant E-Challan Relay</p>
                <p><strong>Author:</strong> Himanshu Kumar Pandey</p>
                <p><strong>Last Updated:</strong> February 12, 2026</p>
                <br/>
                <p>This website titled <strong>“Real-Time Doc Validator & Instant E-Challan Relay”</strong> is developed as an academic capstone project under PES University, Bengaluru.</p>
                
                <p>The platform is created strictly for <strong>educational, research, and demonstration purposes only</strong>. It is not affiliated with, endorsed by, or operated by any government authority including but not limited to the Ministry of Road Transport & Highways (MoRTH), Parivahan, Regional Transport Offices (RTO), State Transport Departments, or any law enforcement agency.</p>

                <p>All references made within this system to:</p>
                <ul>
                    <li>Motor Vehicles Act, 1988</li>
                    <li>Motor Vehicles (Amendment) Act, 2019</li>
                    <li>Central Motor Vehicles Rules</li>
                    <li>Road Safety Policies</li>
                </ul>
                <p>are based solely on publicly available information from official Government of India portals.</p>

                <div class="highlight-box">
                    This system does not issue legally enforceable challans. Any violation detection, vehicle validation, or document verification results displayed are simulated outputs generated for academic demonstration purposes only.
                </div>

                <p>The developers shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from the use of this platform.</p>

                <p class="law-text">This Disclaimer shall be governed by the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of courts in Bengaluru, Karnataka.</p>
            </div>
        `
    },
    privacy: {
        title: "PRIVACY POLICY",
        content: `
            <div class="legal-body">
                <p>This Privacy Policy is drafted in accordance with:</p>
                <ul>
                    <li>Digital Personal Data Protection Act, 2023 (DPDP Act)</li>
                    <li>Information Technology Act, 2000</li>
                    <li>Applicable Indian data protection regulations</li>
                </ul>

                <h3>1. Information Collected</h3>
                <p><strong>Vehicle Data (Demonstration Dataset Only):</strong></p>
                <ul>
                    <li>Vehicle registration numbers detected or entered</li>
                    <li>Uploaded vehicle images (if applicable)</li>
                </ul>
                <p><em>This system does NOT access live government databases such as VAHAN.</em></p>

                <p><strong>Technical Data:</strong></p>
                <ul>
                    <li>IP address, Browser type, Device information</li>
                    <li>Access timestamps, System logs</li>
                </ul>

                <h3>2. Purpose of Data Collection</h3>
                <ul>
                    <li>Demonstration of AI-based number plate detection</li>
                    <li>Validation against structured mock dataset</li>
                    <li>System performance monitoring</li>
                    <li>Logging and debugging</li>
                </ul>

                <h3>3. Data Storage & Sharing</h3>
                <p>Data is stored locally within the application database. No financial information is collected. No real citizen data is stored.</p>
                <p>No personal data is sold or transferred. Data may only be disclosed if legally required.</p>

                <h3>4. User Rights under DPDP Act</h3>
                <p>Users may request: Access to their data, Correction of inaccurate data, Deletion of data, Withdrawal of consent.</p>

                <h3>5. Grievance Officer</h3>
                <p>
                    <strong>Name:</strong> Himanshu Kumar Pandey<br>
                    <strong>Email:</strong> himanshupandey0410@gmail.com<br>
                    <strong>Location:</strong> Bengaluru, Karnataka
                </p>

                <h3>6. Security & Guidelines</h3>
                <p>We implement strict access control and secure backend configurations. This platform is not intended for individuals under 18 years of age.</p>
            </div>
        `
    },
    terms: {
        title: "TERMS & CONDITIONS",
        content: `
            <div class="legal-body">
                <h3>1. Educational Use Only</h3>
                <p>This platform is designed strictly for academic demonstration and research purposes.</p>

                <h3>2. No Official Enforcement Authority</h3>
                <p>The platform does not:</p>
                <ul>
                    <li>Issue official challans</li>
                    <li>Process government fines</li>
                    <li>Connect to live RTO databases</li>
                    <li>Replace official government portals</li>
                </ul>

                <h3>3. User Conduct</h3>
                <p>Users shall not attempt unauthorized access, upload malicious content, reverse engineer system components, or misuse platform functionality.</p>

                <h3>4. Intellectual Property</h3>
                <p>All UI designs, source code, documentation, system architecture, and AI model integration belong to the developer unless otherwise specified.</p>

                <h3>5. Limitation of Liability</h3>
                <p>Maximum liability shall not exceed INR 1,000.</p>

                <h3>6. Governing Law & Jurisdiction</h3>
                <p>These Terms shall be governed by Indian law. Exclusive jurisdiction: Bengaluru, Karnataka.</p>

                <h3>7. Modifications</h3>
                <p>Terms may be updated at any time without prior notice.</p>
            </div>
        `
    },
    financial: {
        title: "FINANCIAL DISCLOSURE",
        content: `
            <div class="legal-body">
                <div class="highlight-box">
                    This platform does not process real financial transactions.
                </div>
                
                <h3>Key Disclosures:</h3>
                <ul>
                    <li>No payment gateway integration</li>
                    <li>No affiliate marketing</li>
                    <li>No advertising revenue</li>
                    <li>No monetization</li>
                    <li>No real challan payment collection</li>
                </ul>

                <p>Any challan amounts displayed are <strong>simulated values for demonstration purposes only</strong>.</p>
                <p>No financial data (credit cards, bank details, UPI IDs) is collected from users.</p>
            </div>
        `
    }
};

function Footer() {
    const [activeLegal, setActiveLegal] = useState(null);

    const openLegal = (e, type) => {
        e.preventDefault();
        setActiveLegal(type);
    };

    const closeLegal = () => setActiveLegal(null);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (activeLegal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [activeLegal]);

    return (
        <>
            <footer className="footer">
                <div className="footer-container">
                    {/* Brand / About Section */}
                    <div className="footer-brand">
                        <div className="brand-logo">
                            <img src="/assets/ECR_LOGO.svg" alt="ECR Logo" className="footer-logo-img" />
                            <span className="brand-text">ECR Portal</span>
                        </div>
                        <p className="brand-desc">
                            Streamlining traffic management and enhancing road safety through digital innovation.
                        </p>
                    </div>

                    {/* Links Grid */}
                    <div className="footer-links-grid">

                        <div className="footer-column">
                            <h4>LEGAL</h4>
                            <ul>
                                <li><a href="#" onClick={(e) => openLegal(e, 'disclaimer')}>Legal Disclaimer</a></li>
                                <li><a href="#" onClick={(e) => openLegal(e, 'privacy')}>Privacy Policy</a></li>
                                <li><a href="#" onClick={(e) => openLegal(e, 'terms')}>Terms & Conditions</a></li>
                                <li><a href="#" onClick={(e) => openLegal(e, 'financial')}>Financial Disclosure</a></li>
                            </ul>
                        </div>

                        {/* Useful Links */}
                        <div className="footer-column">
                            <h4>Useful Links</h4>
                            <ul>
                                <li><a href="https://parivahan.gov.in/" target="_blank" rel="noopener noreferrer">Parivahan Official Portal</a></li>
                                <li><a href="https://www.indiacode.nic.in/bitstream/123456789/9460/1/a1988-59.pdf" target="_blank" rel="noopener noreferrer">Motor Vehicles Act, 1988 (Govt PDF)</a></li>
                                <li><a href="https://parivahan.gov.in/parivahan//en/content/act-rules-and-policies" target="_blank" rel="noopener noreferrer">Act, Rules & Policies – Parivahan</a></li>
                                <li><a href="https://morth.nic.in/en/road-safety" target="_blank" rel="noopener noreferrer">MoRTH – Road Safety</a></li>
                                <li><a href="https://morth.nic.in/en/national-road-safety-policy-1" target="_blank" rel="noopener noreferrer">National Road Safety Policy</a></li>
                                <li><a href="https://transport.delhi.gov.in/transport/acts-and-rules" target="_blank" rel="noopener noreferrer">State/City RTO Acts & Rules</a></li>
                                <li><a href="https://www.indiacode.nic.in/" target="_blank" rel="noopener noreferrer">India Code – Central Laws (Acts)</a></li>
                                <li><a href="https://parivahan.gov.in/" target="_blank" rel="noopener noreferrer">Regional Transport Office Info (Govt)</a></li>
                            </ul>
                        </div>

                        {/* Connect with Us */}
                        <div className="footer-column">
                            <h4>Connect with Us</h4>
                            <ul>
                                <li>
                                    <a href="https://btp.gov.in" target="_blank" rel="noopener noreferrer">
                                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ marginRight: '10px' }}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>
                                        Website
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.facebook.com/blrcitytrafficpolice" target="_blank" rel="noopener noreferrer">
                                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ marginRight: '10px' }}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                                        Facebook
                                    </a>
                                </li>
                                <li>
                                    <a href="https://twitter.com/blrcitytraffic" target="_blank" rel="noopener noreferrer">
                                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ marginRight: '10px' }}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                        Twitter (X)
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.instagram.com/blrcitytrafficpolice/" target="_blank" rel="noopener noreferrer">
                                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ marginRight: '10px' }}><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                        Instagram
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="copyright">
                        &copy; 2026 ECR Traffic Portal. All Rights Reserved.
                    </div>
                    <div className="credits">
                        Driving Towards a Safer Future
                    </div>
                </div>
            </footer>

            {/* LEGAL MODAL */}
            {activeLegal && (
                <div className="legal-modal-overlay" onClick={closeLegal}>
                    <div className="legal-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="legal-header">
                            <h2>{legalContent[activeLegal].title}</h2>
                            <button className="close-btn" onClick={closeLegal}>&times;</button>
                        </div>
                        <div className="legal-scroll-area" dangerouslySetInnerHTML={{ __html: legalContent[activeLegal].content }}></div>
                        <div className="legal-footer">
                            <button className="btn-accept" onClick={closeLegal}>I Understand</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                /* Legal Modal Styles */
                .legal-modal-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0, 0, 0, 0.4); /* Lighter overlay to show blur */
                    backdrop-filter: blur(8px); /* Requested blur effect */
                    z-index: 9000; /* Below Header (9999) */
                    display: flex; align-items: center; justify-content: center;
                    padding: 20px; animation: fadeIn 0.3s ease;
                }
                
                .legal-modal-content {
                    background: rgba(10, 10, 10, 0.95); 
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    width: 100%; max-width: 700px; /* Increased Width */
                    max-height: 70vh; /* Compact Height */
                    display: flex; flex-direction: column;
                    border-radius: 16px; 
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
                    animation: popIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
                    color: #ddd; font-family: 'Inter', sans-serif;
                }

                @keyframes popIn { 
                    from { transform: scale(0.95) translateY(10px); opacity: 0; } 
                    to { transform: scale(1) translateY(0); opacity: 1; } 
                }

                .legal-header {
                    padding: 20px 25px; border-bottom: 1px solid #333;
                    display: flex; justify-content: space-between; align-items: center;
                    background: #1a1a1a; border-radius: 12px 12px 0 0;
                }
                .legal-header h2 { margin: 0; font-size: 20px; color: #fff; letter-spacing: 1px; }
                .close-btn { background: none; border: none; color: #888; font-size: 28px; cursor: pointer; transition: 0.2s; }
                .close-btn:hover { color: #fff; }

                .legal-scroll-area {
                    padding: 30px; overflow-y: auto; line-height: 1.6; font-size: 15px;
                }
                .legal-scroll-area h3 { color: #F5821F; margin-top: 25px; margin-bottom: 10px; font-size: 18px; }
                .legal-scroll-area ul { padding-left: 20px; margin-bottom: 15px; }
                .legal-scroll-area li { margin-bottom: 8px; color: #ccc; }
                .legal-scroll-area p { margin-bottom: 15px; text-align: justify; }
                .legal-scroll-area strong { color: #fff; }

                 .highlight-box {
                    background: rgba(245, 130, 31, 0.1); border-left: 4px solid #F5821F;
                    padding: 15px; margin: 20px 0; font-style: italic; color: #fff;
                 }
                
                .legal-footer {
                    padding: 20px; border-top: 1px solid #333; text-align: right; background: #1a1a1a; border-radius: 0 0 12px 12px;
                }
                .btn-accept {
                    background: linear-gradient(135deg, #E5720F, #F5821F);
                    border: none; color: white; padding: 10px 25px; border-radius: 6px;
                    font-weight: 600; cursor: pointer; transition: 0.3s;
                }
                .btn-accept:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(245, 130, 31, 0.3); }

                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

                /* Footer CSS provided in previous step... */
                .footer {
                    background-color: #000000;
                    color: #e0e0e0;
                    padding: 80px 20px 30px;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                    font-family: 'Inter', sans-serif;
                    position: relative;
                    overflow: hidden;
                }

                /* Subtle ambient glow */
                .footer::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 50%;
                    transform: translateX(-50%);
                    width: 100%; height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(245, 130, 31, 0.5), transparent);
                }

                .footer-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 60px;
                    justify-content: space-between;
                }

                /* Brand Section */
                .footer-brand {
                    flex: 1;
                    min-width: 280px;
                }
                .brand-logo {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 20px;
                }
                .footer-logo-img {
                    height: 40px;
                    width: auto;
                }
                .brand-text {
                    font-size: 24px;
                    font-weight: 700;
                    background: linear-gradient(135deg, #fff 0%, #aaa 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .brand-desc {
                    color: #888;
                    line-height: 1.6;
                    font-size: 14px;
                    max-width: 300px;
                }

                /* Links Grid */
                .footer-links-grid {
                    flex: 2;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 40px;
                    justify-content: flex-end;
                }

                .footer-column {
                    min-width: 180px;
                }

                .footer-column h4 {
                    color: #fff;
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 20px;
                    position: relative;
                    display: inline-block;
                }
                /* Orange underline using user's gradient preference */
                .footer-column h4::after {
                    content: '';
                    display: block;
                    width: 30px;
                    height: 3px;
                    background: linear-gradient(90deg, #E5720F, #F5821F);
                    margin-top: 8px;
                    border-radius: 2px;
                }

                .footer-column ul {
                    list-style: none;
                    padding: 0;
                }
                .footer-column ul li {
                    margin-bottom: 12px;
                }
                .footer-column ul li a {
                    color: #999;
                    text-decoration: none;
                    font-size: 14px;
                    transition: all 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                }
                
                .footer-column ul li a:hover {
                    color: #F5821F;
                    transform: translateX(5px);
                }

                /* Bottom Bar */
                .footer-bottom {
                    max-width: 1200px;
                    margin: 60px auto 0;
                    padding-top: 30px;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 20px;
                    font-size: 13px;
                    color: #666;
                }

                @media (max-width: 768px) {
                    .footer-container {
                        flex-direction: column;
                        gap: 40px;
                    }
                    .footer-links-grid {
                        justify-content: flex-start;
                    }
                    .footer-bottom {
                        flex-direction: column;
                        text-align: center;
                    }
                }
            `}</style>
        </>
    );
}

export default Footer;
