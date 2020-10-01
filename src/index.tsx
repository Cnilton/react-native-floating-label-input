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
  NativeSyntheticEvent,
  TextInputSelectionChangeEventData,
} from 'react-native';
import { styles } from './styles';

import makeVisibleWhite from './assets/make_visible_white.png';
import makeInvisibleWhite from './assets/make_invisible_white.png';
import makeVisibleBlack from './assets/make_visible_black.png';
import makeInvisibleBlack from './assets/make_invisible_black.png';

interface Props extends TextInputProps {
  /**Style to the container of whole component*/
  containerStyles?: ViewStyle;
  /**Changes the color for hide/show password image*/
  darkTheme?: true | false | undefined;
  /**Value for the label, same as placeholder */
  label: string;
  /**Style to the label */
  labelStyles?: TextStyle;
  /**Set this to true if is password to have a show/hide input and secureTextEntry automatically*/
  isPassword?: true | false | undefined;
  /**Callback for action submit on the keyboard */
  onSubmit?: Function;
  /**Style to the show/hide password container */
  showPasswordContainerStyles?: ViewStyle;
  /**Style to the show/hide password image */
  showPasswordImageStyles?: ImageStyle;
  /**Style to the input */
  inputStyles?: TextStyle;
  /**Path to your custom image for show/hide input */
  customShowPasswordImage?: string;
  /**Custom Style for position, size and color for label, when it's focused or blurred*/
  customLabelStyles?: {
    leftFocused: number;
    leftBlurred: number;
    topFocused: number;
    topBlurred: number;
    fontSizeFocused: number;
    fontSizeBlurred: number;
    colorFocused: string;
    colorBlurred: string;
  };
  /**Required if onFocus or onBlur is overrided*/
  isFocused?: boolean;
  /**Set a mask to your input*/
  mask?: string;
  /**Set mask type*/
  maskType?: 'currency' | 'phone' | 'date' | 'card';
  /**Set currency thousand dividers*/
  currencyDivider: ',' | '.';
  /**Maxinum number of decimal places allowed for currency mask. */
  maxDecimalPlaces?: number;
  /**Changes the input from single line input to multiline input*/
  multiline?: true | false | undefined;
  /**Maxinum number of characters allowed. Overriden by mask if present */
  maxLength?: number;
  /**Shows the remaining number of characters allowed to be typed if maxLength or mask are present */
  showCountdown?: true | false | undefined;
  /**Style to the countdown text */
  showCountdownStyles?: TextStyle;
  /**Label for the remaining number of characters allowed shown after the number */
  countdownLabel?: string;
}

/**Set global styles for all your floating-label-inputs*/
const setGlobalStyles = {
  /**Set global styles to all floating-label-inputs container*/
  containerStyles: {} as ViewStyle,
  /**Set global custom styles to all floating-label-inputs labels*/
  customLabelStyles: {},
  /**Set global styles to all floating-label-inputs input*/
  inputStyles: {} as TextStyle,
  /**Set global styles to all floating-label-inputs label*/
  labelStyles: {} as TextStyle,
  /**Set global styles to all floating-label-inputs show password container*/
  showPasswordContainerStyles: {} as ViewStyle,
  /**Set global styles to all floating-label-inputs show password image*/
  showPasswordImageStyles: {} as ImageStyle,
  /**Set global style to the countdown text */
  showCountdownStyles: {} as TextStyle,
};

interface InputRef {
  focus(): void;
  blur(): void;
}

