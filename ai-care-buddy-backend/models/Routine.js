const mongoose = require('mongoose');

const RoutineSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    time: {
        type: String, // HH:mm format
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    emailReminderSent: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Routine', RoutineSchema);
