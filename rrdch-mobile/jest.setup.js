try {
  require('react-native-gesture-handler/jestSetup');
} catch (error) {
  // The native gesture handler package is optional in this test environment.
}

// Mock environment variables
process.env.EXPO_PUBLIC_CONVEX_URL = 'https://test.convex.cloud';

jest.mock(
  'react-native-reanimated',
  () => ({
    __esModule: true,
    default: {
      call: () => {},
    },
    createAnimatedComponent: (component) => component,
    useSharedValue: (value) => ({ value }),
    useAnimatedStyle: (updater) => updater(),
    withTiming: (value) => value,
    withSpring: (value) => value,
    withDelay: (_delay, value) => value,
    runOnJS: (fn) => fn,
    Easing: {
      linear: jest.fn(),
      ease: jest.fn(),
      in: jest.fn((fn) => fn),
      out: jest.fn((fn) => fn),
      inOut: jest.fn((fn) => fn),
    },
  }),
  { virtual: true },
);

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    reset: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('expo-auth-session', () => ({
  ...jest.requireActual('expo-auth-session'),
  startAsync: jest.fn(),
  dismiss: jest.fn(),
  makeRedirectUri: jest.fn(() => 'http://localhost'),
}));

jest.mock('./src/config/convex', () => ({
  convex: {
    query: jest.fn(),
    mutation: jest.fn(),
  },
  convexTokenStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

jest.mock('@convex-dev/auth/react', () => ({
  useAuthActions: () => ({
    signIn: jest.fn(),
    signOut: jest.fn(),
  }),
}));

jest.mock('convex/react', () => ({
  useConvexAuth: () => ({
    isAuthenticated: false,
    isLoading: false,
  }),
}));

global.__reanimatedWorkletInit = () => {};
