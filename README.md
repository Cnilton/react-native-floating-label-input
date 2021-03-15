![npm](https://img.shields.io/npm/v/react-native?color=%232fa90f&label=react-native&style=plastic)
![npm](https://img.shields.io/npm/dm/react-native-floating-label-input?style=plastic)
![npm](https://img.shields.io/npm/dt/react-native-floating-label-input?style=plastic)

# About

This is a React-Native TextInput component, containing a floating placeholder, visible even after filled in, that you can freely modify its styles 💅🎉

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

# Version 1.3.5 **react-native-reanimated v2**

- All animations now are using react-native-reanimated v2, as it was officially released recently.

# Version 1.3.2  **new props**

- *rightComponent* prop added;
- *togglePassword* prop added;

### togglePassword : boolean

- Prop for force toggling show/hide password. If set to true, shows the password, and when set to false hides it

<img src ="https://i.imgur.com/kIfvKiD.gif" width="40%"/>

```javascript

import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {FloatingLabelInput} from 'react-native-floating-label-input';

export default function App() {
  const [cont, setCont] = useState('')
  const [show, setShow] = useState(false)

  useEffect(()=>{
    const timeout = setTimeout(() => {
      setShow(!show)
    }, 5000);
    return ()=> clearTimeout(timeout)
  },[show])

  return (
    <View style={{padding: 50, flex: 1, backgroundColor: '#fff'}}>
      <FloatingLabelInput
        label={'label'}
        isPassword
        togglePassword={show}
        value={cont}
        onChangeText={(value) => setCont(value)}
        customShowPasswordComponent={<Text>Show</Text>}
        customHidePasswordComponent={<Text>Hide</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

```

### rightComponent : JSX.Element

- Add left component to your input. Be aware if using the input as password this component is positioned before the show/hide component

<img src="https://i.imgur.com/LCa1BI9.png" width="40%">

```javascript
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FloatingLabelInput } from 'react-native-floating-label-input';

const app: React.FC = () => {
  const [phone, setPhone] = useState('');

  return (
    <View style={{padding: 50, flex: 1, backgroundColor: '#fff'}}>
      <FloatingLabelInput
        label={'label'}
        value={phone}
        rightComponent={(
          <TouchableOpacity style={{ alignContent:'center', justifyContent:'center'}} onPress={()=>{console.log('X clicked')}}><Text>X</Text></TouchableOpacity>
        )}
        onChangeText={(val) => setPhone(val)}
      />
    </View>
  );
};
export default app;
```

# Version 1.3.0 🎉🎉

- Animation added to font size on focus and on blur;
- **new** animationDuration prop added;
- staticLabel bug fixed when in multiline;
- Smoother animations;

## New Features

Mask has been updated, and some bugs should have been fixed. Features as **leftComponent**, **onTogglePassword**, **customShowPasswordComponent**, **customHidePasswordComponent**, **staticLabel**, **hint** and **hintTextColor** have been added! Checkout the usage:

### leftComponent : JSX.Element

- Add left component to your input. Usually used for displaying icon

<img src="https://i.imgur.com/mds0v8h.png" width="40%">

```javascript
import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { FloatingLabelInput } from 'react-native-floating-label-input';

const app: React.FC = () => {
  const [phone, setPhone] = useState('');

  return (
    <View style={{padding: 50, flex: 1, backgroundColor: '#fff'}}>
      <FloatingLabelInput
        label={'label'}
        value={phone}
        leftComponent={
          <Image
            style={{height: 30, width: 30}}
            source={{
              uri: 'https://image.flaticon.com/icons/png/512/25/25231.png',
            }}
          />
        }
        isPassword
        onChangeText={(val) => setPhone(val)}
        onFocus={focus}
        onBlur={blur}
        isFocused={focused}
        customShowPasswordComponent={<Text>Show</Text>}
        customHidePasswordComponent={<Text>Hide</Text>}
      />
    </View>
  );
};
export default app;
```

### onTogglePassword : (boolean) => void

- Callback for show/hide password

### customShowPasswordComponent and customHidePasswordComponent : JSX.Element

- Set your own show/hide password component

<img src ="https://i.imgur.com/mIRQay5.gif" width="40%"/>

```javascript
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { FloatingLabelInput } from 'react-native-floating-label-input';

const app: React.FC = () => {
  const [password, setPassword] = useState('');

  return (
    <View style={{padding: 50, flex: 1, backgroundColor: '#fff'}}>
      <FloatingLabelInput
        label="Password"
        value={password}
        onTogglePassword={(bool) => {
          console.log(bool);
        }}
        customShowPasswordComponent={<Text>Show</Text>}
        customHidePasswordComponent={<Text>Hide</Text>}
        onChangeText={(value) => {
          setPassword(value);
        }}
      />
    </View>
  );
};
export default app;
```

### staticLabel : boolean

- Set this to true if you want the label to be always at a set position. Commonly used with hint for displaying both label and hint for your input. For changing the position of the label with this prop as true, use the **customLabelStyles** _topFocused_ and _leftFocused_ to adjust the wanted position. Default false.


### hint : string

- Hint displays only when staticLabel prop is set to true. This prop is used to show a preview of the input to the user.

### hintTextColor : string

- Set the color to the hint

#### New props usage example

<img src ="https://i.imgur.com/cgQsY20.gif" width="40%"/>

```javascript
import React, { useState } from 'react';
import { View } from 'react-native';
import { FloatingLabelInput } from 'react-native-floating-label-input';

const app: React.FC = () => {
  const [phone, setPhone] = useState('');

  return (
    <View style={{padding: 50, flex: 1, backgroundColor: '#fff'}}>
      <FloatingLabelInput
        label="Phone"
        value={phone}
        staticLabel
        hintTextColor={'#aaa'}
        mask="99 (99) 99999-9999"
        hint="55 (22) 98765-4321"
        containerStyles={{
          borderWidth: 2,
          paddingHorizontal: 10,
          backgroundColor: '#fff',
          borderColor: 'blue',
          borderRadius: 8,
        }}
        customLabelStyles={{
          colorFocused: 'red',
          fontSizeFocused: 12,
        }}
        labelStyles={{
          backgroundColor: '#fff',
          paddingHorizontal: 5,
        }}
        inputStyles={{
          color: 'blue',
          paddingHorizontal: 10,
        }}
        onChangeText={(value) => {
          setPhone(value);
        }}
      />
    </View>
  );
};
export default app;
```

### setGlobalStyles : Object

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

<!-- * Numbers in Mask -->

  <!-- Currently the mask filters number from higher to lower. For example the mask="345" will allow only the max number of "345" and lower, like "344", "343" etc. If you want to allow all numbers in a digit, just put "9" at the desired spot. -->

* Currency

  Currently the mask will take effect in all maskTypes, except 'currency', wich is made automatically when maskType is set as currency. The reason is because currency is dynamic within the input value. If you want to change the thousands divider to other pattern, just insert the prop currencyDivider with one of: ',' or '.'.

<img src ="https://i.imgur.com/iKbez6d.gif" width="40%"/>

```javascript
//...
import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { FloatingLabelInput } from 'react-native-floating-label-input';

const app: React.FC = () => {
  const [birthday, setBirthday] = useState('');
  const [phone, setPhone] = useState('');
  const [price, setPrice] = useState('');

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        margin: 30,
      }}
    >
      <FloatingLabelInput
        label="Birthday"
        value={birthday}
        mask="99/99/9999"
        keyboardType="numeric"
        onChangeText={value => setBirthday(value)}
      />
      <FloatingLabelInput
        label="Phone"
        value={phone}
        mask="(99)99999-9999"
        keyboardType="numeric"
        onChangeText={value => setPhone(value)}
      />
      <FloatingLabelInput
        label="Price"
        value={price}
        maskType="currency"
        currencyDivider="." // which generates: 9.999.999,99 or 0,99 ...
        keyboardType="numeric"
        onChangeText={value => setPrice(value)}
      />
    </ScrollView>
  );
};
export default app;
```

### Character Count

<img src ="https://i.imgur.com/7lkamn4.gif" width="40%"/>

```javascript
import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { FloatingLabelInput } from 'react-native-floating-label-input';

const app: React.FC = () => {
  const [description, setDescription] = useState('');

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        margin: 30,
      }}
    >
      <FloatingLabelInput
        multiline={true}
        label="Description"
        value={val}
        blurOnSubmit={false}
        countdownLabel="chars left"
        maxLength={100}
        showCountdown={true}
        onChangeText={value => setDescription(value)}
      />
    </ScrollView>
  );
};
export default app;
```

## Basic Usage

```javascript
//...
import React, { useState } from 'react';
import { FloatingLabelInput } from 'react-native-floating-label-input';

const app: React.FC = () => {
  const [login, setLogin] = useState('');

  return (
    <FloatingLabelInput
      label="Login"
      value={login}
      onChangeText={value => setLogin(value)}
    />
  );
};
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
        //  staticLabel // Set this to true if you want the label to be always at a set position. Commonly used with hint for displaying both label and hint for your input. For changing the position of the label with this prop as true, use the **customLabelStyles** _topFocused_ and _leftFocused_ to adjust the wanted position. Default false.
        //  hint="" // Hint displays only when staticLabel prop is set to true. This prop is used to show a preview of the input to the user.
        //  hintTextColor="#ccc" // Set the color to the hint
        //  currencyDivider="," // Set currency thousands divider, default is ","
        //  maxDecimalPlaces={2} // Set maximum decimal places, default is 2
        //  isFocused={false} // If you override the onFocus/onBlur props, you must handle this prop
        //  customLabelStyles={{}} // custom Style for position, size and color for label, when it's focused or blurred
        //  customShowPasswordImage={} // pass the image source to set your custom show image
        //  customHidePasswordImage={} // pass the image source to set your custom hide image
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
        //  showCountdownStyles={{}} // add your styles to the countdown label
        //  countdownLabel="" // Set the label to be shown after the allowed number of characters remaining, default is ""
        //  onSubmit={() => this.yourFunction()} // adds callback to submit
        //  customShowPasswordComponent={} // Set your own JSX.Element to be the show password element
        //  customHidePasswordComponent={} // Set your own JSX.Element to be the hide password element
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
        label="Password"
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
- If you want to use the "customShowPasswordImage" prop or "customHidePasswordImage" prop, provide a image path, for example:

```javascript
import showPassword from '../assets/images/yourImage';
import hidePassword from '../assets/images/yourImage2';
// ...
<FloatingLabelInput
  label="Password"
  value={password}
  isPassword={true}
  onChangeText={text => setPassword(text)}
  customShowPasswordImage={showPassword}
  customHidePasswordImage={hidePassword}
/>

```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
