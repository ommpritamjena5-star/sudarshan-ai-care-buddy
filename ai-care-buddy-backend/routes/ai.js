const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/auth');
const { OpenAI } = require('openai');

// Setting up OpenAI SDK for GitHub Models API
const openai = new OpenAI({
    baseURL: "https://models.inference.ai.azure.com",
    apiKey: process.env.GITHUB_TOKEN
});

// Setting up AI Prompt using GPT-4o
const processAIPrompt = async (prompt, modelName = 'gpt-4o') => {
    if (!process.env.GITHUB_TOKEN) {
        console.warn("No GITHUB_TOKEN found. Using mock response.");
        return `[Mock AI Response for: ${prompt.substring(0, 30)}...]`;
    }

    try {
        const response = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a highly helpful and concise emergency assistant for users in India. If asked for emergency numbers, strictly provide Indian helplines (e.g., 112 for National Emergency, 100 for Police, 108 for Ambulance, 101 for Fire, 1091 for Women Helpline)." },
                { role: "user", content: prompt }
            ],
            model: modelName,
            temperature: 0.7,
        });
        return response.choices[0].message.content;
    } catch (error) {
        console.error("AI Gen Error:", error.message);
        return "Error generating AI response.";
    }
};

// Setup Multer for memory storage (file uploads)
const upload = multer({ storage: multer.memoryStorage() });

// @route   POST /api/ai/voice-command
// @desc    Process voice command text (speech to text comes from frontend)
router.post('/voice-command', protect, async (req, res) => {
    try {
        const { command } = req.body;

        // Setup AI prompt context
        const prompt = `
      You are an AI Care Buddy and Emergency Guidance System. 
      The user just said: "${command}"
      Provide a highly concise, helpful, and calming response. If it's a medical emergency, advise them to use the SOS button. 
      If they ask to call someone or for emergency numbers, explicitly state the correct Indian helplines (112, 100, 108, etc).
      Keep the response short because it will be read aloud by text-to-speech.
    `;

        const aiResponse = await processAIPrompt(prompt);
        res.json({ response: aiResponse });
    } catch (error) {
        res.status(500).json({ message: 'Error processing AI command' });
    }
});

// @route   POST /api/ai/scan
// @desc    Upload an MRI/X-Ray/Environment Image to get basic insights from GPT-4o Vision
router.post('/scan', protect, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No image provided' });

        if (!process.env.GITHUB_TOKEN) {
            return res.json({
                analysis: '[Mock Analysis] This scan appears to show normal bone structure with no obvious fractures. Note: This is a mock response because no API key is set. Consult a doctor for actual medical advice.'
            });
        }

        const base64Image = req.file.buffer.toString("base64");
        const mimeType = req.file.mimetype; // e.g., image/jpeg

        const prompt = "You are an AI medical assistant. Examine this image and provide a supportive, simplified explanation of any obvious anomalies. IMPORTANT DISCLAIMER: Start by stating that you are an AI and this is not professional medical advice, and the user must consult a doctor.";

        const response = await openai.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: prompt },
                        { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64Image}` } }
                    ]
                }
            ],
            model: "gpt-4o"
        });

        const analysis = response.choices[0].message.content;
        res.json({ analysis });
    } catch (error) {
        console.error("Vision AI Error:", error.message);
        res.status(500).json({ message: 'Error analyzing medical scan' });
    }
});

module.exports = router;
