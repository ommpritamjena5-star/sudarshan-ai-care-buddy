const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const startRoutineCron = require('./utils/cron');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/routines', require('./routes/routine'));
app.use('/api/sos', require('./routes/sos'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/user', require('./routes/user'));

// Basic Route
app.get('/', (req, res) => {
    res.send('AI Care Buddy API is running...');
});

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai-care-buddy';

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

        // Finalize: Start the Routine Notification Email Worker
        startRoutineCron();
    })
    .catch((err) => console.log('MongoDB Connection Error: ', err));
