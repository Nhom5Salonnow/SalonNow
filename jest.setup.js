// Jest setup file - runs before each test file

// Mock AsyncStorage globally with all needed methods
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
}));

// Mock expo-router globally with all commonly used exports
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    navigate: jest.fn(),
  },
  useLocalSearchParams: jest.fn(() => ({})),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    navigate: jest.fn(),
  })),
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  })),
  useSegments: jest.fn(() => []),
  usePathname: jest.fn(() => '/'),
  Link: ({ children }) => children,
  Stack: {
    Screen: () => null,
  },
  Tabs: {
    Screen: () => null,
  },
}));

// Mock react-native-safe-area-context globally
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
}));


// Mock react-native Alert for tests globally
// This is done in beforeEach to ensure it's properly set up for every test
beforeEach(() => {
  const { Alert } = require('react-native');
  if (Alert && Alert.alert) {
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  }
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Silence console warnings during tests
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    args[0]?.includes?.('Animated') ||
    args[0]?.includes?.('NativeEventEmitter')
  ) {
    return;
  }
  originalWarn(...args);
};
