const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String },
    bloodGroup: { type: String },
    emergencyContacts: [{
        name: { type: String, required: true },
        phone: String,
        email: { type: String, required: true }
    }],
    lastLocation: {
        lat: Number,
        lng: Number,
        updatedAt: Date
    }
}, { timestamps: true });

// Password hashing middleware
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match password method
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
