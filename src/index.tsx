import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  Animated,
  Easing,
  TextInput,
  Image,
  Text,
  TouchableOpacity,
  TextInputProps,
  TextStyle,
  ViewStyle,
  ImageStyle,
  TouchableWithoutFeedback,
  LayoutChangeEvent,
} from 'react-native';
import {styles} from './styles';

import makeVisibleWhite from './assets/make_visible_white.png';
import makeInvisibleWhite from './assets/make_invisible_white.png';
import makeVisibleBlack from './assets/make_visible_black.png';
import makeInvisibleBlack from './assets/make_invisible_black.png';

export interface Props extends TextInputProps {
  /** Style to the container of whole component */
  containerStyles?: ViewStyle;
  /** Changes the color for hide/show password image */
  darkTheme?: true | false;
  /** Set this to true if you want the label to be always at a set position. Commonly used with hint for displaying both label and hint for your input. Default false. */
  staticLabel?: boolean;
  /** Hint displays only when staticLabel prop is set to true. This prop is used to show a preview of the input to the user */
  hint?: string;
  /** Set the color to the hint */
  hintTextColor?: string;
  /** Value for the label, same as placeholder */
  label: string;
  /** Style to the label */
  labelStyles?: TextStyle;
  /** Set this to true if is password to have a show/hide input and secureTextEntry automatically*/
  isPassword?: true | false;
  /** Callback for action submit on the keyboard */
  onSubmit?: Function;
  /** Style to the show/hide password container */
  showPasswordContainerStyles?: ViewStyle;
  /** Style to the show/hide password image */
  showPasswordImageStyles?: ImageStyle;
  /** Style to the input */
  inputStyles?: TextStyle;
  /** Path to your custom image for show input */
  customShowPasswordImage?: string;
  /** Path to your custom image for hide input */
  customHidePasswordImage?: string;
  /** Custom Style for position, size and color for label, when it's focused or blurred*/
  customLabelStyles?: CustomLabelProps;
  /** Required if onFocus or onBlur is overrided */
  isFocused?: boolean;
  /** Set a mask to your input*/
  mask?: string;
  /** Set mask type*/
  maskType?: 'currency' | 'phone' | 'date' | 'card';
  /** Set currency thousand dividers*/
  currencyDivider?: ',' | '.';
  /** Maxinum number of decimal places allowed for currency mask. */
  maxDecimalPlaces?: number;
  /** Changes the input from single line input to multiline input*/
  multiline?: true | false;
  /** Maxinum number of characters allowed. Overriden by mask if present */
  maxLength?: number;
  /** Shows the remaining number of characters allowed to be typed if maxLength or mask are present */
  showCountdown?: true | false;
  /** Style to the countdown text */
  showCountdownStyles?: TextStyle;
  /** Label for the remaining number of characters allowed shown after the number */
  countdownLabel?: string;
  /** Set your custom show password component */
  customShowPasswordComponent?: JSX.Element;
  /** Set your custom hide password component */
  customHidePasswordComponent?: JSX.Element;
  /** Callback for show/hide password */
  onTogglePassword?: (show: boolean) => void;
  /** Add left component to your input. Usually used for displaying icon */
  leftComponent?: JSX.Element;
}

export interface SetGlobalStyles {
  /** Set global styles to all floating-label-inputs container*/
  containerStyles?: ViewStyle;
  /** Set global custom styles to all floating-label-inputs labels*/
  customLabelStyles?: CustomLabelProps;
  /** Set global styles to all floating-label-inputs input*/
  inputStyles?: TextStyle;
  /** Set global styles to all floating-label-inputs label*/
  labelStyles?: TextStyle;
  /** Set global styles to all floating-label-inputs show password container*/
  showPasswordContainerStyles?: ViewStyle;
  /** Set global styles to all floating-label-inputs show password image*/
  showPasswordImageStyles?: ImageStyle;
  /** Set global style to the countdown text */
  showCountdownStyles?: TextStyle;
}

export interface CustomLabelProps {
  /** Absolute distance from left-most side of the input when focused */
  leftFocused?: number;
  /** Absolute distance from left-most side of the input when blurred */
  leftBlurred?: number;
  /** Absolute distance from center of the input when focused */
  topFocused?: number;
  /** Absolute distance from center of the input when blurred */
  topBlurred?: number;
  /** Font size of label the when focused */
  fontSizeFocused?: number;
  /** Font size of label the when blurred */
  fontSizeBlurred?: number;
  /** Font color of label the when blurred */
  colorFocused?: string;
  /** Font color of label the when blurred */
  colorBlurred?: string;
}

