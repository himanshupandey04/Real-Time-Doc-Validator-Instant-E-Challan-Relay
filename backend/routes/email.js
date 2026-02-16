const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Handle email sending
router.post('/send', async (req, res) => {
    const { email, challan_id, plate, violation, amount } = req.body;

    if (!email || !challan_id) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {
        // Create transporter using SMTP details from env or hardcode if needed
        // Assuming user "connected gmail smtp" which likely means environment variables
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_SERVER || 'smtp.gmail.com',
            port: process.env.MAIL_PORT || 465,
            secure: process.env.MAIL_USE_SSL === 'true',
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.MAIL_DEFAULT_SENDER || process.env.MAIL_USERNAME,
            to: email,
            subject: `E-Challan Notice: ${challan_id}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #be123c; color: white; padding: 20px; text-align: center;">
                        <h2 style="margin: 0;">Traffic Violation Notice</h2>
                    </div>
                    <div style="padding: 20px;">
                        <p>Dear Vehicle Owner,</p>
                        <p>A traffic violation has been recorded against your vehicle.</p>
                        
                        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
                            <p><strong>Challan ID:</strong> ${challan_id}</p>
                            <p><strong>Vehicle Number:</strong> ${plate}</p>
                            <p><strong>Violation Type:</strong> ${violation}</p>
                            <p style="color: #be123c; font-weight: bold;"><strong>Fine Amount:</strong> ₹${amount}</p>
                        </div>

                        <p>Please pay the fine immediately to avoid legal action.</p>
                        <p>You can view details and pay online at our portal.</p>
                    </div>
                    <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b;">
                        &copy; ${new Date().getFullYear()} Traffic Management System. All rights reserved.
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        res.json({ success: true, message: 'Email sent successfully!' });

    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ success: false, message: 'Failed to send email. Check SMTP settings.' });
    }
});

module.exports = router;
