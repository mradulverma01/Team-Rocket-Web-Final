// Keep the mobile bundle free of `convex/server` imports.
const query = (name: string) => name as any;
const mutation = (name: string) => name as any;

export const convexApi = {
  users: {
    viewerProfile: query('users:viewerProfile'),
    upsertViewerProfile: mutation('users:upsertViewerProfile'),
  },
  appointments: {
    createBooking: mutation('appointments:createBooking'),
    listByPatientEmail: query('appointments:listByPatientEmail'),
    listForViewer: query('appointments:listForViewer'),
    markPaymentInitiated: mutation('appointments:markPaymentInitiated'),
    finalizeBookingConfirmation: mutation('appointments:finalizeBookingConfirmation'),
    markPaymentFailed: mutation('appointments:markPaymentFailed'),
    markConfirmationNotification: mutation('appointments:markConfirmationNotification'),
  },
  announcements: {
    list: query('announcements:list'),
  },
  complaints: {
    createComplaint: mutation('complaints:createComplaint'),
    listBySubmitter: query('complaints:listBySubmitter'),
  },
};

// Type definitions
export type AppointmentRecord = {
  _id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  department: string;
  doctorId: string;
  date: string;
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  appointmentId: string;
  notes?: string;
  amountPaise: number;
  paymentStatus: 'not_required' | 'pending' | 'paid' | 'failed' | 'refunded';
  paymentOrderId?: string;
  paymentId?: string;
  source: 'web' | 'android' | 'ios';
  createdAt: number;
  userId?: string;
  notificationStatus: 'idle' | 'pending' | 'sent' | 'skipped' | 'failed';
  confirmationSentAt?: number;
  notificationError?: string;
};

export type ViewerProfile = {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: 'patient' | 'student' | 'doctor' | 'admin';
};
