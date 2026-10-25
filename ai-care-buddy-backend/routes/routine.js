const express = require('express');
const router = express.Router();
const Routine = require('../models/Routine');
const { protect } = require('../middleware/auth');

// @route   GET /api/routines
// @desc    Get all routines for a user
router.get('/', protect, async (req, res) => {
    try {
        const routines = await Routine.find({ user: req.user._id }).sort({ time: 1 });
        res.json(routines);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching routines' });
    }
});

// @route   POST /api/routines
// @desc    Create a new routine
router.post('/', protect, async (req, res) => {
    try {
        const { title, time } = req.body;
        const routine = await Routine.create({
            user: req.user._id,
            title,
            time
        });
        res.status(201).json(routine);
    } catch (error) {
        res.status(500).json({ message: 'Server error creating routine' });
    }
});

// @route   PUT /api/routines/:id
// @desc    Update a routine (mark complete, change time, etc)
router.put('/:id', protect, async (req, res) => {
    try {
        const routine = await Routine.findById(req.params.id);
        if (!routine) return res.status(404).json({ message: 'Routine not found' });
        if (routine.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedRoutine = await Routine.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedRoutine);
    } catch (error) {
        res.status(500).json({ message: 'Server error updating routine' });
    }
});

// @route   DELETE /api/routines/:id
// @desc    Delete a routine
router.delete('/:id', protect, async (req, res) => {
    try {
        const routine = await Routine.findById(req.params.id);
        if (!routine) return res.status(404).json({ message: 'Routine not found' });
        if (routine.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await routine.deleteOne();
        res.json({ message: 'Routine removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting routine' });
    }
});

module.exports = router;
