const { Client } = require('whatsapp-web.js');

console.log('Testing WhatsApp with saved session credentials...');

// WhatsApp client configuration - will use existing session files
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

client.on('ready', () => {
    console.log('✅ WhatsApp client is ready using saved session!');
    console.log('WhatsApp number:', client.info.wid.user);
    
    // Send test message to self
    const myNumber = client.info.wid._serialized;
    console.log(`Sending test message to: ${myNumber}`);
    
    client.sendMessage(myNumber, 'HIIIIIIIIIII 123')
        .then(() => {
            console.log('✅ Test message sent successfully!');
            console.log('Message: HIIIIIIIIIII 123');
            
            // Wait a moment then exit
            setTimeout(() => {
                console.log('Exiting...');
                process.exit(0);
            }, 2000);
        })
        .catch((error) => {
            console.error('❌ Failed to send message:', error);
            process.exit(1);
        });
});

client.on('qr', (qr) => {
    console.log('❌ QR code generated - session not found or expired');
    console.log('You need to scan the QR code again');
    process.exit(1);
});

client.on('error', (error) => {
    console.error('❌ Client error:', error);
    process.exit(1);
});

client.on('disconnected', (reason) => {
    console.log('❌ Client disconnected:', reason);
    process.exit(1);
});

try {
    client.initialize();
} catch (error) {
    console.error('❌ Failed to initialize client:', error);
    process.exit(1);
}
