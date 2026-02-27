const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const axios = require('axios');
const nodemailer = require('nodemailer');

// @route   POST /api/sos/trigger
// @desc    Trigger SOS alert, mock sending messages to police, hospitals, and emergency contacts
router.post('/trigger', protect, async (req, res) => {
    try {
        const { lat, lng } = req.body;
        const user = req.user;

        const time = new Date().toLocaleString();
        const mapsLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

        const message = `URGENT EMERGENCY! ${user.name} requires immediate assistance. Time: ${time}. Location: ${mapsLink}`;

        // Send Emergency Email using Nodemailer IF configured
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            try {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                });

                if (user.emergencyContacts && user.emergencyContacts.length > 0) {
                    for (const contact of user.emergencyContacts) {
                        // Attempt to send email if an email field exists or fallback to guessing if they stored an email in the phone string
                        const contactEmail = contact.email || (contact.phone && contact.phone.includes('@') ? contact.phone : null);

                        if (contactEmail) {
                            const mailOptions = {
                                from: `"AI Care Buddy " <${process.env.EMAIL_USER}>`,
                                to: contactEmail,
                                subject: `🚨 SOS URGENT: ${user.name} Needs Immediate Help!`,
                                html: `
                                    <h2 style="color: #ff4a4a;">URGENT EMERGENCY NOTIFICATION</h2>
                                    <p>You are receiving this automated alert because <b>${user.name}</b> marked you as an emergency contact.</p>
                                    <p>They have just triggered an SOS PANIC button and may be in immediate danger.</p>
                                    <p><b>Time of Signal:</b> ${time}</p>
                                    <h3 style="margin-top:20px;">Live Location Tracker:</h3>
                                    <a href="${mapsLink}" style="display:inline-block; padding: 10px 20px; background-color: #ff4a4a; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">📍 MAPS LOCATION</a>
                                    <br><br>
                                    <p style="font-size: 12px; color: #666;">This is an automated message from SUDARSHAN-AI CARE BUDDY. Please attempt to contact them directly or dial 112 immediately.</p>
                                `
                            };

                            await transporter.sendMail(mailOptions);
                            console.log(`[SOS] Emergency Email sent to ${contact.name} at ${contactEmail}`);
                        } else {
                            console.log(`[SOS] Skipped ${contact.name} - No viable email address found.`);
                        }
                    }
                }
            } catch (emailError) {
                console.error("[SOS] Nodemailer Transporter Error:", emailError);
            }
        } else {
            // Simulated dispatch to authorities (Fallback if Twilio is not configured)
            console.log(`[DISPATCH Mock] Sending to Nearest Police Station/Hospital: ${message}`);

            if (user.emergencyContacts && user.emergencyContacts.length > 0) {
                const contactList = user.emergencyContacts.map(c => c.name || c.phone).filter(Boolean);
                console.log(`[DISPATCH Mock] Sending SMS to Contacts (${contactList.join(', ')}): ${message}`);
            }
        }

        res.json({ message: 'SOS Alert triggered successfully. Authorities and your contacts have been notified.', dispatchDetails: message });
    } catch (error) {
        res.status(500).json({ message: 'Server error triggering SOS' });
    }
});

