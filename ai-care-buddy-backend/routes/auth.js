const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// Generate Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d',
    });
};

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, emergencyContactName, emergencyContactPhone, emergencyContactEmail, mobile, bloodGroup } = req.body;
        console.log(`[AUTH] Registration attempt for email: ${email}`);

        let user = await User.findOne({ email });
        if (user) {
            console.warn(`[AUTH] Registration failed: User ${email} already exists.`);
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUserData = { name, email, password, mobile, bloodGroup };

        // Require emergency contact details including email for the Nodemailer SOS feature
        if (!emergencyContactName || !emergencyContactPhone || !emergencyContactEmail) {
            return res.status(400).json({ message: 'Emergency Contact Name, Phone, and Email are strictly required.' });
        }

        newUserData.emergencyContacts = [{
            name: emergencyContactName,
            phone: emergencyContactPhone,
            email: emergencyContactEmail
        }];

        user = await User.create(newUserData);

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/auth/forgot-password
// @desc    Mock forgot password endpoint
router.post('/forgot-password', async (req, res) => {
    try {
        const { email, mobile } = req.body;

        if (!email || !mobile) {
            return res.status(400).json({ message: 'Both Email and Mobile Number are required.' });
        }

        const user = await User.findOne({ email, mobile });

        if (!user) return res.status(404).json({ message: 'No account found matching this email and phone number combination.' });

        // Real Email Dispatch via Vercel Proxy
        if (process.env.JWT_SECRET) {
            try {
                const html = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                        <div style="background: #1f6feb; padding: 20px; text-align: center; color: white;">
                            <h2>AI Care Buddy Security</h2>
                        </div>
                        <div style="padding: 20px; background: #f9f9f9; color: #333;">
                            <p>Hello <b>${user.name}</b>,</p>
                            <p>We have successfully verified your identity for phone number ending in ${mobile.slice(-4)}.</p>
                            <p>Please return to the application to enter your new password securely. If you did not request this reset, please contact support immediately.</p>
                            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                            <p style="font-size: 12px; color: #777; text-align: center;">This is an automated security email. Do not reply.</p>
                        </div>
                    </div>
                `;

                const axios = require('axios');
                await axios.post('https://sudarshan-ai-care-buddy.vercel.app/api/sendEmail', {
                    secret: process.env.JWT_SECRET,
                    to: user.email,
                    subject: 'AI Care Buddy - Password Reset Verification',
                    html
                });
                console.log(`[AUTH] Authentic Password Reset email sent to ${user.email} via Vercel Proxy`);
            } catch (mailError) {
                console.error("[AUTH] Vercel Email Proxy Error:", mailError.response?.data || mailError.message);
                // Return anyway so the frontend can still proceed to step 2 visually,
                // but log the explicit failure if the keys are wrong.
            }
        } else {
            console.log(`[AUTH] Mock Email Sent: Missing JWT_SECRET in .env. Proceeding to Step 2.`);
        }

        res.json({ message: 'Verified. Proceed to reset password.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/auth/reset-password
// @desc    Update password after verification
router.post('/reset-password', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and new password are required.' });
        }

        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: 'User not found' });

        user.password = password;

        await user.save();

        res.json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
