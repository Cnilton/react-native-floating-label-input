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
import FloatingLabelInput from 'react-native-floating-label-input';

export default class YourComponent extends Component {
  state = {
    yourValue: '',
  };

  render() {
    return (
      <FloatingLabelInput
        label="Placeholder" // required
        value={this.state.yourValue} // required
        onChange={(value) => this.setState({yourValue: value})} // required
      />
    );
  }
}
```

## Advanced Usage

```javascript
//...
import {View} from 'react-native';
import FloatingLabelInput from 'react-native-floating-label-input';

export default class YourComponent extends Component {
  state = {
    yourValue: '',
    yourValue2: '',
  };

  render() {
    return (
      <View>
        <FloatingLabelInput
          //  customLabelStyles={{}} // custom Style for position, size and color for label, when it's focused or blurred
          //  autoFocus={false} // auto focus when component mounted, default false
          //  autoCapitalize={} // set input text
          //  keyboardType={} // defines what type of keyboard is shown
          //  customShowPasswordImage={} // pass the image source to set your custom image
          //  labelStyles={{}} // add your styles to the floating label component
          //  showPasswordImageStyles={{}} // add your styles to the 'show password image' component
          //  containerStyles={{}} // add your styles to container of whole component
          //  showPasswordContainerStyles={{}} // add your styles to the 'show password container' component
          //  inputStyles={{}} // add your styles to inner TextInput component
          //  isPassword={false} // set this to true if value is password, default false
          //  darkTheme={false} // color of default 'show password image', default false
          //  onRef={(ref) => (this._login = ref)} // adds ref to your custom component
          //  onSubmit={() => this.yourFunction()} // adds callback to submit
          //  returnKeyType="next" // changes keyboard retun key text
          label="Placeholder" // required
          value={this.state.yourValue} // required
          onChange={(value) => this.setState({yourValue: value})} // required
        />
        <FloatingLabelInput
          onRef={(ref) => (this._password = ref)}
          isPassword={true}
          label="Placeholder" // required
          value={this.state.yourValue2} // required
          onChange={(value) => this.setState({yourValue2: value})} // required
        />
      </View>
    );
  }
}
```

- All commented options above are optional.
- If you want to use the "customShowPasswordImage" prop, provide a image path, for example:

```javascript
import showPassword from '../assets/images/yourImage';
// ...
customShowPasswordImage = {showPassword};
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
