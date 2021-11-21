jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);
// jest.mock('react-native-reanimated', () => {
//   const View = require('react-native').View;

//   return {
//     Value: jest.fn(),
//     event: jest.fn(),
//     add: jest.fn(),
//     eq: jest.fn(),
//     set: jest.fn(),
//     cond: jest.fn(),
//     interpolate: jest.fn(),
//     View: View,
//     Extrapolate: { CLAMP: jest.fn() },
//     Transition: {
//       Together: 'Together',
//       Out: 'Out',
//       In: 'In',
//     },
//   };
// });
