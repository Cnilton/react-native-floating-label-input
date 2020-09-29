![npm](https://img.shields.io/npm/v/react-native?color=%232fa90f&label=react-native&style=plastic)
![npm](https://img.shields.io/npm/dm/react-native-floating-label-input?style=plastic)

# About

This is a React-Native TextInput component, containing a floating placeholder, visible even after filled in, that you can freely modify its styles.

<img src ="https://i.imgur.com/Na1KLIE.gif" width="40%"/>

## Instalation

To install just input the following command:

```bash
npm i react-native-floating-label-input
```

or

```bash
yarn add react-native-floating-label-input
```

## New Features

Features as setGlobalStyles, and mask have been added! Checkout the usage:

### setGlobalStyles

```javascript
// index.js or any other root file
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import './globalStyles';

AppRegistry.registerComponent(appName, () => App);

// globalStyles.js
import { setGlobalStyles } from 'react-native-floating-label-input';

setGlobalStyles.containerStyles = {
  backgroundColor: '#eeddee',
  // any styles you want to generalize to your input container
};
setGlobalStyles.labelStyles = {
  color: '#f98f68',
  // any styles you want to generalize to your floating label
};
setGlobalStyles.inputStyles = {
  color: '#383',
  // any styles you want to generalize to your input
};
```

### Input mask

Props relating mask:

- mask: 'string';
- maskType?: 'currency' | 'phone' | 'date' | 'card';
- currencyDivider: ',' | '.';

Currently the mask will take effect in all maskTypes, except 'currency', wich is made automatically when maskType is set as currency. The reason is because currency is dynamic within the input value. If you want to change the thousands divider to other pattern, just insert the prop currencyDivider with one of: ',' or '.'.

```javascript
//...
import React, { useState } from 'react';
import {FloatingLabelInput} from 'react-native-floating-label-input';

const app: React.FC = () => {
  const [birthday, setBirthday]= useState('');
  const [phone, setPhone]= useState('');
  const [price, setPrice]= useState('');

  render() {
    return (
      <>
      <FloatingLabelInput
        label="Birthday"
        value={birthday}
        mask='99/99/9999'
        keyboardType="numeric"
        onChangeText={(value) => setBirthday(value)}
      />
      <FloatingLabelInput
        label="Phone"
        value={login}
        mask='(99)98765-4321'
        keyboardType="numeric"
        onChangeText={(value) => setPhone(value)}
      />
      <FloatingLabelInput
        label="Price"
        value={price}
        maskType="currency"
        currencyDivider="."  // which generates: 9.999.999,99 or 0,99 ...
        keyboardType="numeric"
        onChangeText={(value) => setPrice(value)}
      />
      </>
    );
  }
}
export default app;
```

## Basic Usage

```javascript
//...
import React, { useState } from 'react';
import {FloatingLabelInput} from 'react-native-floating-label-input';

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
import { FloatingLabelInput } from 'react-native-floating-label-input';

const app: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  return (
    <View>
      <FloatingLabelInput
        //  mask="99/99/9999" // Set mask to your input
        //  maskType="date" // Set mask type
        //  currencyDivider="," // Set currency thousands divider, default is ","
        //  maxDecimalPlaces={2} // Set the maximum number of places after the decimal, default is 2
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
        //  multiline={false} // set this to true to enable multiline support, default false
        //  maxLength={} // Set maximum number of characters input will accept. Value overridden by mask if present
        //  showCountdown={false} // Set this to true to show the allowed number of characters remaining, default false
        //  countdownLabel="" // Set the label to be shown after the allowed number of characters remaining, default is ""
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
