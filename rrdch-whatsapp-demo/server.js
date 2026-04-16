const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Client } = require('whatsapp-web.js');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// WhatsApp client configuration
const client = new Client({
    puppeteer: {
        headless: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu',
            '--disable-extensions',
            '--disable-default-apps'
        ]
    },
});

let isReady = false;

// Client events
client.on('ready', () => {
    isReady = true;
    console.log('WhatsApp client is ready!');
});

client.on('error', (error) => {
    console.error('WhatsApp client error:', error);
});

client.on('disconnected', (reason) => {
    isReady = false;
    console.log('WhatsApp client disconnected:', reason);
});

// Initialize WhatsApp client
client.initialize();

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        whatsappReady: isReady 
    });
});

/**
 * Send appointment confirmation WhatsApp message
 * POST /api/send-appointment-confirmation
 * Body: {
 *   phoneNumber: string (e.g., "919019560159"),
 *   patientName: string,
 *   date: string,
 *   timeSlot: string,
 *   department: string,
 *   doctorName: string,
 *   locationLink: string
 * }
 */
app.post('/api/send-appointment-confirmation', async (req, res) => {
    try {
        const { phoneNumber, patientName, date, timeSlot, department, doctorName, locationLink } = req.body;
        
        if (!phoneNumber || !date || !timeSlot) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const message = `✅ *Appointment Confirmed*

Dear ${patientName || 'Patient'},

Your appointment has been successfully booked!

📅 Date: ${date}
⏰ Time: ${timeSlot}
🏥 Department: ${department || 'General'}
👨‍⚕️ Doctor: ${doctorName || 'To be assigned'}

📍 Location: ${locationLink || 'https://maps.google.com/?q=Rajarajeshwari+Dental+College+Hospital'}

Please arrive 15 minutes before your appointment time.

Thank you for choosing RRDCH!

---
Rajarajeshwari Dental College & Hospital`;

        if (!isReady) {
            return res.status(503).json({ error: 'WhatsApp client not ready' });
        }

        const chatId = `${phoneNumber}@c.us`;
        await client.sendMessage(chatId, message);
        
        console.log(`Appointment confirmation sent to ${phoneNumber}`);
        res.json({ success: true, message: 'Appointment confirmation sent' });
    } catch (error) {
        console.error('Error sending appointment confirmation:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

/**
 * Send appointment reminder WhatsApp message
 * POST /api/send-appointment-reminder
 */
app.post('/api/send-appointment-reminder', async (req, res) => {
    try {
        const { phoneNumber, patientName, date, timeSlot, department } = req.body;
        
        if (!phoneNumber || !date || !timeSlot) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const message = `🔔 *Appointment Reminder*

Dear ${patientName || 'Patient'},

This is a reminder about your upcoming appointment:

📅 Date: ${date}
⏰ Time: ${timeSlot}
🏥 Department: ${department || 'General'}

Please arrive 15 minutes before your appointment time.

Thank you!
---
Rajarajeshwari Dental College & Hospital`;

        if (!isReady) {
            return res.status(503).json({ error: 'WhatsApp client not ready' });
        }

        const chatId = `${phoneNumber}@c.us`;
        await client.sendMessage(chatId, message);
        
        console.log(`Appointment reminder sent to ${phoneNumber}`);
        res.json({ success: true, message: 'Appointment reminder sent' });
    } catch (error) {
        console.error('Error sending appointment reminder:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

/**
 * Send lab report notification WhatsApp message
 * POST /api/send-lab-report-notification
 */
app.post('/api/send-lab-report-notification', async (req, res) => {
    try {
        const { phoneNumber, patientName, reportType } = req.body;
        
        if (!phoneNumber || !reportType) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const message = `📋 *${reportType} Available*

Dear ${patientName || 'Patient'},

Your ${reportType} is now available. The report has been sent to your registered email address.

Please check your email to download the report.

Thank you!
---
Rajarajeshwari Dental College & Hospital`;

        if (!isReady) {
            return res.status(503).json({ error: 'WhatsApp client not ready' });
        }

        const chatId = `${phoneNumber}@c.us`;
        await client.sendMessage(chatId, message);
        
        console.log(`Lab report notification sent to ${phoneNumber}`);
        res.json({ success: true, message: 'Lab report notification sent' });
    } catch (error) {
        console.error('Error sending lab report notification:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`WhatsApp API server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Send appointment confirmation: POST http://localhost:${PORT}/api/send-appointment-confirmation`);
});
