import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';


function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Full Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Registered Email is required';
        } else if (!isValidEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.subject.trim()) {
            newErrors.subject = 'Query Type is required';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Issue description is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus('');

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            setSubmitStatus('success');
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });

            setTimeout(() => {
                setSubmitStatus('');
            }, 5000);

        } catch (error) {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="contact-page">

                <Header />

                <main className="contact-main">
                    <div className="contact-container">
                        <div className="contact-header">
                            <h1>Contact & Support</h1>
                            <div className="header-underline"></div>
                            <p className="contact-subtitle">For verification assistance, challan queries, and compliance-related support.</p>
                        </div>

                        <div className="contact-content">
                            {/* CONTACT FORM */}
                            <div className="contact-form-section">
                                <h2>Send us a Message</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="name" className="form-label">
                                            Full Name <span className="required">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className={`form-input ${errors.name ? 'error' : ''}`}
                                            placeholder="Enter your full name"
                                        />
                                        {errors.name && <span className="error-message">{errors.name}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email" className="form-label">
                                            Registered Email <span className="required">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className={`form-input ${errors.email ? 'error' : ''}`}
                                            placeholder="Enter your registered email"
                                        />
                                        {errors.email && <span className="error-message">{errors.email}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="subject" className="form-label">
                                            Query Type <span className="required">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            className={`form-input ${errors.subject ? 'error' : ''}`}
                                            placeholder="Enter query type (Verification, Challan, Technical Issue)"
                                        />
                                        {errors.subject && <span className="error-message">{errors.subject}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="message" className="form-label">
                                            Describe Your Issue <span className="required">*</span>
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            className={`form-textarea ${errors.message ? 'error' : ''}`}
                                            placeholder="Describe your issue related to vehicle verification or e-challan"
                                            rows="6"
                                        />
                                        {errors.message && <span className="error-message">{errors.message}</span>}
                                    </div>

                                    {submitStatus === 'success' && (
                                        <div className="status-message success">
                                            <span className="status-icon">✓</span>
                                            Your request has been successfully submitted. Our support team will respond within 24–48 hours.
                                        </div>
                                    )}

                                    {submitStatus === 'error' && (
                                        <div className="status-message error">
                                            <span className="status-icon">✗</span>
                                            There was an issue submitting your request. Please try again.
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="submit-button btn-premium btn-primary"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Sending...' : 'Send Message'}
                                    </button>
                                </form>
                            </div>

                            {/* CONTACT INFO */}
                            <div className="contact-side-panel">

                                <div className="contact-info-section">
                                    <h2>Official Contact & Support</h2>

                                    <div className="contact-info-item">
                                        <div className="contact-info-icon">
                                            <svg viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                            </svg>
                                        </div>
                                        <div className="contact-info-content">
                                            <h3>Project Office</h3>
                                            <p>Real-Time Doc Validator & Instant E-Challan Relay</p>
                                            <p>Bengaluru, Karnataka</p>
                                            <p>India</p>
                                        </div>
                                    </div>

                                    <div className="contact-info-item">
                                        <div className="contact-info-icon">
                                            <svg viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                            </svg>
                                        </div>
                                        <div className="contact-info-content">
                                            <h3>Email Support</h3>
                                            <p><a href="mailto:himanshupandey0410@gmail.com">himanshupandey0410@gmail.com</a></p>
                                        </div>
                                    </div>

                                    <div className="contact-info-item">
                                        <div className="contact-info-icon">
                                            <svg viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                                            </svg>
                                        </div>
                                        <div className="contact-info-content">
                                            <h3>Grievance & Policy</h3>
                                            <p>For document verification queries, compliance clarification, and technical assistance.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* DIGITAL PLATFORM INFO CARD */}
                                <div className="digital-platform-card">
                                    <h3>Digital Platform Information</h3>
                                    <p>This is a web-based academic platform designed for vehicle document verification and e-challan simulation. No physical office visit is required.</p>
                                </div>

                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
            <style>{`
        :root {
          --brand-black: #000000;
          --brand-dark-grey: #0a0a0a;
          --brand-orange: #F5821F;
          --brand-text-grey: #888;
          --brand-white: #FFFFFF;
        }

        .contact-page {
          min-height: 100vh;
          background-color: var(--brand-black);
          color: var(--brand-white);
          font-family: 'Inter', sans-serif;
        }

        .contact-main {
          padding: 80px 0 20px 0; /* Accommodate fixed header */
        }

        .contact-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .contact-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .contact-header h1 {
          color: var(--brand-white);
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
          line-height: 1.2;
          letter-spacing: -0.5px;
        }

        .header-underline {
            width: 60px;
            height: 3px;
            background: var(--brand-orange);
            margin: 0 auto 15px;
            border-radius: 2px;
        }

        .contact-subtitle {
            color: var(--brand-text-grey);
            font-size: 18px;
            max-width: 600px;
            margin: 0 auto;
        }

        .contact-content {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 40px;
          align-items: start;
        }

        /* FORM SECTION */
        .contact-form-section {
          background: var(--brand-dark-grey);
          border-radius: 16px;
          padding: 25px;
          border: 1px solid #333;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          animation: slideUp 0.5s ease-out;
        }

        .contact-form-section h2 {
            color: var(--brand-white);
            font-size: 20px;
            margin-bottom: 20px;
            font-weight: 600;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-label {
          display: block;
          color: var(--brand-text-grey);
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 6px;
        }

        .required {
          color: var(--brand-orange);
          margin-left: 2px;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 10px 12px;
          background: #111;
          border: 1px solid #333;
          border-radius: 8px;
          font-size: 14px;
          color: var(--brand-white);
          transition: all 0.3s ease;
          box-sizing: border-box;
          font-family: inherit;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: var(--brand-orange);
          box-shadow: 0 0 0 3px rgba(245, 130, 31, 0.15);
        }

        .form-input::placeholder,
        .form-textarea::placeholder {
          color: #555;
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .form-input.error,
        .form-textarea.error {
          border-color: #EF4444;
          background: rgba(239, 68, 68, 0.05);
        }

        .error-message {
          display: block;
          color: #EF4444;
          font-size: 12px;
          margin-top: 6px;
        }

        .status-message {
          display: flex;
          align-items: center;
          padding: 14px 16px;
          border-radius: 8px;
          margin-bottom: 24px;
          font-size: 14px;
          font-weight: 500;
          line-height: 1.5;
        }

        .status-message.success {
          background-color: rgba(22, 163, 74, 0.1);
          color: #22c55e;
          border: 1px solid rgba(22, 163, 74, 0.2);
        }

        .status-message.error {
          background-color: rgba(220, 38, 38, 0.1);
          color: #ef4444;
          border: 1px solid rgba(220, 38, 38, 0.2);
        }

        .status-icon {
          margin-right: 10px;
          font-weight: bold;
          font-size: 18px;
        }

        .submit-button {
          /* Inherit from global .btn-premium .btn-primary */
        }


        /* SIDE PANEL */
        .contact-side-panel {
            display: flex;
            flex-direction: column;
            gap: 30px;
        }

        .contact-info-section {
            background: #111;
            border-radius: 16px;
            padding: 25px;
            border: 1px solid #333;
            animation: slideUp 0.5s ease-out 0.1s both;
        }

        .contact-info-section h2 {
            color: var(--brand-white);
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 20px;
            border-left: 3px solid var(--brand-orange);
            padding-left: 15px;
        }

        .contact-info-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 20px;
        }

        .contact-info-item:last-child {
            margin-bottom: 0;
        }

        .contact-info-icon {
            width: 24px;
            height: 24px;
            margin-right: 20px;
            margin-top: 2px;
            color: var(--brand-orange);
        }

        .contact-info-icon svg {
             width: 100%; height: 100%;
        }

        .contact-info-content h3 {
            color: var(--brand-white);
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 5px;
        }

        .contact-info-content p {
            color: var(--brand-text-grey);
            font-size: 14px;
            line-height: 1.6;
            margin: 0;
        }

        .contact-info-content a {
            color: var(--brand-text-grey);
            text-decoration: none;
            transition: color 0.2s;
        }

        .contact-info-content a:hover {
            color: var(--brand-orange);
        }

        /* DIGITAL PLATFORM INFO CARD */
        .digital-platform-card {
            background: linear-gradient(145deg, #111, #0a0a0a);
            border: 1px dashed #444;
            border-radius: 16px;
            padding: 20px;
            text-align: center;
            animation: slideUp 0.5s ease-out 0.2s both;
        }

        .digital-platform-card h3 {
            color: var(--brand-orange);
            font-size: 16px;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .digital-platform-card p {
            font-size: 14px;
            color: #999;
            line-height: 1.6;
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* RESPONSIVE */
        @media (max-width: 900px) {
            .contact-content {
                grid-template-columns: 1fr;
            }
            .contact-side-panel {
                order: -1; /* Info shows first on mobile */
            }
        }

        @media (max-width: 480px) {
            .contact-header h1 { font-size: 28px; }
            .contact-form-section, .contact-info-section { padding: 30px 20px; }
        }

      `}</style>
        </>
    );
}

export default ContactPage;
