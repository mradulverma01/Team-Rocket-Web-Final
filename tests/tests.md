# RRDCH Platform - Testing Documentation

Comprehensive test checklist covering authentication, UI, payments, mobile app, and E2E scenarios.

---

## Table of Contents

1. [Authentication Tests](#authentication-tests)
2. [UI/UX Tests](#uiux-tests)
3. [Payment Integration Tests](#payment-integration-tests)
4. [Mobile App Tests](#mobile-app-tests)
5. [E2E Tests](#e2e-tests)
6. [Performance Tests](#performance-tests)
7. [Accessibility Tests](#accessibility-tests)

---

## Authentication Tests

### Phone OTP Flow

- [ ] **Sign Up - New User**
  - Navigate to `/sign-up`
  - Enter valid Indian phone number (+91 format)
  - Verify OTP is sent (check console/SMS gateway logs)
  - Enter correct 6-digit OTP
  - Verify user is redirected to role-based dashboard
  - Verify user record is created in Convex `users` table
  - Verify `tokenIdentifier` is set correctly

- [ ] **Sign In - Existing User**
  - Navigate to `/sign-in`
  - Enter registered phone number
  - Verify OTP is sent
  - Enter correct OTP
  - Verify user is redirected to correct dashboard based on role
  - Verify session is persisted across page refreshes

- [ ] **Invalid OTP Handling**
  - Enter incorrect OTP (6 digits)
  - Verify error message is displayed
  - Verify user can retry
  - After 3 failed attempts, verify rate limiting (if implemented)

- [ ] **Invalid Phone Number**
  - Enter phone number with less than 10 digits
  - Verify validation error
  - Enter non-numeric characters
  - Verify validation error

- [ ] **Session Persistence**
  - Login as patient
  - Close browser tab
  - Reopen and navigate to `/appointments`
  - Verify user remains logged in
  - Logout and verify session is cleared
  - Navigate to protected route → verify redirect to `/sign-in`

### Role-Based Routing

- [ ] **Patient Role**
  - Login with patient role
  - Navigate to `/patient/appointments` → should work
  - Navigate to `/student/syllabus` → should redirect to `/sign-in` or show unauthorized
  - Navigate to `/doctor/queue` → should redirect to `/sign-in` or show unauthorized

- [ ] **Student Role**
  - Login with student role
  - Navigate to `/student/syllabus` → should work
  - Navigate to `/patient/appointments` → should redirect
  - Navigate to `/doctor/queue` → should redirect

- [ ] **Doctor Role**
  - Login with doctor role
  - Navigate to `/doctor/queue` → should work
  - Navigate to `/patient/appointments` → should redirect
  - Navigate to `/student/syllabus` → should redirect

- [ ] **Middleware Protection**
  - Access protected routes without auth → verify redirect to `/sign-in`
  - Access public routes (`/`, `/about`, `/contact`) without auth → should work
  - Verify middleware runs on every route change

---

## UI/UX Tests

### Public Pages

- [ ] **Homepage (`/`)**
  - Hero slider auto-plays with correct timing
  - Navigation dots work correctly
  - Welcome section displays 3 cards (Chairman, College, Hospital)
  - Stats counter animates on scroll
  - Events tabs switch correctly
  - Accreditation bar scrolls horizontally
  - Footer displays all columns and map embed

- [ ] **Navigation**
  - Mega-menu dropdowns work on hover/click
  - Mobile hamburger menu opens/closes
  - Top bar displays contact info correctly
  - Announcement ticker scrolls continuously
  - All navigation links lead to correct pages

- [ ] **Responsive Design**
  - Test on mobile (375px width) → verify layout adapts
  - Test on tablet (768px width) → verify layout adapts
  - Test on desktop (1920px width) → verify layout adapts
  - Verify images scale correctly
  - Verify text remains readable at all sizes

- [ ] **Department Pages**
  - Navigate to `/departments/orthodontics`
  - Verify department name and description display
  - Verify department images load
  - Verify "Book Appointment" button works (if applicable)

- [ ] **Contact Form**
  - Fill out contact form with valid data
  - Submit and verify success message with reference ID
  - Verify webhook is called (check logs)
  - Verify confirmation panel is accessible

### Portal Pages

- [ ] **Patient Portal**
  - Login as patient
  - Navigate to `/patient/book`
  - Verify appointment booking form works
  - Navigate to `/patient/appointments`
  - Verify appointment list displays
  - Navigate to `/patient/complaints`
  - Verify complaint form works

- [ ] **Student Portal**
  - Login as student
  - Navigate to `/student/syllabus`
  - Verify syllabus content displays
  - Navigate to `/student/schedule`
  - Verify class schedule displays
  - Navigate to `/student/hostel`
  - Verify complaint form works

- [ ] **Doctor Portal**
  - Login as doctor
  - Navigate to `/doctor/queue`
  - Verify patient queue displays
  - Navigate to `/doctor/patients`
  - Verify patient list displays
  - Navigate to `/doctor/announcements`
  - Verify announcement form works

---

## Payment Integration Tests

### Razorpay Integration

- [ ] **Order Creation**
  - Login as patient
  - Navigate to `/patient/payments`
  - Click "Pay Now" on pending payment
  - Verify API call to `/api/payments/razorpay/order` succeeds
  - Verify order is created on Razorpay (check test dashboard)
  - Verify order ID is returned to client

- [ ] **Payment Modal**
  - Verify Razorpay checkout modal opens
  - Verify correct amount is displayed
  - Verify appointment details are shown
  - Verify test mode is enabled

- [ ] **Successful Payment**
  - Complete test payment (use Razorpay test card)
  - Verify success callback is triggered
  - Verify API call to `/api/payments/razorpay/verify` succeeds
  - Verify payment signature is validated
  - Verify appointment `paymentStatus` is updated to "paid" in Convex
  - Verify user is redirected to success page
  - Verify payment appears in "Completed" section

- [ ] **Failed Payment**
  - Cancel payment in Razorpay modal
  - Verify failure callback is triggered
  - Verify appointment `paymentStatus` remains "unpaid"
  - Verify user can retry payment

- [ ] **Duplicate Payment Prevention**
  - Attempt to pay for an already-paid appointment
  - Verify "Pay Now" button is disabled
  - Verify message indicates payment is complete

- [ ] **Environment Variables**
  - Verify `RAZORPAY_KEY_ID` is loaded from `.env`
  - Verify `RAZORPAY_KEY_SECRET` is loaded from `.env`
  - Verify test keys are used (not production keys)

---

## Mobile App Tests

### App Launch & Navigation

- [ ] **App Launch**
  - Launch app on iOS simulator
  - Verify splash screen displays
  - Verify login screen appears after splash
  - Launch app on Android emulator
  - Verify same behavior

- [ ] **Navigation**
  - Tap on menu items
  - Verify screens navigate correctly
  - Verify back button works
  - Verify stack navigation maintains history

### Authentication

- [ ] **Login Flow**
  - Enter phone number
  - Tap "Send OTP"
  - Verify loading indicator shows
  - Verify OTP input appears
  - Enter OTP
  - Tap "Verify OTP"
  - Verify navigation to Home screen

- [ ] **Logout**
  - Navigate to Profile screen
  - Tap "Logout"
  - Verify confirmation dialog appears
  - Confirm logout
  - Verify navigation to Login screen
  - Verify session is cleared

### Screens

- [ ] **Home Screen**
  - Verify greeting displays
  - Verify quick stats show correct numbers
  - Verify menu cards are tappable
  - Verify recent activity displays
  - Verify announcements display

- [ ] **Appointments Screen**
  - Verify appointment list displays
  - Verify status badges show correct colors
  - Tap "Pay Now" on unpaid appointment
  - Verify navigation to Payments screen

- [ ] **Payments Screen**
  - Verify summary card shows correct totals
  - Verify transaction history displays
  - Verify status badges show correct colors
  - Tap "Pay Now" on pending payment
  - Verify Razorpay modal opens (when implemented)

- [ ] **Profile Screen**
  - Verify user info displays
  - Verify menu items are tappable
  - Tap "Logout"
  - Verify confirmation dialog

### Convex Integration (When Implemented)

- [ ] **Data Sync**
  - Verify mobile app connects to Convex
  - Verify appointments sync from Convex
  - Verify payments sync from Convex
  - Verify real-time updates work

---

## E2E Tests

### Playwright Setup

Install and configure Playwright:

```bash
cd rrdch
npm install -D @playwright/test
npx playwright install
```

### Test Scenarios

- [ ] **Patient Journey**
  1. Navigate to `/sign-up`
  2. Enter phone number and receive OTP
  3. Verify OTP and login
  4. Navigate to `/patient/book`
  5. Fill appointment form
  6. Submit booking
  7. Verify confirmation message
  8. Navigate to `/patient/appointments`
  9. Verify new appointment appears
  10. Navigate to `/patient/payments`
  11. Pay for appointment
  12. Verify payment success

- [ ] **Student Journey**
  1. Login as student
  2. Navigate to `/student/syllabus`
  3. Verify syllabus loads
  4. Navigate to `/student/schedule`
  5. Verify schedule loads
  6. Navigate to `/student/hostel`
  7. Submit complaint
  8. Verify success message

- [ ] **Doctor Journey**
  1. Login as doctor
  2. Navigate to `/doctor/queue`
  3. Verify patient queue loads
  4. Navigate to `/doctor/announcements`
  5. Create announcement
  6. Verify success message

### Running E2E Tests

```bash
cd rrdch
npm run test:e2e
```

---

## Performance Tests

### Web Performance

- [ ] **Lighthouse Score**
  - Run Lighthouse on homepage
  - Verify Performance score > 90
  - Verify Accessibility score > 90
  - Verify Best Practices score > 90
  - Verify SEO score > 90

- [ ] **Load Time**
  - Measure initial page load time
  - Verify < 3 seconds on 4G
  - Verify < 1.5 seconds on broadband

- [ ] **Image Optimization**
  - Verify all images are optimized (WebP format)
  - Verify images have proper dimensions
  - Verify lazy loading is implemented

### Mobile Performance

- [ ] **App Startup Time**
  - Measure app launch time
  - Verify < 3 seconds cold start
  - Verify < 1 second warm start

- [ ] **Navigation Performance**
  - Measure screen transition time
  - Verify < 500ms between screens

---

## Accessibility Tests

### Web Accessibility

- [ ] **Keyboard Navigation**
  - Navigate entire site using Tab key
  - Verify focus indicators are visible
  - Verify all interactive elements are reachable

- [ ] **Screen Reader**
  - Test with NVDA (Windows) or VoiceOver (Mac)
  - Verify all images have alt text
  - Verify form fields have labels
  - Verify error messages are announced

- [ ] **Color Contrast**
  - Verify text contrast ratio > 4.5:1
  - Verify interactive elements have sufficient contrast
  - Test with color blindness simulator

- [ ] **Responsive Text**
  - Verify text can be resized up to 200%
  - Verify layout remains functional

### Mobile Accessibility

- [ ] **Screen Size Support**
  - Test on smallest supported device (iPhone SE)
  - Verify all content is accessible
  - Verify no horizontal scrolling

- [ ] **Touch Targets**
  - Verify all tappable elements are at least 44x44px
  - Verify buttons have adequate spacing

---

## Automated Test Commands

### Web App

```bash
# TypeScript compilation
cd rrdch && npm run typecheck

# Lint check
cd rrdch && npm run lint

# Build verification
cd rrdch && npm run build

# E2E tests (Playwright)
cd rrdch && npm run test:e2e
```

### Mobile App

```bash
# TypeScript compilation
cd rrdch-mobile && npx tsc --noEmit

# Lint check
cd rrdch-mobile && npm run lint (if configured)

# Build verification
cd rrdch-mobile && npm run build (if configured)

# Run on iOS simulator
cd rrdch-mobile && npm run ios

# Run on Android emulator
cd rrdch-mobile && npm run android
```

---

## Manual Verification Checklist

### Before Deployment

- [ ] All automated tests pass
- [ ] Manual smoke test on staging environment
- [ ] Test with real Razorpay test keys
- [ ] Test SMS OTP delivery (if SMS gateway is configured)
- [ ] Verify all environment variables are set correctly
- [ ] Verify Convex deployment is linked
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile devices (iOS Safari, Android Chrome)
- [ ] Verify error handling for edge cases
- [ ] Verify logging is working
- [ ] Check for console errors in browser
- [ ] Verify analytics tracking (if implemented)

---

## Known Issues & Limitations

- Convex Auth is in beta - APIs may change
- SMS gateway integration not yet implemented (console-only OTP for dev)
- Razorpay integration uses test keys - production keys needed for live deployment
- Mobile app Convex integration pending proper `convex/react-native` setup
- E2E tests not yet implemented - Playwright setup needed

---

## Test Environment Setup

### Local Development

1. Clone repository
2. Copy `.env.example` to `.env`
3. Fill in environment variables
4. Run `npm install` in both `rrdch` and `rrdch-mobile`
5. Start Convex dev server: `cd rrdch && npm run convex:dev`
6. Start Next.js dev server: `cd rrdch && npm run dev`
7. For mobile: `cd rrdch-mobile && npm start`

### Staging Environment

- Deploy to Vercel (web)
- Deploy to Expo (mobile)
- Use staging Convex deployment
- Use test Razorpay keys
- Use test SMS gateway credentials

---

## Reporting Test Results

When reporting test results, include:
- Test environment (local/staging/production)
- Browser/device used
- Test cases executed
- Pass/fail status
- Screenshots of failures
- Console logs (if applicable)
- Convex logs (if applicable)

---

## Continuous Integration

Recommended CI pipeline:

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run build
      - run: npm run test:e2e
```

---

## Contact

For questions about testing, refer to:
- AGENTS.md for project structure
- README.md for setup instructions
- Convex documentation: https://docs.convex.dev
- Razorpay documentation: https://razorpay.com/docs
- React Native documentation: https://reactnative.dev
