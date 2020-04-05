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

interface LabelStyles {
  colorBlurred: string | undefined;
  colorFocused: string | undefined;
  leftBlurred: Number | undefined;
  leftFocused: Number | undefined;
  topBlurred: Number | undefined;
  topFocused: Number | undefined;
  fontSizeBlurred: Number | undefined;
  fontSizeFocused: Number | undefined;
}

interface Styles extends StyleSheet {}

interface Props {
  value: string;
  containerStyles?: Object;
  darkTheme?: true | false | undefined;
  label: string;
  labelStyles?: LabelStyles;
  onRef: Function;
  isPassword?: true | false | undefined;
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
  onChange: Function;
  onSubmit: Function;
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
  showPasswordContainerStyles?: Styles;
  showPasswordImageStyles?: Styles;
  inputStyles?: Styles;
  customShowPasswordImage?: string;
}

interface State {
  isFocused: Boolean;
  secureText: Boolean;
}
class FloatingLabelInput extends Component<Props> {
  state!: State;
  props!: Props;
  textInput!: TextInput;

  // setState!: Function;

  constructor(props: Props) {
    super(props);
    this.state = {
      isFocused: false,
      secureText: props.value !== '' ? true : false,
    };
  }

  // const inputRef = useRef(null);

  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
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

    // if (value != '') {
    //   setIsFocused(true);
    // }

    const labelStyles = {
      leftFocused: 15,
      leftBlurred: 30,
      topFocused: 0,
      fontSizeFocused: 10,
      fontSizeBlurred: 14,
      colorFocused: '#49658c',
      colorBlurred: '#49658c',
      ...this.props.labelStyles,
    };

    const style: Styles = {
      zIndex: 3,
      position: 'absolute',
      left: !this.state.isFocused
        ? labelStyles.leftBlurred
        : labelStyles.leftFocused,
      top: !this.state.isFocused
        ? labelStyles.topBlurred
        : labelStyles.topFocused,
      fontSize: !this.state.isFocused
        ? labelStyles.fontSizeBlurred
        : labelStyles.fontSizeFocused,
      color: !this.state.isFocused
        ? labelStyles.colorBlurred
        : labelStyles.colorFocused,
      ...style,
    };

    const input = {
      color: labelStyles.colorFocused,
      ...styles.input,
      ...this.props.inputStyles,
    };

    const containerStyles = {
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
