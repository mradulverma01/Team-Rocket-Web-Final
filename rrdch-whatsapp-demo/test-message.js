const { sendAppointmentConfirmation, sendAppointmentReminder, sendLabReportNotification } = require('./send-message');

// Test sending an appointment confirmation
async function testAppointmentConfirmation() {
    try {
        console.log('Testing appointment confirmation...');
        await sendAppointmentConfirmation('919019560159', {
            date: '2026-04-20',
            timeSlot: '10:00 AM',
            department: 'Orthodontics',
            doctorName: 'Dr. Smith'
        });
        console.log('✅ Appointment confirmation test passed');
    } catch (error) {
        console.error('❌ Appointment confirmation test failed:', error);
    }
}

// Test sending an appointment reminder
async function testAppointmentReminder() {
    try {
        console.log('Testing appointment reminder...');
        await sendAppointmentReminder('919019560159', {
            date: '2026-04-20',
            timeSlot: '10:00 AM',
            department: 'Orthodontics'
        });
        console.log('✅ Appointment reminder test passed');
    } catch (error) {
        console.error('❌ Appointment reminder test failed:', error);
    }
}

// Test sending lab report notification
async function testLabReportNotification() {
    try {
        console.log('Testing lab report notification...');
        await sendLabReportNotification('919019560159', 'Teeth Scan');
        console.log('✅ Lab report notification test passed');
    } catch (error) {
        console.error('❌ Lab report notification test failed:', error);
    }
}

// Run all tests
async function runTests() {
    console.log('Starting WhatsApp messaging tests...\n');
    
    await testAppointmentConfirmation();
    console.log();
    
    await testAppointmentReminder();
    console.log();
    
    await testLabReportNotification();
    console.log();
    
    console.log('All tests completed!');
}

// Run the tests
runTests();
