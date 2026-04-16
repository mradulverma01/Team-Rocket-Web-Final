const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

console.log('Starting WhatsApp authentication...');
console.log('This will open a browser window for you to scan the QR code');
console.log('Make sure you have a display server running (X11, Wayland, etc.)');

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
            '--disable-gpu'
        ]
    },
});

client.on('qr', (qr) => {
    console.log('\n==========================================');
    console.log('QR Code received, scan it with your WhatsApp:');
    console.log('==========================================\n');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('\n==========================================');
    console.log('Client is ready!');
    console.log('WhatsApp number:', client.info.wid.user);
    console.log('Session saved to .wwebjs_auth folder');
    console.log('==========================================\n');
    
    // Send a test message
    client.sendMessage(client.info.wid._serialized, '✅ RRDCH WhatsApp integration is working! You can now send appointment confirmations via WhatsApp.');
    console.log('Test message sent to your WhatsApp number');
    
    // Keep the client running for testing
    console.log('Press Ctrl+C to exit');
});

client.on('message', msg => {
    console.log('Message received:', msg.from, msg.body);
});

client.on('error', (error) => {
    console.error('Client error:', error);
});

client.on('disconnected', (reason) => {
    console.log('Client disconnected:', reason);
});

try {
    client.initialize();
} catch (error) {
    console.error('Failed to initialize client:', error);
    console.error('Make sure you have a display server running');
    process.exit(1);
}
