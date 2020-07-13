![npm](https://img.shields.io/npm/v/react-native?color=%232fa90f&label=react-native&style=plastic)
![npm](https://img.shields.io/npm/dm/react-native-floating-label-input?style=plastic)

# About

This is a React-Native TextInput component, containing a floating placeholder, visible even after filled in, that you can freely modify its styles.

## Instalation

To install just input the following command:

```bash
npm i react-native-floating-label-input
```

or

```bash
yarn add react-native-floating-label-input
```

## Basic Usage

```javascript
//...
import React, { useState } from 'react';
import FloatingLabelInput from 'react-native-floating-label-input';

const app: React.FC = () => {
  const [login, setLogin]= useState('');

  render() {
    return (
      <FloatingLabelInput
        label="Login"
        value={login}
        onChangeText={(value) => setLogin(value)}
      />
    );
  }
}
export default app;
```

## Advanced Usage

```javascript
//...
import React, { useState, useRef } from 'react';
import { View } from 'react-native';
import FloatingLabelInput from 'react-native-floating-label-input';

const app: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  return (
    <View>
      <FloatingLabelInput
        //  isFocused={false} // If you override the onFocus/onBlur props, you must handle this prop
        //  customLabelStyles={{}} // custom Style for position, size and color for label, when it's focused or blurred
        //  customShowPasswordImage={} // pass the image source to set your custom image
        //  labelStyles={{}} // add your styles to the floating label component
        //  showPasswordImageStyles={{}} // add your styles to the 'show password image' component
        //  containerStyles={{}} // add your styles to container of whole component
        //  showPasswordContainerStyles={{}} // add your styles to the 'show password container' component
        //  inputStyles={{}} // add your styles to inner TextInput component
        //  isPassword={false} // set this to true if value is password, default false
        //  darkTheme={false} // color of default 'show password image', default false
        //  onSubmit={() => this.yourFunction()} // adds callback to submit
        label="Placeholder" // required
        value={value} // required
        onChange={value => setValue(value)} // required
      />
      <FloatingLabelInput
        label="place"
        value={value}
        isFocused={isFocused}
        onSubmit={() => {
          passwordRef.current?.focus();
        }}
        ref={usernameRef}
        onChangeText={text => setValue(text)}
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={() => {
          value === '' && setIsFocused(false);
        }}
      />
      <FloatingLabelInput
        label="place"
        value={password}
        isPassword={true}
        darkTheme={true}
        ref={passwordRef}
        onChangeText={text => setPassword(text)}
      />
    </View>
  );
};

export default app;
```

- All commented options above are optional.
- If you want to use the "customShowPasswordImage" prop, provide a image path, for example:

```javascript
import showPassword from '../assets/images/yourImage';
// ...
customShowPasswordImage = { showPassword };
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
