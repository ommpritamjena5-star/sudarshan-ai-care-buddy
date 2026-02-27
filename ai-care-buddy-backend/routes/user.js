const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   GET /api/user/profile
// @desc    Get user profile & emergency contacts
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching profile' });
    }
});

// @route   POST /api/user/contacts
// @desc    Add an emergency contact
router.post('/contacts', protect, async (req, res) => {
    try {
        const { name, phone, email } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ message: 'Name and phone are required' });
        }

        const user = await User.findById(req.user._id);
        user.emergencyContacts.push({ name, phone, email });
        await user.save();

        res.status(201).json(user.emergencyContacts);
    } catch (error) {
        console.error("Add contact error:", error);
        res.status(500).json({ message: 'Server error adding contact' });
    }
});

// @route   DELETE /api/user/contacts/:contactId
// @desc    Remove an emergency contact
router.delete('/contacts/:contactId', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        user.emergencyContacts = user.emergencyContacts.filter(
            (c) => c._id.toString() !== req.params.contactId
        );

        await user.save();

        res.json(user.emergencyContacts);
    } catch (error) {
        res.status(500).json({ message: 'Server error removing contact' });
    }
});

module.exports = router;
