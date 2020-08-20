import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // flex: 1,
    // width: '50%',
    color: '#49658c',
    borderColor: '#49658c',
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 11,
    backgroundColor: '#00000000',
    paddingTop: 10,
    paddingBottom: 10,
    alignContent: 'center',
    justifyContent: 'center',
  },
  input: {
    minHeight: 28,
    color: '#000',
    paddingVertical: 0,
    flex: 1,
    zIndex: 10,
  },
  img: {
    height: 25,
    width: 25,
    alignSelf: 'center',
  },
  toggleButton: {
    zIndex: 11,
    alignSelf: 'center',
    justifyContent: 'flex-end',
  },
});
