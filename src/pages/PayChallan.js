import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './PayChallan.css';

const PayChallan = () => {
    const location = useLocation();
    const {
        challanNo = "",
        vehicleNo = "",
        violation = "---",
        amount = 0
    } = location.state || {};

    const [searchId, setSearchId] = useState(challanNo || vehicleNo || "");
    const [challanDetails, setChallanDetails] = useState({
        challanNo: challanNo || "---",
        vehicleNo: vehicleNo || "---",
        violation: violation || "---",
        amount: amount || 0,
        owner: "---",
        date: "---",
        location: "---",
        image: null
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null);

    const handleSearch = useCallback(async (idToSearch) => {
        const id = idToSearch || searchId;
        if (!id) return;
        setIsProcessing(true);
        setPaymentStatus(null);
        try {
            let url = "";
            if (id.toUpperCase().startsWith("ECH-")) {
                url = `http://localhost:5000/api/challan/${id.toUpperCase()}`;
            } else {
                url = `http://localhost:5000/api/challans/search_vehicle/${id.toUpperCase()}`;
            }

            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();

                if (Array.isArray(data)) {
                    if (data.length > 0) {
                        const latest = data[0];
                        setChallanDetails({
                            challanNo: latest.challan_id,
                            vehicleNo: latest.plate_number,
                            violation: latest.violation_type,
                            amount: latest.fine_amount,
                            owner: latest.owner_name || "---",
                            date: latest.issue_timestamp || "---",
                            location: latest.location || "Delhi Zone 04",
                            image: latest.proof_image_path
                        });
                    } else {
                        // If we searched specifically by vehicle number and found nothing
                        if (!id.toUpperCase().startsWith("ECH-")) {
                            alert("No pending challans found for this vehicle.");
                        }
                    }
                } else {
                    setChallanDetails({
                        challanNo: data.challan_id,
                        vehicleNo: data.plate_number,
                        violation: data.violation_type,
                        amount: data.fine_amount,
                        owner: data.owner_name || "---",
                        date: data.issue_timestamp || "---",
                        location: data.location || "Delhi Zone 04",
                        image: data.proof_image_path
                    });
                }
            } else {
                if (!idToSearch) alert("No records found. Please verify the ID or Vehicle Number.");
            }
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setIsProcessing(false);
        }
    }, [searchId]);

    useEffect(() => {
        if (challanNo || vehicleNo) {
            handleSearch(challanNo || vehicleNo);
        }
    }, [challanNo, vehicleNo, handleSearch]);

    const [showModal, setShowModal] = useState(false);
    const [cardDetails, setCardDetails] = useState({ number: '', name: '', expiry: '', cvv: '' });
    const [showReceipt, setShowReceipt] = useState(false);
    const [transactionId, setTransactionId] = useState('');

    const handleDummyPayment = (e) => {
        e.preventDefault();
        setIsProcessing(true);
        // Simulate processing delay
        setTimeout(() => {
            setIsProcessing(false);
            setPaymentStatus('success');
            setTransactionId(Math.random().toString(36).substr(2, 9).toUpperCase());
            setShowModal(false);
            fetch(`http://localhost:5000/api/pay_challan/${challanDetails.challanNo}`, { method: 'POST' }).catch(err => console.log('Mock API call failed', err));
        }, 2000);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCardDetails(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="payment-page">
            <Header />

            <div className="payment-container animate-fade-up">

                {/* Search Bar Section */}
                <div className="search-section glass-card">
                    <h2 className="highlight-orange">CHECK CHALLAN STATUS</h2>
                    <p style={{ marginBottom: '20px', opacity: 0.7 }}>Enter your E-Challan ID (ECH-XXXX) or Vehicle Number (e.g., DL01AB1234) to proceed.</p>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        <input
                            type="text"
                            placeholder="ECH-XXXX or DL01AB1234"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            style={{
                                flex: 1, padding: '15px', background: 'var(--bg-tertiary)',
                                border: '1px solid var(--glass-border)', borderRadius: '12px',
                                color: '#fff', fontSize: '1rem', textTransform: 'uppercase'
                            }}
                        />
                        <button onClick={() => handleSearch()} className="btn-premium btn-primary">
                            Search Records
                        </button>
                    </div>
                </div>

                <div className="payment-layout">
                    {/* Summary Section */}
                    <div className="summary-card glass-card">
                        <div style={{ marginBottom: '30px' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>ORDER <span className="highlight-orange">SUMMARY</span></h2>
                            <p style={{ opacity: 0.6 }}>Official Enforcement Record</p>
                        </div>

                        <div className="detail-row">
                            <span>Challan ID:</span>
                            <span style={{ fontWeight: 'bold' }}>{challanDetails.challanNo}</span>
                        </div>
                        <div className="detail-row">
                            <span>Vehicle Number:</span>
                            <span style={{ fontWeight: 'bold', color: 'var(--accent-orange)' }}>{challanDetails.vehicleNo}</span>
                        </div>
                        <div className="detail-row">
                            <span>Owner Name:</span>
                            <span>{challanDetails.owner}</span>
                        </div>
                        <div className="detail-row">
                            <span>Issue Date:</span>
                            <span>{challanDetails.date}</span>
                        </div>
                        <div className="detail-row">
                            <span>Location:</span>
                            <span>{challanDetails.location}</span>
                        </div>
                        <div className="detail-row">
                            <span>Violations:</span>
                            <span style={{ textAlign: 'right', display: 'block', fontSize: '0.9rem' }}>{challanDetails.violation}</span>
                        </div>

                        {challanDetails.image && (
                            <div style={{ marginTop: '20px' }}>
                                <p style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '8px' }}>Visual Evidence:</p>
                                <img
                                    src={`http://localhost:5000${challanDetails.image}`}
                                    alt="Challan Evidence"
                                    style={{ width: '100%', borderRadius: '8px', border: '1px solid var(--glass-border)' }}
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            </div>
                        )}

                        <div className="total-amount detail-row" style={{ border: 'none', marginTop: '20px', paddingTop: '20px', borderTop: '1px dashed var(--glass-border)' }}>
                            <span>Total Fine:</span>
                            <span style={{ fontSize: '1.5rem', color: 'var(--accent-orange)' }}>₹{challanDetails.amount.toLocaleString()}</span>
                        </div>

                        <div style={{ marginTop: '30px', padding: '15px', background: 'rgba(245, 130, 31, 0.1)', borderRadius: '10px', borderLeft: '4px solid var(--accent-orange)' }}>
                            <p style={{ fontSize: '0.85rem', color: 'var(--accent-orange)' }}>
                                ⚠️ Document verification fee inclusive of GST. Once paid, the record will be updated in the M-Parivahan database within 24 hours.
                            </p>
                        </div>
                    </div>

                    {/* Gateway Section */}
                    <div className="gateway-card glass-card" style={{ display: 'flex', flexDirection: 'column', height: 'fit-content', alignSelf: 'flex-start' }}>
                        {paymentStatus === 'success' ? (
                            <div className="payment-status-card">
                                <div className="success-icon-large">✓</div>
                                <h2>TRANSACTION SUCCESSFUL</h2>
                                <p style={{ opacity: 0.7, margin: '15px 0' }}>
                                    Transaction ID: {transactionId}
                                </p>
                                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px', flexWrap: 'wrap' }}>
                                    <button onClick={() => setShowReceipt(true)} className="btn-premium btn-primary">
                                        📄 View Official Receipt
                                    </button>
                                    <button onClick={() => window.location.href = '/'} className="btn-premium btn-secondary">
                                        Dashboard
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="payment-form-inline">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <div style={{
                                        width: '40px', height: '40px', background: 'linear-gradient(135deg, #F5821F, #ff6b6b)',
                                        borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 5px 15px rgba(245, 130, 31, 0.3)'
                                    }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="2" y="5" width="20" height="14" rx="2" />
                                            <line x1="2" y1="10" x2="22" y2="10" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1rem' }}>CyberTreasury Gateway</h3>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--accent-orange)', fontWeight: '600', letterSpacing: '0.5px' }}>OFFICIAL PARTNER</span>
                                    </div>
                                </div>

                                <form onSubmit={handleDummyPayment}>
                                    <div className="form-group" style={{ marginBottom: '10px' }}>
                                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: '#ccc' }}>Card Number</label>
                                        <input
                                            type="text"
                                            name="number"
                                            value={cardDetails.number}
                                            onChange={handleInputChange}
                                            placeholder="XXXX XXXX XXXX XXXX"
                                            maxLength="19"
                                            style={{
                                                width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)',
                                                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white',
                                                fontSize: '0.95rem', letterSpacing: '1px'
                                            }}
                                            required
                                        />
                                    </div>

                                    <div className="form-group" style={{ marginBottom: '10px' }}>
                                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: '#ccc' }}>Cardholder Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={cardDetails.name}
                                            onChange={handleInputChange}
                                            placeholder="Name on Card"
                                            style={{
                                                width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)',
                                                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white',
                                                fontSize: '0.95rem'
                                            }}
                                            required
                                        />
                                    </div>

                                    <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: '#ccc' }}>Expiry Date</label>
                                            <input
                                                type="text"
                                                name="expiry"
                                                placeholder="MM/YY"
                                                maxLength="5"
                                                style={{
                                                    width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)',
                                                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white',
                                                    fontSize: '0.95rem', textAlign: 'center'
                                                }}
                                                required
                                            />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: '#ccc' }}>CVV</label>
                                            <input
                                                type="password"
                                                name="cvv"
                                                placeholder="123"
                                                maxLength="3"
                                                style={{
                                                    width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)',
                                                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white',
                                                    fontSize: '0.95rem', textAlign: 'center'
                                                }}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn-premium btn-primary"
                                        style={{ width: '100%', padding: '12px', position: 'relative', fontSize: '1rem', letterSpacing: '1px' }}
                                        disabled={isProcessing || challanDetails.amount === 0}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <span className="loader-spinner"></span> PROCESSING...
                                            </>
                                        ) : `PAY ₹${challanDetails.amount.toLocaleString()} NOW`}
                                    </button>
                                </form>

                                <div style={{ textAlign: 'center', marginTop: '15px', opacity: 0.5 }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                                        <img src="https://cdn-icons-png.flaticon.com/512/196/196566.png" height="18" alt="Visa" style={{ filter: 'grayscale(1)' }} />
                                        <img src="https://cdn-icons-png.flaticon.com/512/196/196561.png" height="18" alt="Mastercard" style={{ filter: 'grayscale(1)' }} />
                                        <img src="https://cdn-icons-png.flaticon.com/512/196/196539.png" height="18" alt="Amex" style={{ filter: 'grayscale(1)' }} />
                                    </div>
                                    <span style={{ fontSize: '0.65rem' }}>🔒 Secured with 256-bit SSL Encryption</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>


            {/* RECEIPT POPUP MODAL */}
            {showReceipt && (
                <div className="modal-overlay" onClick={() => setShowReceipt(false)}>
                    <div className="receipt-modal" onClick={e => e.stopPropagation()}>
                        <div className="receipt-header">
                            <h3>OFFICIAL RECEIPT</h3>
                            <button className="close-btn" onClick={() => setShowReceipt(false)}>&times;</button>
                        </div>
                        <div className="receipt-body" id="receipt-content">
                            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#000' }}>SUCCESS</div>
                                <div style={{ color: 'green', fontSize: '14px' }}>Payment Verified</div>
                            </div>

                            <div className="receipt-row"><span>Receipt No:</span> <strong>R-{transactionId}</strong></div>
                            <div className="receipt-row"><span>Date:</span> <strong>{new Date().toLocaleString()}</strong></div>
                            <div className="receipt-row"><span>Challan ID:</span> <strong>{challanDetails.challanNo}</strong></div>
                            <div className="receipt-row"><span>Vehicle No:</span> <strong>{challanDetails.vehicleNo}</strong></div>
                            <div className="receipt-row" style={{ marginTop: '10px', borderTop: '1px dashed #ccc', paddingTop: '10px' }}>
                                <span>Amount Paid:</span> <strong style={{ fontSize: '18px' }}>₹{challanDetails.amount}</strong>
                            </div>
                        </div>
                        <div className="receipt-footer">
                            <button className="btn-print" onClick={() => window.print()}>🖨 Print / PDF</button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />

            <style>{`
                .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(5px); z-index: 9999; display: flex; align-items: center; justify-content: center; }
                .payment-modal { width: 100%; max-width: 450px; background: #121217; padding: 25px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); }
                .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                
                .loader-spinner {
                    width: 16px; height: 16px; border: 2px solid #fff; border-bottom-color: transparent; border-radius: 50%; display: inline-block; animation: rotation 1s linear infinite; margin-right: 8px;
                }
                @keyframes rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

                /* Receipt Styles */
                .receipt-modal { background: #fff; color: #000; padding: 0; width: 350px; border-radius: 12px; overflow: hidden; }
                .receipt-header { background: #eee; padding: 15px; display: flex; justify-content: space-between; align-items: center; }
                .receipt-header h3 { margin: 0; font-size: 16px; }
                .receipt-body { padding: 25px; font-family: 'Courier New', monospace; }
                .receipt-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
                .receipt-footer { padding: 15px; background: #f9f9f9; text-align: center; border-top: 1px solid #eee; }
                .btn-print { background: #000; color: #fff; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold; width: 100%; }

                .success-icon-large { font-size: 50px; color: #00e676; margin-bottom: 20px; text-shadow: 0 0 20px rgba(0,230,118,0.5); }
            `}</style>
        </div>
    );
};

export default PayChallan;
