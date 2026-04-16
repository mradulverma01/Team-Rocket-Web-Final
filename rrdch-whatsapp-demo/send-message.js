const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// WhatsApp client configuration
const client = new Client({
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    },
});

let isReady = false;

// Client events
client.on('qr', (qr) => {
    console.log('QR Code received. Scan it with your WhatsApp:');
    qrcode.generate(qr, { small: true });
});

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

// Initialize client
client.initialize();

/**
 * Send a WhatsApp message to a phone number
 * @param {string} phoneNumber - Phone number with country code (e.g., 919019560159)
 * @param {string} message - Message content
 * @returns {Promise<void>}
 */
async function sendWhatsAppMessage(phoneNumber, message) {
    return new Promise((resolve, reject) => {
        const checkReady = () => {
            if (isReady) {
                const chatId = `${phoneNumber}@c.us`;
                client.sendMessage(chatId, message)
                    .then(() => {
                        console.log(`Message sent to ${phoneNumber}`);
                        resolve();
                    })
                    .catch((error) => {
                        console.error(`Failed to send message to ${phoneNumber}:`, error);
                        reject(error);
                    });
            } else {
                setTimeout(checkReady, 1000);
            }
        };
        checkReady();
    });
}

/**
 * Send appointment confirmation message
 * @param {string} phoneNumber - Patient's phone number
 * @param {object} appointmentDetails - Appointment information
 */
async function sendAppointmentConfirmation(phoneNumber, appointmentDetails) {
    const message = `✅ *Appointment Confirmed*

Dear Patient,

Your appointment has been successfully booked!

📅 Date: ${appointmentDetails.date}
⏰ Time: ${appointmentDetails.timeSlot}
🏥 Department: ${appointmentDetails.department}
👨‍⚕️ Doctor: ${appointmentDetails.doctorName}

Please arrive 15 minutes before your appointment time.

Thank you for choosing RRDCH!

---
Rajarajeshwari Dental College & Hospital`;

    await sendWhatsAppMessage(phoneNumber, message);
}

/**
 * Send appointment reminder message
 * @param {string} phoneNumber - Patient's phone number
 * @param {object} appointmentDetails - Appointment information
 */
async function sendAppointmentReminder(phoneNumber, appointmentDetails) {
    const message = `🔔 *Appointment Reminder*

Dear Patient,

This is a reminder about your upcoming appointment:

📅 Date: ${appointmentDetails.date}
⏰ Time: ${appointmentDetails.timeSlot}
🏥 Department: ${appointmentDetails.department}

Please arrive 15 minutes before your appointment time.

Thank you!
---
Rajarajeshwari Dental College & Hospital`;

    await sendWhatsAppMessage(phoneNumber, message);
}

/**
 * Send lab report notification
 * @param {string} phoneNumber - Patient's phone number
 * @param {string} reportType - Type of report (e.g., "Teeth Scan", "Lab Report")
 */
async function sendLabReportNotification(phoneNumber, reportType) {
    const message = `📋 *${reportType} Available*

Dear Patient,

Your ${reportType} is now available. The report has been sent to your registered email address.

Please check your email to download the report.

Thank you!
---
Rajarajeshwari Dental College & Hospital`;

    await sendWhatsAppMessage(phoneNumber, message);
}

// Export functions for use in other scripts
module.exports = {
    client,
    sendWhatsAppMessage,
    sendAppointmentConfirmation,
    sendAppointmentReminder,
    sendLabReportNotification
};
