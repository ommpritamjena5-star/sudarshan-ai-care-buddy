import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { secret, to, subject, html } = req.body;

    // We use JWT_SECRET as a secure handshake token between Render and Vercel
    if (secret !== process.env.JWT_SECRET) {
        return res.status(401).json({ message: 'Unauthorized Proxy Access' });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        return res.status(500).json({ message: 'Email credentials not configured on Vercel' });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"AI Care Buddy" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully via Vercel', info: info.messageId });
    } catch (error) {
        console.error("Vercel Nodemailer Error:", error);
        res.status(500).json({ message: 'Error sending email', error: error.message });
    }
}
