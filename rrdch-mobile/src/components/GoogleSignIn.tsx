import { useAuthActions } from '@convex-dev/auth/react';
import { makeRedirectUri } from 'expo-auth-session';
import { openAuthSessionAsync } from 'expo-web-browser';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface GoogleSignInProps {
  onSignInSuccess?: () => void;
}

export function GoogleSignIn({ onSignInSuccess }: GoogleSignInProps) {
  const { signIn } = useAuthActions();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (Platform.OS === 'web') {
      Alert.alert(
        'Use email on web',
        'Google sign-in is only configured for Expo native sessions right now.',
      );
      return;
    }

    const redirectTo = makeRedirectUri();
    setLoading(true);

    try {
      const startResult = await signIn('google', { redirectTo });

      if (!startResult.redirect) {
        if (startResult.signingIn) {
          onSignInSuccess?.();
        }
        return;
      }

      const authSessionResult = await openAuthSessionAsync(
        startResult.redirect.toString(),
        redirectTo,
      );

      if (authSessionResult.type !== 'success' || !('url' in authSessionResult)) {
        return;
      }

      const code = new URL(authSessionResult.url).searchParams.get('code');
      if (!code) {
        throw new Error('Google sign-in did not return an authorization code.');
      }

      const finishResult = await signIn('google', { code });
      if (finishResult.signingIn) {
        onSignInSuccess?.();
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      Alert.alert('Error', 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={loading}>
      <View style={styles.buttonContent}>
        {loading ? (
          <ActivityIndicator color="#4285F4" />
        ) : (
          <>
            <Text style={styles.icon}>G</Text>
            <Text style={styles.buttonText}>Sign in with Google</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginVertical: 12,
    width: '100%',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4285F4',
    marginRight: 12,
  },
  buttonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});
