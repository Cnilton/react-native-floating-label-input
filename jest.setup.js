jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);
