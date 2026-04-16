# RRDCH Mobile App

React Native mobile application for Rajarajeshwari Dental College & Hospital (RRDCH).

## Tech Stack

- **React Native** with Expo
- **TypeScript**
- **React Navigation** (Native Stack Navigator)
- **Convex** (Backend integration)
- **Razorpay** (Payment integration)
- **OTP Verification** (react-native-otp-verify)

## Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- For iOS: Xcode (macOS only)
- For Android: Android Studio with SDK

## Installation

```bash
cd rrdch-mobile
npm install
```

## Environment Setup

Copy `.env.example` to `.env` and fill in your keys:

```bash
cp .env.example .env
```

Required environment variables:
- `EXPO_PUBLIC_CONVEX_URL` - Your Convex deployment URL
- `RAZORPAY_KEY_ID` - Razorpay test key ID
- `RAZORPAY_KEY_SECRET` - Razorpay test key secret
- SMS gateway credentials (MSG91 or Twilio)

## Running the App

### Development Mode

```bash
# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run in web browser
npm run web
```

### Using Expo Go (Physical Device)

1. Install Expo Go app on your phone
2. Run `npm start`
3. Scan the QR code with Expo Go

## Project Structure

```
src/
├── navigation/
│   └── AppNavigator.tsx      # Main navigation setup
├── screens/
│   ├── LoginScreen.tsx       # Phone OTP login
│   ├── HomeScreen.tsx        # Dashboard
│   ├── AppointmentsScreen.tsx # Appointment management
│   ├── PaymentsScreen.tsx    # Payment history & Razorpay
│   └── ProfileScreen.tsx     # User profile
├── config/
│   └── convex.ts             # Convex client configuration
└── types/
    └── (TypeScript types)
```

## Features

### Authentication
- Phone number + OTP based login
- Convex Auth integration
- Session persistence

### Patient Portal
- View upcoming appointments
- Book new appointments
- Track appointment status

### Payments
- View payment history
- Pay pending bills via Razorpay
- Payment status tracking

### Profile
- Personal information management
- Medical history
- Settings and preferences

## Integration with Web App

This mobile app shares the same Convex backend as the web app (`/rrdch`). This means:
- Real-time data sync between web and mobile
- Shared authentication sessions
- Consistent business logic

## TODO

- [ ] Complete Convex Auth integration (Phone/OTP provider)
- [ ] Implement real Razorpay payment flow
- [ ] Add SMS gateway integration (MSG91/Twilio)
- [ ] Connect to actual Convex queries/mutations
- [ ] Add proper error handling
- [ ] Implement offline support
- [ ] Add push notifications
- [ ] Write unit tests
- [ ] Add E2E tests with Detox

## Build for Production

### iOS
```bash
eas build --platform ios
```

### Android
```bash
eas build --platform android
```

## Troubleshooting

### Metro bundler issues
```bash
npx expo start --clear
```

### iOS build issues
```bash
cd ios && pod install && cd ..
```

### Clear cache
```bash
npx expo start -c
```

## License

Proprietary - RRDCH
