# RRDCH WhatsApp Demo

This is a separate demo project for WhatsApp Web.js integration. This should be run independently from the main website and requires a display server.

## Setup Instructions

### Prerequisites

1. **Display Server**: This requires a graphical environment with a display server (X11, Wayland, etc.)
   - Linux: Install X11 or Wayland
   - macOS: Works out of the box
   - Windows: Works out of the box

2. **Chromium/Chrome**: WhatsApp Web.js uses Puppeteer to control a browser
   - On Linux: `sudo apt-get install chromium-browser` or `sudo apt-get install google-chrome-stable`

### Installation

```bash
cd rrdch-whatsapp-demo
npm install
```

### Authentication

Run the authentication script to scan the QR code:

```bash
npm run auth
```

This will:
1. Open a browser window
2. Display a QR code in the terminal
3. Scan the QR code with your WhatsApp mobile app
4. Save the session to `.wwebjs_auth` folder
5. Send a test message to your own WhatsApp

## Usage

### Sending Messages

The demo includes a message sending utility with predefined functions for patient portal notifications:

```bash
# Test all message types
node test-message.js
```

### Available Functions

**1. Appointment Confirmation**
```javascript
const { sendAppointmentConfirmation } = require('./send-message');

await sendAppointmentConfirmation('919019560159', {
    date: '2026-04-20',
    timeSlot: '10:00 AM',
    department: 'Orthodontics',
    doctorName: 'Dr. Smith'
});
```

**2. Appointment Reminder**
```javascript
const { sendAppointmentReminder } = require('./send-message');

await sendAppointmentReminder('919019560159', {
    date: '2026-04-20',
    timeSlot: '10:00 AM',
    department: 'Orthodontics'
});
```

**3. Lab Report Notification**
```javascript
const { sendLabReportNotification } = require('./send-message');

await sendLabReportNotification('919019560159', 'Teeth Scan');
```

**4. Custom Message**
```javascript
const { sendWhatsAppMessage } = require('./send-message');

await sendWhatsAppMessage('919019560159', 'Your custom message here');
```

### Session Persistence

The session is saved in the `.wwebjs_auth` folder. This allows you to stay logged in without re-scanning the QR code. Keep these files secure as they contain your WhatsApp authentication.

### Important Notes

- **Keep this separate from the main website**: This demo requires a display server and won't work in serverless environments like Vercel
- **Security**: Don't commit the `.wwebjs_auth` folder to version control (add to .gitignore)
- **Rate limits**: WhatsApp has rate limits on message sending
- **Phone number format**: Use international format without + or spaces (e.g., 919019560159 for India)

### Running on a Server

To run this on a server (not recommended for production):

1. Use a VPS with display support (not serverless)
2. Install Xvfb for virtual display: `sudo apt-get install xvfb`
3. Run with: `xvfb-run npm run auth`

### Integration with Main Website

For the main website (rrdch), use a different approach:
1. Email OTP (Resend) - already configured
2. SMS OTP (MSG91, Twilio) - for phone verification
3. WhatsApp API services (Twilio WhatsApp, MessageBird) - for production WhatsApp messaging

This demo is for development/testing purposes only.

## API Server

The demo includes an Express API server that can send WhatsApp messages to patients from your authenticated WhatsApp number.

### Starting the API Server

```bash
npm start
```

The server will start on port 3001 (or the PORT environment variable).

### API Endpoints

**Health Check**
```
GET http://localhost:3001/health
Response: { "status": "ok", "whatsappReady": true }
```

**Send Appointment Confirmation**
```
POST http://localhost:3001/api/send-appointment-confirmation
Body: {
  "phoneNumber": "919019560159",
  "patientName": "John Doe",
  "date": "2026-04-20",
  "timeSlot": "10:00 AM",
  "department": "Orthodontics",
  "doctorName": "Dr. Smith",
  "locationLink": "https://maps.google.com/?q=Rajarajeshwari+Dental+College+Hospital"
}
Response: { "success": true, "message": "Appointment confirmation sent" }
```

**Send Appointment Reminder**
```
POST http://localhost:3001/api/send-appointment-reminder
Body: {
  "phoneNumber": "919019560159",
  "patientName": "John Doe",
  "date": "2026-04-20",
  "timeSlot": "10:00 AM",
  "department": "Orthodontics"
}
```

**Send Lab Report Notification**
```
POST http://localhost:3001/api/send-lab-report-notification
Body: {
  "phoneNumber": "919019560159",
  "patientName": "John Doe",
  "reportType": "Teeth Scan"
}
```

### Integration with Patient Portal

The main website (rrdch) can call this API to send WhatsApp messages when:
- Patient books an appointment
- Appointment reminders are sent
- Lab reports become available

Example API call from Convex:
```typescript
const response = await fetch('http://localhost:3001/api/send-appointment-confirmation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phoneNumber: patient.phone,
    patientName: patient.name,
    date: appointment.date,
    timeSlot: appointment.timeSlot,
    department: appointment.department,
    doctorName: appointment.doctorName,
    locationLink: 'https://maps.google.com/?q=Rajarajeshwari+Dental+College+Hospital'
  })
});
```

## Current Status

✅ WhatsApp authenticated successfully
- WhatsApp number: 919019560159
- Session saved to `.wwebjs_auth` folder
- API server ready to send messages to patients