const FloatingLabelInput: React.ForwardRefRenderFunction<InputRef, Props> = (
  props,
  ref,
) => {
  const [selection, setSelection] = useState(
    {} as { start: number; end: number },
  );
  const [isFocused, setIsFocused] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const inputRef = useRef<any>(null);

  const customLabelStyles = {
    leftFocused: 5,
    leftBlurred: 5,
    topFocused: 0,
    topBlurred: 14,
    fontSizeFocused: 10,
    fontSizeBlurred: 14,
    colorFocused: '#49658c',
    colorBlurred: '#49658c',
    ...setGlobalStyles.customLabelStyles,
    ...props.customLabelStyles,
  };

  const [leftAnimated] = useState(
    new Animated.Value(customLabelStyles.leftBlurred),
  );
  const [topAnimated] = useState(
    new Animated.Value(customLabelStyles.topBlurred),
  );

  useEffect(() => {
    if (props.isFocused === undefined) {
      if (props.value !== '' || selection.end !== undefined) {
        handleFocus();
        setIsFocused(true);
      } else {
        handleBlur();
        setIsFocused(false);
      }
    }
  }, [props.value]);

  useEffect(() => {
    if (props.isFocused !== undefined) {
      setIsFocused(props.isFocused);
      Animated.parallel([
        Animated.timing(leftAnimated, {
          useNativeDriver: true,
          duration: 300,
          easing: Easing.linear,
          toValue: props.isFocused
            ? customLabelStyles.leftFocused
            : customLabelStyles.leftBlurred,
        }),
        Animated.timing(topAnimated, {
          toValue: props.isFocused
            ? customLabelStyles.topFocused
            : customLabelStyles.topBlurred,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [props.isFocused]);

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current.focus();
    },
    blur() {
      inputRef.current.blur();
    },
  }));

  function handleFocus() {
    Animated.parallel([
      Animated.timing(leftAnimated, {
        useNativeDriver: true,
        duration: 300,
        easing: Easing.linear,
        toValue: customLabelStyles.leftFocused,
      }),
      Animated.timing(topAnimated, {
        toValue: customLabelStyles.topFocused,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
    setIsFocused(true);
  }

  function handleBlur() {
    if (props.value === '' || props.value == null) {
      Animated.parallel([
        Animated.timing(leftAnimated, {
          useNativeDriver: true,
          duration: 300,
          easing: Easing.linear,
          toValue: customLabelStyles.leftBlurred,
        }),
        Animated.timing(topAnimated, {
          toValue: customLabelStyles.topBlurred,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start();
      setIsFocused(false);
    }
    setSelection({} as { start: number; end: number });
  }

  function setFocus() {
    inputRef.current?.focus();
  }

  function _toggleVisibility() {
    if (secureText) {
      setSecureText(false);
    } else {
      setSecureText(true);
    }
  }

  function onSubmitEditing() {
    if (props.onSubmit !== undefined) {
      props.onSubmit();
    }
  }

  let imgSource = props.darkTheme
    ? secureText
      ? makeVisibleBlack
      : makeInvisibleBlack
    : secureText
    ? makeVisibleWhite
    : makeInvisibleWhite;

  const style: Object = {
    zIndex: 3,
    position: 'absolute',
    left: 0,
    paddingLeft: 10,
    fontSize: !isFocused
      ? customLabelStyles.fontSizeBlurred
      : customLabelStyles.fontSizeFocused,
    color: !isFocused
      ? customLabelStyles.colorBlurred
      : customLabelStyles.colorFocused,
    ...setGlobalStyles.labelStyles,
    ...props.labelStyles,
  };

  const input: Object = {
    ...styles.input,
    color: customLabelStyles.colorFocused,
    ...setGlobalStyles.inputStyles,
    ...props.inputStyles,
  };

  const containerStyles: Object = {
    ...styles.container,
    ...setGlobalStyles.containerStyles,
    ...props.containerStyles,
  };

  const toggleButton = {
    ...styles.toggleButton,
    ...setGlobalStyles.showPasswordContainerStyles,
    ...props.showPasswordContainerStyles,
  };

  const img = {
    ...styles.img,
    ...setGlobalStyles.showPasswordImageStyles,
    ...props.showPasswordImageStyles,
  };

  const countdown = {
    ...styles.countdown,
    ...setGlobalStyles.showCountdownStyles,
    ...props.showCountdownStyles,
  };

  return (
    <View style={containerStyles}>
      <Animated.Text
        onPress={setFocus}
        style={[
          style,
          {
            transform: [
              { translateX: leftAnimated },
              { translateY: topAnimated },
            ],
          },
        ]}
      >
        {props.label}
      </Animated.Text>
      <TextInput
        onSubmitEditing={onSubmitEditing}
        secureTextEntry={
          props.isPassword !== undefined
            ? props.isPassword && secureText
            : false
        }
        onFocus={handleFocus}
        onBlur={handleBlur}
        ref={inputRef}
        {...props}
        onSelectionChange={(
          evt: NativeSyntheticEvent<TextInputSelectionChangeEventData>,
        ) => {
          setSelection(evt.nativeEvent.selection);
          if (props.onSelectionChange !== undefined) {
            props.onSelectionChange(evt);
          }
        }}
        maxLength={
          props.mask !== undefined
            ? props.mask.length
            : props.maxLength !== undefined
            ? props.maxLength
            : undefined
        }
        multiline={props.multiline}
        onChangeText={(val: string) => {
          if (props.maskType !== undefined || props.mask !== undefined) {
            if (props.maskType !== 'currency' && props.mask !== undefined) {
              if (val.length <= props.mask.length) {
                let newValue = '';

                for (let i = 0; i < val.length; i++) {
                  if (
                    props.mask[i].match(/[^0-9A-Za-z]/) &&
                    props.mask[i] !== val[i]
                  ) {
                    newValue += props.mask[i] + val[i];
                  } else {
                    newValue += val[i];
                  }
                }
                props.onChangeText && props.onChangeText(newValue);
              }
            } else if (props.maskType === 'currency') {
              let divider = '';
              let decimal = '';
              if (props.currencyDivider === ',') {
                divider = ',';
                decimal = '.';
              } else {
                divider = '.';
                decimal = ',';
              }
              if (
                props.value !== undefined &&
                props.value.length < val.length
              ) {
                if (val.includes(decimal)) {
                  let intVal = val.split(decimal)[0].replace(/[,.]/g, '');
                  let decimalValue = val.split(decimal)[1];
                  console.log(intVal);
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

                  let maxDecimalPlaces =
                    props.maxDecimalPlaces !== undefined
                      ? props.maxDecimalPlaces
                      : 2;

                  if (
                    val.split(decimal)[1] !== undefined &&
                    props.value.split(decimal)[1] !== undefined &&
                    val.split(decimal)[1].length >
                      props.value.split(decimal)[1].length &&
                    props.value.split(decimal)[1].length === maxDecimalPlaces
                  ) {
                    return;
                  } else {
                    if (val.split(decimal)[1].length > maxDecimalPlaces) {
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
              props.onChangeText && props.onChangeText(val);
            } else {
              props.onChangeText && props.onChangeText(val);
            }
          } else {
            props.onChangeText && props.onChangeText(val);
          }
        }}
        style={input}
      />
      {props.isPassword ? (
        <TouchableOpacity style={toggleButton} onPress={_toggleVisibility}>
          <Image
            source={
              props.customShowPasswordImage !== undefined
                ? props.customShowPasswordImage
                : imgSource
            }
            resizeMode="contain"
            style={img}
          />
        </TouchableOpacity>
      ) : (
        <View />
      )}
      {props.showCountdown && props.maxLength && (
        <Text style={countdown}>
          {props.maxLength - (props.value ? props.value.length : 0)}{' '}
          {props.countdownLabel}
        </Text>
      )}
    </View>
  );
};
export { setGlobalStyles };
export default forwardRef(FloatingLabelInput);
