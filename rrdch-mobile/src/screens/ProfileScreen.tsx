import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { convex } from '../config/convex';
import { convexApi } from '../config/convex-api';

export default function ProfileScreen({ navigation }: any) {
  const { signOut } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await convex.query(convexApi.users.viewerProfile);
      setUser(profile);
      setPhoneNumber(profile?.phone || '');
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };

  const handleSavePhone = async () => {
    try {
      await convex.mutation(convexApi.users.upsertViewerProfile, {
        name: user?.name || '',
        email: user?.email || '',
        phone: phoneNumber,
        role: user?.role || 'patient',
      });
      setIsEditing(false);
      Alert.alert('Success', 'Phone number updated successfully');
      loadUserProfile();
    } catch (error) {
      console.error('Error saving phone:', error);
      Alert.alert('Error', 'Failed to update phone number');
    }
  };

  const menuItems = [
    { id: '1', title: 'Personal Information', icon: '👤' },
    { id: '2', title: 'Medical History', icon: '📋' },
    { id: '3', title: 'Payment Methods', icon: '💳' },
    { id: '4', title: 'Notifications', icon: '🔔' },
    { id: '5', title: 'Privacy Policy', icon: '🔒' },
    { id: '6', title: 'Terms of Service', icon: '📄' },
    { id: '7', title: 'Help & Support', icon: '❓' },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0)?.toUpperCase() || 'P'}
          </Text>
        </View>
        <Text style={styles.userName}>{user?.name || 'Patient Name'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'patient@example.com'}</Text>
        
        <View style={styles.phoneContainer}>
          <Text style={styles.phoneLabel}>Phone Number</Text>
          {isEditing ? (
            <View style={styles.phoneInputContainer}>
              <TextInput
                style={styles.phoneInput}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                placeholder="+91 98765 43210"
              />
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSavePhone}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.phoneDisplayContainer}>
              <Text style={styles.userPhone}>{phoneNumber || 'Not set'}</Text>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        {!phoneNumber && (
          <Text style={styles.warningText}>
            ⚠️ Phone number is required for booking appointments
          </Text>
        )}
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        {menuItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuTitle}>{item.title}</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      {/* App Version */}
      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  profileCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1e3a5f',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a5f',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  phoneContainer: {
    width: '100%',
    marginTop: 16,
  },
  phoneLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e3a5f',
    marginBottom: 8,
  },
  phoneDisplayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  userPhone: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  editButtonText: {
    fontSize: 12,
    color: '#1e3a5f',
    fontWeight: '600',
  },
  saveButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#1e3a5f',
    borderRadius: 6,
  },
  saveButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  warningText: {
    fontSize: 12,
    color: '#800020',
    marginTop: 12,
    textAlign: 'center',
  },
  menuSection: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 16,
    color: '#1e3a5f',
  },
  menuArrow: {
    fontSize: 24,
    color: '#999',
  },
  logoutButton: {
    backgroundColor: '#800020',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    marginBottom: 24,
  },
});