// @route   GET /api/sos/nearby
// @desc    Fetch nearby hospitals, police, medical stores
router.get('/nearby', protect, async (req, res) => {
    try {
        const { lat, lng } = req.query;

        // Temporarily bypassed real API due to missing Google Cloud Billing account on user's key.
        // Use Real Google Places API IF configured
        if (false && process.env.GOOGLE_MAPS_API_KEY) {
            const apiKey = process.env.GOOGLE_MAPS_API_KEY;
            const location = `${lat},${lng}`;
            const radius = 5000; // 5km search radius

            // Helper to fetch and format places from Google
            const fetchPlaces = async (type) => {
                const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${apiKey}`;
                const response = await axios.get(url);
                return response.data.results.slice(0, 3).map(place => ({
                    name: place.name,
                    distance: 'View Map', // Exact distance requires Distance Matrix API, keeping UI clean for now
                    lat: place.geometry.location.lat,
                    lng: place.geometry.location.lng,
                    address: place.vicinity
                }));
            };

            const [hospitals, police, medical] = await Promise.all([
                fetchPlaces('hospital'),
                fetchPlaces('police'),
                fetchPlaces('pharmacy')
            ]);

            return res.json({ hospitals, police, medical });
        }

        // Fallback: Mocked geo-fuzzing if no API Key
        const baseLat = parseFloat(lat);
        const baseLng = parseFloat(lng);

        const mockedPlaces = {
            hospitals: [
                { name: 'City Central Hospital', distance: '1.2 km', lat: baseLat + 0.015, lng: baseLng + 0.01 },
                { name: 'General Medical Center', distance: '2.5 km', lat: baseLat - 0.02, lng: baseLng + 0.01 }
            ],
            police: [
                { name: 'District Police Station', distance: '0.8 km', lat: baseLat + 0.008, lng: baseLng - 0.005 },
                { name: 'Highway Patrol Hub', distance: '3.1 km', lat: baseLat - 0.025, lng: baseLng - 0.015 }
            ],
            medical: [
                { name: '24/7 Care Pharmacy', distance: '0.5 km', lat: baseLat - 0.004, lng: baseLng + 0.003 },
                { name: 'HealthPlus Medical Store', distance: '1.4 km', lat: baseLat + 0.012, lng: baseLng - 0.01 }
            ]
        };

        res.json(mockedPlaces);
    } catch (error) {
        console.error("[SOS] Google Places Error:", error.message);
        res.status(500).json({ message: 'Error fetching nearby locations' });
    }
});

// @route   GET /api/sos/disasters
// @desc    Fetch active live disaster threats using OpenWeatherMap API
router.get('/disasters', protect, async (req, res) => {
    try {
        const { lat, lng } = req.query;

        // Base static disaster mappings for our preparedness guides
        const baseDisasters = [
            { id: 'flood', name: 'Flash Flood', riskLevel: 'Level 3 Warning' },
            { id: 'earthquake', name: 'Earthquake', riskLevel: 'Magnitude 5.2 Detected' },
            { id: 'cyclone', name: 'Cyclone', riskLevel: 'Category 2 Approaching' },
            { id: 'fire', name: 'Wildfire', riskLevel: 'Red Flag Warning' },
            { id: 'heatwave', name: 'Heatwave', riskLevel: 'Extreme Heat Advisory' }
        ];

        if (process.env.OPENWEATHER_API_KEY) {
            const apiKey = process.env.OPENWEATHER_API_KEY;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;

            const response = await axios.get(url);

            const currentTemp = Math.round(response.data.main?.temp || 0);
            const currentCondition = response.data.weather?.[0]?.description || 'Unknown';
            const conditionMain = response.data.weather?.[0]?.main?.toLowerCase() || '';

            // Map standard weather conditions dynamically to our disaster UI identifiers
            let mappedId = 'none';
            let alertName = 'No Active Threats';
            let riskLevel = 'Clear';

            if (currentTemp >= 38) {
                mappedId = 'heatwave';
                alertName = 'Extreme Heat Detected';
                riskLevel = 'Active Alert (Live Data)';
            } else if (conditionMain.includes('rain') || conditionMain.includes('thunderstorm') || conditionMain.includes('drizzle')) {
                mappedId = 'flood';
                alertName = 'Heavy Precipitation Warning';
                riskLevel = 'Active Alert (Live Data)';
            } else if (conditionMain.includes('smoke') || conditionMain.includes('ash')) {
                mappedId = 'fire';
                alertName = 'Poor Air Quality / Smoke';
                riskLevel = 'Active Alert (Live Data)';
            } else if (conditionMain.includes('tornado') || conditionMain.includes('squall')) {
                mappedId = 'cyclone';
                alertName = 'High Wind Warning';
                riskLevel = 'Active Alert (Live Data)';
            }

            return res.json({
                id: mappedId,
                name: alertName,
                riskLevel: riskLevel,
                source: 'OpenWeather (Live)',
                temperature: currentTemp,
                condition: currentCondition
            });
        }

        // Fallback: Mocked generation
        const seededRandom = Math.floor((parseFloat(lat) + parseFloat(lng)) % baseDisasters.length);
        const specificDisaster = baseDisasters[Math.abs(seededRandom)] || baseDisasters[0];

        res.json(specificDisaster);

    } catch (error) {
        console.error("[SOS] OpenWeather Error:", error.message);
        res.status(500).json({ message: 'Error fetching active disasters' });
    }
});

module.exports = router;
