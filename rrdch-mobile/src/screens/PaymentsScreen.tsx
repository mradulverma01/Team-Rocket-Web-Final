import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import { convex } from '../config/convex';
import { convexApi } from '../config/convex-api';

export default function PaymentsScreen({ navigation }: any) {
  const payments = [
    {
      id: '1',
      appointmentId: 'APT-001',
      description: 'Consultation - Dr. Priya Sharma',
      amount: 500,
      status: 'paid',
      date: '10 Jan 2026',
    },
    {
      id: '2',
      appointmentId: 'APT-002',
      description: 'Consultation - Dr. Rahul Kumar',
      amount: 500,
      status: 'pending',
      date: '15 Jan 2026',
    },
    {
      id: '3',
      appointmentId: 'APT-003',
      description: 'X-Ray - Dental',
      amount: 800,
      status: 'paid',
      date: '05 Jan 2026',
    },
  ];

  const handlePay = async (paymentId: string, amount: number) => {
    if (Platform.OS === 'web') {
      Alert.alert(
        'Web not supported',
        'Razorpay is only available on native platforms.',
      );
      return;
    }

    const razorpayKey = process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID;
    if (!razorpayKey || razorpayKey === 'rzp_test_YOUR_KEY_ID_HERE') {
      Alert.alert('Error', 'Razorpay key not configured');
      return;
    }

    try {
      const options = {
        description: 'Appointment Payment',
        image: 'https://your-logo-url.com/logo.png',
        currency: 'INR',
        key: razorpayKey,
        amount: amount * 100, // Razorpay expects amount in paise
        name: 'RRDCH',
        order_id: '', // Generate order ID from backend if needed
        prefill: {
          email: 'user@example.com',
          contact: '9999999999',
          name: 'User Name',
        },
        theme: { color: '#1e3a5f' },
      };

      const result = await RazorpayCheckout.open(options);

      // Payment successful
      Alert.alert('Success', `Payment ID: ${result.razorpay_payment_id}`);
      
      // Mark payment as completed in Convex
      await convex.mutation(convexApi.appointments.markPaymentInitiated, {
        appointmentId: paymentId,
        paymentOrderId: result.razorpay_order_id,
        paymentId: result.razorpay_payment_id,
      });
    } catch (error: any) {
      // Payment failed or cancelled
      if (error.code === 0) {
        Alert.alert('Cancelled', 'Payment was cancelled');
      } else {
        Alert.alert('Error', `Payment failed: ${error.description || error.message}`);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Payments</Text>
      </View>

      {/* Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Pending</Text>
            <Text style={styles.summaryValue}>₹500</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Paid</Text>
            <Text style={styles.summaryValue}>₹1,300</Text>
          </View>
        </View>
      </View>

      {/* Payment List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transaction History</Text>
        {payments.map((payment) => (
          <View key={payment.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.description}>{payment.description}</Text>
                <Text style={styles.appointmentId}>
                  {payment.appointmentId} • {payment.date}
                </Text>
              </View>
              <Text style={styles.amount}>₹{payment.amount}</Text>
            </View>

            <View style={styles.cardFooter}>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      payment.status === 'paid' ? '#d4edda' : '#fff3cd',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        payment.status === 'paid' ? '#155724' : '#856404',
                    },
                  ]}
                >
                  {payment.status.charAt(0).toUpperCase() +
                    payment.status.slice(1)}
                </Text>
              </View>

              {payment.status === 'pending' && (
                <TouchableOpacity
                  style={styles.payButton}
                  onPress={() => handlePay(payment.id, payment.amount)}
                >
                  <Text style={styles.payButtonText}>Pay Now</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1e3a5f',
    padding: 24,
    paddingTop: 48,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  summaryCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a5f',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#eee',
  },
  section: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a5f',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e3a5f',
    marginBottom: 4,
  },
  appointmentId: {
    fontSize: 12,
    color: '#666',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#800020',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  payButton: {
    backgroundColor: '#800020',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
