import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  LayoutAnimation,
  TouchableOpacity,
  NativeModules,
  StyleSheet,
} from 'react-native';
import {styles} from './styles';

import makeVisibleWhite from './assets/make_visible_white.png';
import makeInvisibleWhite from './assets/make_invisible_white.png';
import makeVisibleBlack from './assets/make_visible_black.png';
import makeInvisibleBlack from './assets/make_invisible_black.png';

const {UIManager} = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

interface Props {
  /**Value of the input */
  value: string;
  /**Style to the container of whole component*/
  containerStyles?: Object;
  /**Changes the color for hide/show password image*/
  darkTheme?: true | false | undefined;
  /**Value for the label, same as placeholder */
  label: string;
  /**Style to the label */
  labelStyles?: Object;
  /**Needed for 'next', 'done' etc. actions on keyboard */
  onRef: Function;
  /**Set this to true if is password to have a show/hide input and secureTextEntry automatically*/
  isPassword?: true | false | undefined;
  /**Sets default autocapitalize to input text, default words*/
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | undefined;
  autoFocus?: true | false | undefined;
  keyboardType:
    | 'default'
    | 'email-address'
    | 'numeric'
    | 'phone-pad'
    | 'number-pad'
    | 'decimal-pad'
    | 'visible-password'
    | 'ascii-capable'
    | 'numbers-and-punctuation'
    | 'url'
    | 'name-phone-pad'
    | 'twitter'
    | 'web-search'
    | undefined;
  /**Callback for change on the input value */
  onChange: Function;
  /**Callback for action submit on the keyboard */
  onSubmit: Function;
  /**Text for action in the keyboard */
  returnKeyType?:
    | 'default'
    | 'go'
    | 'google'
    | 'join'
    | 'next'
    | 'route'
    | 'search'
    | 'send'
    | 'yahoo'
    | 'done'
    | 'emergency-call'
    | undefined;
  /**Style to the show/hide password container */
  showPasswordContainerStyles?: Object;
  /**Style to the show/hide password image */
  showPasswordImageStyles?: Object;
  /**Style to the input */
  inputStyles?: Object;
  /**Path to your custom image for show/hide input */
  customShowPasswordImage?: string;
  /**Custom Style for position, size and color for label, when it's focused or blurred*/
  customLabelStyles?: {
    leftFocused: 15;
    leftBlurred: 30;
    topFocused: 0;
    topBlurred: 10;
    fontSizeFocused: 10;
    fontSizeBlurred: 14;
    colorFocused: '#49658c';
    colorBlurred: '#49658c';
  };
}

interface State {
  isFocused: Boolean;
  secureText: Boolean;
}

class FloatingLabelInput extends Component<Props> {
  props!: Props;
  textInput!: TextInput;

  state = {
    isFocused: this.props.value !== '' ? true : false,
    secureText: true,
  };

  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.value !== null) {
      if (props.value !== '') {
        state.isFocused = true;
      }
    }
    return null;
  }

  handleFocus = () => {
    LayoutAnimation.spring();
    this.setState({isFocused: true});
  };

  handleBlur = () => {
    if (this.props.value === '' || this.props.value == null) {
      LayoutAnimation.spring();
      this.setState({isFocused: false});
    }
  };

  setFocus = () => {
    this.textInput.focus();
  };

  _onChange = (value: string) => {
    this.props.onChange(value);
  };

  _toggleVisibility = () => {
    if (this.state.secureText) {
      this.setState({secureText: false});
    } else {
      this.setState({secureText: true});
    }
  };

  onSubmitEditing = () => {
    if (this.props.onSubmit !== undefined) {
      this.props.onSubmit();
    }
  };

  focus() {
    this.textInput.focus();
  }

  render() {
    let imgSource = this.props.darkTheme
      ? this.state.secureText
        ? makeVisibleBlack
        : makeInvisibleBlack
      : this.state.secureText
      ? makeVisibleWhite
      : makeInvisibleWhite;

    const customLabelStyles = {
      leftFocused: 15,
      leftBlurred: 30,
      topFocused: 0,
      topBlurred: 12.5,
      fontSizeFocused: 10,
      fontSizeBlurred: 14,
      colorFocused: '#49658c',
      colorBlurred: '#49658c',
      ...this.props.customLabelStyles,
    };

    const style: Object = {
      zIndex: 3,
      position: 'absolute',
      left: !this.state.isFocused
        ? customLabelStyles.leftBlurred
        : customLabelStyles.leftFocused,
      top: !this.state.isFocused
        ? customLabelStyles.topBlurred
        : customLabelStyles.topFocused,
      fontSize: !this.state.isFocused
        ? customLabelStyles.fontSizeBlurred
        : customLabelStyles.fontSizeFocused,
      color: !this.state.isFocused
        ? customLabelStyles.colorBlurred
        : customLabelStyles.colorFocused,
      ...this.props.labelStyles,
    };

    const input: Object = {
      color: customLabelStyles.colorFocused,
      ...styles.input,
      ...this.props.inputStyles,
    };

    const containerStyles: Object = {
      height: 50,
      color: '#49658c',
      borderColor: '#49658c',
      borderWidth: 2,
      borderRadius: 30,
      backgroundColor: '#00000000',
      paddingTop: 10,
      paddingBottom: 10,
      alignContent: 'center',
      justifyContent: 'center',
      ...this.props.containerStyles,
    };

    let defaultCapitalize =
      this.props.isPassword !== undefined && this.props.isPassword
        ? 'none'
        : this.props.autoCapitalize;

    const toggleButton = {
      ...styles.toggleButton,
      ...this.props.showPasswordContainerStyles,
    };

    const img = {
      ...styles.img,
      ...this.props.showPasswordImageStyles,
    };

    return (
      <View style={containerStyles}>
        <Text onPress={() => this.setFocus()} style={style}>
          {this.props.label}
        </Text>
        <View style={styles.containerInput}>
          <TextInput
            returnKeyType={
              this.props.returnKeyType !== undefined
                ? this.props.returnKeyType
                : 'done'
            }
            ref={(input) => (this.textInput = input)}
            onSubmitEditing={() => this.onSubmitEditing()}
            secureTextEntry={
              this.props.isPassword !== undefined
                ? this.props.isPassword && this.state.secureText
                : false
            }
            autoFocus={
              this.props.autoFocus != null ? this.props.autoFocus : false
            }
            autoCapitalize={
              defaultCapitalize != null ? defaultCapitalize : 'words'
            }
            keyboardType={
              this.props.keyboardType !== undefined
                ? this.props.keyboardType
                : 'default'
            }
            style={input}
            value={this.props.value}
            onChangeText={(value: string) => {
              this._onChange(value);
            }}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
          {this.props.isPassword ? (
            <TouchableOpacity
              style={toggleButton}
              onPress={this._toggleVisibility}>
              <Image
                source={
                  this.props.customShowPasswordImage !== undefined
                    ? this.props.customShowPasswordImage
                    : imgSource
                }
                resizeMode="contain"
                style={img}
              />
            </TouchableOpacity>
          ) : (
            <View />
          )}
        </View>
      </View>
    );
  }
}

export default FloatingLabelInput;