/** Set global styles for all your floating-label-inputs*/
const setGlobalStyles: SetGlobalStyles = {
  /**Set global styles to all floating-label-inputs container*/
  containerStyles: undefined as ViewStyle | undefined,
  /**Set global custom styles to all floating-label-inputs labels*/
  customLabelStyles: undefined as CustomLabelProps | undefined,
  /**Set global styles to all floating-label-inputs input*/
  inputStyles: undefined as TextStyle | undefined,
  /**Set global styles to all floating-label-inputs label*/
  labelStyles: undefined as TextStyle | undefined,
  /**Set global styles to all floating-label-inputs show password container*/
  showPasswordContainerStyles: undefined as ViewStyle | undefined,
  /**Set global styles to all floating-label-inputs show password image*/
  showPasswordImageStyles: undefined as ImageStyle | undefined,
  /**Set global style to the countdown text */
  showCountdownStyles: undefined as TextStyle | undefined,
};

interface InputRef {
  focus(): void;
  blur(): void;
}

const FloatingLabelInput: React.ForwardRefRenderFunction<InputRef, Props> = (
  {
    label,
    mask,
    isPassword,
    maxLength,
    inputStyles,
    showCountdown,
    showCountdownStyles,
    labelStyles,
    darkTheme,
    countdownLabel,
    currencyDivider,
    maskType,
    onChangeText,
    secureTextEntry,
    customHidePasswordComponent,
    customShowPasswordComponent,
    isFocused,
    onBlur,
    onFocus,
    onTogglePassword,
    leftComponent,
    customHidePasswordImage,
    customLabelStyles = {},
    staticLabel = false,
    hint,
    hintTextColor,
    placeholder,
    placeholderTextColor,
    onSubmit,
    containerStyles,
    customShowPasswordImage,
    showPasswordContainerStyles,
    maxDecimalPlaces,
    multiline,
    showPasswordImageStyles,
    value = '',
    onSelectionChange,
    ...rest
  },
  ref,
) => {
  const [halfTop, setHalfTop] = useState(0);
  const [isFocusedState, setIsFocused] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const inputRef = useRef<any>(null);

  customLabelStyles = {
    fontSizeFocused: 10,
    fontSizeBlurred: 14,
    colorFocused: '#49658c',
    colorBlurred: '#49658c',
    ...setGlobalStyles?.customLabelStyles,
    ...customLabelStyles,
  };

  const [opacityAnimated] = useState(new Animated.Value(0));

  const [leftAnimated] = useState(
    new Animated.Value(
      staticLabel
        ? customLabelStyles?.leftFocused !== undefined
          ? customLabelStyles.leftFocused
          : 15
        : customLabelStyles != undefined &&
          customLabelStyles.leftBlurred !== undefined
        ? customLabelStyles.leftBlurred
        : 0,
    ),
  );

  const [topAnimated] = useState(
    new Animated.Value(
      staticLabel
        ? customLabelStyles?.topFocused !== undefined
          ? customLabelStyles.topFocused
          : 0
        : customLabelStyles.topBlurred
        ? customLabelStyles.topBlurred
        : 0,
    ),
  );

  useEffect(() => {
    if  (!staticLabel) {
      if  (isFocused === undefined) {
        if (value !== '' || isFocusedState) {
          setIsFocused(true);
        } else {
          if (value === '' || value === null) {
            setIsFocused(false);
          }
        }
      }
    }
  }, [value]);

  useEffect(() => {
    if  (!staticLabel) {
      if (isFocused !== undefined) {
        if (value !== '' || isFocused) {
          setIsFocused(true);
        } else  {
          setIsFocused(false);
        }
      }
    }
  }, [isFocused, value]);

  useEffect(() => {
    if  (isFocusedState) {
      animateFocus();
    } else  {
      animateBlur();
    }
  }, [isFocusedState]);

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current.focus();
    },
    blur() {
      inputRef.current.blur();
    },
  }));

  useEffect(() => {
    if  (customLabelStyles.topFocused === undefined && isFocusedState) {
      Animated.timing(topAnimated, {
        toValue: customLabelStyles.topFocused
          ? customLabelStyles.topFocused
          : -halfTop,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    } else  {
      if  (staticLabel) {
        Animated.parallel([
          Animated.timing(opacityAnimated, {
            toValue: 1,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(topAnimated, {
            toValue: customLabelStyles.topFocused
              ? customLabelStyles.topFocused
              : -halfTop,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]).start();;
      }
    }
  }, [halfTop]);;

  function animateFocus() {
    if  (!staticLabel) {
      Animated.parallel([
        Animated.timing(leftAnimated, {
          useNativeDriver: true,
          duration: 300,
          easing: Easing.linear,
          toValue: customLabelStyles.leftFocused
            ? customLabelStyles.leftFocused
            : 0,
        }),
        Animated.timing(topAnimated, {
          toValue: customLabelStyles.topFocused
            ? customLabelStyles.topFocused
            : -halfTop / 2,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }

  function animateBlur() {
    if  (!staticLabel) {
      Animated.parallel([
        Animated.timing(leftAnimated, {
          useNativeDriver: true,
          duration: 300,
          easing: Easing.linear,
          toValue: customLabelStyles.leftBlurred
            ? customLabelStyles.leftBlurred
            : 0,
        }),
        Animated.timing(topAnimated, {
          toValue: customLabelStyles.topBlurred
            ? customLabelStyles.topBlurred
            : 0,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }

  function handleFocus() {
    setIsFocused(true);
  }

  function handleBlur() {
    if (value === '') {
      setIsFocused(false);
    }
  }

  function setFocus() {
    inputRef.current?.focus();
  }

  function _toggleVisibility() {
    if  (onTogglePassword) {
      onTogglePassword(!secureText);
    }
    if (secureText) {
      setSecureText(false);
    } else {
      setSecureText(true);
    }
  }

  function onSubmitEditing() {
    if (onSubmit !== undefined) {
      onSubmit();
    }
  }

  let imgSource = darkTheme
    ? secureText
      ? customShowPasswordImage
        ? customShowPasswordImage
        : makeInvisibleBlack
      : customHidePasswordImage
      ? customHidePasswordImage
      : makeVisibleBlack
    : secureText
    ? customShowPasswordImage
      ? customShowPasswordImage
      : makeInvisibleWhite
    : customHidePasswordImage
    ? customHidePasswordImage
    : makeVisibleWhite;

  const style: TextStyle = {
    ...setGlobalStyles?.labelStyles,
    ...labelStyles,
    left: labelStyles?.left !== undefined ? labelStyles?.left : 5,
    fontSize: staticLabel ? (customLabelStyles?.fontSizeFocused !== undefined ? customLabelStyles.fontSizeFocused : 10) : !isFocusedState
      ? customLabelStyles.fontSizeBlurred
      : customLabelStyles.fontSizeFocused,
    color: !isFocusedState
      ? customLabelStyles.colorBlurred
      : customLabelStyles.colorFocused,
    alignSelf: 'center',
    position: 'absolute',
    flex: 1,
    zIndex: 999,
  };

  let input: TextStyle =
    inputStyles !== undefined
      ? inputStyles
      : setGlobalStyles?.inputStyles !== undefined
      ? setGlobalStyles.inputStyles
      : styles.input;;

  input = {
    ...input,
    flex: 1,
    color:
      input.color !== undefined ? input.color : customLabelStyles.colorFocused,
    zIndex: style?.zIndex !== undefined ? style.zIndex - 2 : 0,
  };

  containerStyles =
    containerStyles !== undefined
      ? containerStyles
      : setGlobalStyles?.containerStyles !== undefined
      ? setGlobalStyles?.containerStyles
      : styles.container;

  containerStyles = {
    ...containerStyles,
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: style?.zIndex !== undefined ? style.zIndex - 6 : 0,
  };

  let toggleButton =
    showPasswordContainerStyles !== undefined
      ? showPasswordContainerStyles
      : setGlobalStyles?.showPasswordContainerStyles !== undefined
      ? setGlobalStyles.showPasswordContainerStyles
      : styles.toggleButton;

  toggleButton = {
    ...toggleButton,
    alignSelf: 'center',
  };

  let img =
    showPasswordImageStyles !== undefined
      ? showPasswordImageStyles
      : setGlobalStyles?.showPasswordImageStyles !== undefined
      ? setGlobalStyles.showPasswordImageStyles
      : styles.img;

  img = {
    height: 25,
    width: 25,
    ...img,
  };

  const countdown = {
    ...styles.countdown,
    ...setGlobalStyles?.showCountdownStyles,
    ...showCountdownStyles,
  };

  function onChangeTextCallback(val: string) {
    if (maskType !== undefined || mask !== undefined) {
      if (maskType !== 'currency' && mask !== undefined) {
        let unmasked = val.replace(/[^0-9A-Za-z]/g, '');

  // pegar as posições dos caracteres especiais.
        let positions = [];
        for  (let i = 0; i < mask.length; i++) {
          if  (mask[i].match(/[^0-9A-Za-z]/)) {
            positions.push(i);
          }
        }

        let newValue = '';
        let offset = 0;
        for  (let j = 0; j < unmasked.length; j++) {
          // adicionar caracteres especiais
          while  (mask[j + offset]?.match(/[^0-9A-Za-z]/)) {
            newValue += mask[j + offset];
            offset++;
          }
          newValue += unmasked[j];
        }

        return onChangeText ? onChangeText(newValue) : false;
      } else if (maskType === 'currency') {
        let divider = '';
        let decimal = '';
        if (currencyDivider === ',') {
          divider = ',';
          decimal = '.';
        } else {
          divider = '.';
          decimal = ',';
        }
        if (value !== undefined && value.length < val.length) {
          if (val.includes(decimal)) {
            let intVal = val.split(decimal)[0].replace(/[,.]/g, '');
            let decimalValue = val.split(decimal)[1];
            if (intVal.length > 3) {
              let arr: string[] = [];
              for (let i = 0; i < intVal.length; i += 3) {
                arr.push(
                  intVal
                    .split('')
                    .splice(intVal.length - i, 3)
                    .join(''),
                );
              }

              arr = arr.reverse();
              arr.pop();
              let initial = arr.join('');
              if (intVal.includes(initial)) {
                intVal = intVal.replace(initial, '');
              }
              intVal = intVal + divider + arr.join(divider);
            }

            val = intVal + decimal + decimalValue;

            let decimalPlaces: number =
              maxDecimalPlaces !== undefined ? maxDecimalPlaces : 2;

            if (
              val.split(decimal)[1] !== undefined &&
              value.split(decimal)[1] !== undefined &&
              val.split(decimal)[1].length > value.split(decimal)[1].length &&
              value.split(decimal)[1].length === decimalPlaces
            ) {
              return;
            } else {
              if (val.split(decimal)[1].length > decimalPlaces) {
                val = val.slice(0, val.length - 1);
              }
            }
          } else {
            if (val.length > 3) {
              let arr: string[] = [];
              let unmasked = val.replace(/[,.]/g, '');
              for (let i = 0; i < unmasked.length; i += 3) {
                arr.push(
                  unmasked
                    .split('')
                    .splice(unmasked.length - i, 3)
                    .join(''),
                );
              }

              arr = arr.reverse();
              arr.pop();
              let initial = arr.join('');
              if (unmasked.includes(initial)) {
                unmasked = unmasked.replace(initial, '');
              }
              val = unmasked + divider + arr.join(divider);
            }
          }
        }
        return onChangeText ? onChangeText(val) : false;
      } else {
        return onChangeText ? onChangeText(val) : false;
      }
    } else {
      return onChangeText ? onChangeText(val) : false;
    }
  }

  function onLayout(event: LayoutChangeEvent) {
    var {height} = event.nativeEvent.layout;
    setHalfTop(
      (height +
        (!staticLabel
          ? style?.fontSize !== undefined
            ? style.fontSize
            : 0
          : 0)) /
        2,
    );;
  }

  return (
    <TouchableWithoutFeedback onPress={setFocus} onLayout={onLayout}>
      <View style={containerStyles}>
        {leftComponent && leftComponent}
        <View style={{flex: 1, flexDirection: 'row'}}>
          <Animated.Text
            onPress={setFocus}
            style={[
              style,
              {
                opacity: staticLabel
                  ? opacityAnimated.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    })
                  : labelStyles?.opacity
                  ? labelStyles.opacity
                  : setGlobalStyles?.labelStyles?.opacity
                  ? setGlobalStyles.labelStyles.opacity
                  : 1,
                transform: [
                  {translateX: leftAnimated},
                  {translateY: topAnimated},
                ],
              },
            ]}>
            {label}
          </Animated.Text>
          <TextInput
            value={value}
            onSubmitEditing={onSubmitEditing}
            secureTextEntry={
              isPassword !== undefined ? isPassword && secureText : false
            }
            onFocus={onFocus !== undefined ? onFocus : handleFocus}
            onBlur={onBlur !== undefined ? onBlur  : handleBlur}
            ref={inputRef}
            {...rest}
            maxLength={
              mask !== undefined
                ? mask.length
                : maxLength !== undefined
                ? maxLength
                : undefined
            }
            placeholderTextColor={hintTextColor}
            placeholder={(staticLabel ||isFocusedState) && hint ? hint : ''}
            multiline={multiline}
            onChangeText={onChangeTextCallback}
            style={input}
          />
          {isPassword && (
            <TouchableOpacity style={toggleButton} onPress={_toggleVisibility}>
              {secureText && customShowPasswordComponent !== undefined ? (
                customShowPasswordComponent
              ) : !secureText && customHidePasswordComponent !== undefined ? (
                customHidePasswordComponent
              ) : (
                <Image source={imgSource} resizeMode="contain" style={img} />
              )}
            </TouchableOpacity>
          )}
        </View>
        {showCountdown && maxLength && (
          <Text style={countdown}>
            {maxLength - (value ? value.length : 0)} {countdownLabel}
          </Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};
export {setGlobalStyles};
export default forwardRef(FloatingLabelInput);
