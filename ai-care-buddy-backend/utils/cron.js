const cron = require('node-cron');
const mongoose = require('mongoose');
const User = require('../models/User');
const Routine = require('../models/Routine');
const nodemailer = require('nodemailer');

const startRoutineCron = () => {
    // Run every minute to check if any user routines are due Right Now.
    cron.schedule('* * * * *', async () => {
        try {
            if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
                return; // SMTP Not Configured
            }

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            // Format current time to match the 'HH:MM' string in the DB explicitly in IST (India Time)
            const now = new Date();
            const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false };
            const currentTimeStr = new Intl.DateTimeFormat('en-IN', options).format(now);

            // Find all routines scheduled for this exact minute that are NOT completed and haven't had an email sent
            const dueRoutines = await Routine.find({ time: currentTimeStr, isCompleted: false, emailReminderSent: false }).populate('user', 'name email');

            if (dueRoutines.length > 0) {
                console.log(`[CRON] Found ${dueRoutines.length} routines due at ${currentTimeStr}. Dispatching emails...`);
            }

            for (const routine of dueRoutines) {
                if (!routine.user || !routine.user.email) continue;

                const mailOptions = {
                    from: `"AI Care Buddy" <${process.env.EMAIL_USER}>`,
                    to: routine.user.email,
                    subject: `⏰ Reminder: ${routine.title}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                            <div style="background: #eab308; padding: 20px; text-align: center; color: white;">
                                <h2>Routine Reminder</h2>
                            </div>
                            <div style="padding: 20px; background: #f9f9f9; color: #333;">
                                <p>Hello <b>${routine.user.name}</b>,</p>
                                <p>This is a quick automated reminder from AI Care Buddy.</p>
                                <p>It is time for your scheduled routine:</p>
                                <h3 style="color: #eab308; text-align: center; font-size: 24px;">${routine.title}</h3>
                                <p style="text-align: center;">Scheduled at: ${routine.time}</p>
                                <br/>
                                <p>Please open the app to mark this task as completed.</p>
                                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                                <p style="font-size: 12px; color: #777; text-align: center;">Stay healthy, stay proactive.</p>
                            </div>
                        </div>
                    `
                };

                try {
                    await transporter.sendMail(mailOptions);
                    console.log(`[CRON] Email dispatched to ${routine.user.email} for routine: ${routine.title}`);
                    // Flag routine so we don't spam multiple emails within the same minute or if Cron double-fires
                    routine.emailReminderSent = true;
                    await routine.save();
                } catch (emailErr) {
                    console.error(`[CRON] Failed to send email to ${routine.user.email}`, emailErr);
                }
            }
        } catch (error) {
            console.error('[CRON] Error running routine checker:', error);
        }
    });

    console.log('[CRON] Routine execution checker initialized. Running every minute.');
};

module.exports = startRoutineCron;
