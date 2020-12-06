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
  /** Style to the container of whole component */
  containerStyles?: ViewStyle;
  /** Changes the color for hide/show password image */
  darkTheme?: true | false ;
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
  isPassword?: true | false ;
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
  multiline?: true | false ;
  /** Maxinum number of characters allowed. Overriden by mask if present */
  maxLength?: number;
  /** Shows the remaining number of characters allowed to be typed if maxLength or mask are present */
  showCountdown?: true | false ;
  /** Style to the countdown text */
  showCountdownStyles?: TextStyle;
  /** Label for the remaining number of characters allowed shown after the number */
  countdownLabel?: string;
}

interface SetGlobalStyles {
  /** Set global styles to all floating-label-inputs container*/
  containerStyles?: ViewStyle,
  /** Set global custom styles to all floating-label-inputs labels*/
  customLabelStyles?: CustomLabelProps,
  /** Set global styles to all floating-label-inputs input*/
  inputStyles?: TextStyle,
  /** Set global styles to all floating-label-inputs label*/
  labelStyles?: TextStyle,
  /** Set global styles to all floating-label-inputs show password container*/
  showPasswordContainerStyles?: ViewStyle,
  /** Set global styles to all floating-label-inputs show password image*/
  showPasswordImageStyles?: ImageStyle,
  /** Set global style to the countdown text */
  showCountdownStyles?: TextStyle,
}

interface CustomLabelProps {
  leftFocused?: number;
  leftBlurred?: number;
  topFocused?: number;
  topBlurred?: number;
  fontSizeFocused?: number;
  fontSizeBlurred?: number;
  colorFocused?: string;
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

interface SelectionProps {
  start: number;
  end: number;
}

const FloatingLabelInput: React.ForwardRefRenderFunction<InputRef, Props> = (
  {label,mask,isPassword,maxLength, inputStyles,showCountdown,showCountdownStyles,labelStyles,darkTheme,countdownLabel,currencyDivider,maskType,onChangeText,
  customHidePasswordImage,customLabelStyles={},staticLabel, hint, hintTextColor, placeholder, placeholderTextColor,onSubmit,containerStyles,customShowPasswordImage,showPasswordContainerStyles, maxDecimalPlaces, multiline, showPasswordImageStyles,value="",onSelectionChange, ...rest},
  ref,
) => {
  const [selection,setSelection] = useState({} as SelectionProps)
  const [isFocused, setIsFocused] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const inputRef = useRef<any>(null);

  console.log(setGlobalStyles)

  customLabelStyles = {
    fontSizeFocused: 10,
    fontSizeBlurred: 14,
    colorFocused: '#49658c',
    colorBlurred: '#49658c',
    ...setGlobalStyles?.customLabelStyles,
    ...customLabelStyles,
  };

  const [leftAnimated] = useState(
    new Animated.Value(
      staticLabel ? (customLabelStyles?.leftFocused !== undefined ? customLabelStyles.leftFocused : 15):
      customLabelStyles != undefined &&
      customLabelStyles.leftBlurred !== undefined
        ? customLabelStyles.leftBlurred
        : 0,
    ),
  );
  
  const [topAnimated] = useState(
    new Animated.Value(staticLabel ? ( customLabelStyles?.topFocused !== undefined ? customLabelStyles.topFocused: -10):
      customLabelStyles.topBlurred ? customLabelStyles.topBlurred : 13,
    ),
  );

  useEffect(() => {
    if(!staticLabel){
    if (isFocused === undefined) {
      if (value !== '' || selection?.end !== undefined) {
        handleFocus();
      } else {
        handleBlur();
      }
    }
  }
  }, [value]);

  useEffect(() => {
    if(!staticLabel){

    if (isFocused !== undefined) {
      setIsFocused(isFocused);
      Animated.parallel([
        Animated.timing(leftAnimated, {
          useNativeDriver: true,
          duration: 300,
          easing: Easing.linear,
          toValue: isFocused
            ? customLabelStyles.leftFocused
              ? customLabelStyles.leftFocused
              : 0
            : customLabelStyles.leftBlurred
            ? customLabelStyles.leftBlurred
            : 0,
        }),
        Animated.timing(topAnimated, {
          toValue: isFocused
            ? customLabelStyles.topFocused
              ? customLabelStyles.topFocused
              : 0
            : customLabelStyles.topBlurred
            ? customLabelStyles.topBlurred
            : 13,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }
  }, [isFocused]);

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current.focus();
    },
    blur() {
      inputRef.current.blur();
    },
  }));

  function handleFocus() {
    if(!staticLabel){
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
            : 0,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start();
    }
    
    setIsFocused(true);
  }

  function handleBlur() {
    if(!staticLabel){
    if (value === '' || value === null) {
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
            : 13,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start();
      setIsFocused(false);
    } 
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
    if (onSubmit !== undefined) {
      onSubmit();
    }
  }

  let imgSource = darkTheme
    ? secureText
      ? customShowPasswordImage ? customShowPasswordImage : makeInvisibleBlack
      : customHidePasswordImage ?  customHidePasswordImage : makeVisibleBlack
    : secureText
    ? customShowPasswordImage ? customShowPasswordImage : makeInvisibleWhite
    : customHidePasswordImage ? customHidePasswordImage : makeVisibleWhite;

  const style: TextStyle = {
    left: labelStyles?.left !== undefined ? labelStyles?.left : 10,
    fontSize: staticLabel? (customLabelStyles?.fontSizeFocused !== undefined ? customLabelStyles.fontSizeFocused : 10) : !isFocused
      ? customLabelStyles.fontSizeBlurred
      : customLabelStyles.fontSizeFocused,
    color: !isFocused
      ? customLabelStyles.colorBlurred
      : customLabelStyles.colorFocused,
    ...setGlobalStyles?.labelStyles,
    ...labelStyles,
    position: 'absolute',
    flex:1,
    zIndex: 999,
  };

  let input: TextStyle = inputStyles !== undefined ? inputStyles : setGlobalStyles?.inputStyles !== undefined ? setGlobalStyles.inputStyles : styles.input
  
  input = {
    flex:1,
    ...input,
    color: input.color !== undefined ? input.color : customLabelStyles.colorFocused,
    zIndex: style?.zIndex !== undefined ? style.zIndex - 2 : 0,
  };

  containerStyles = containerStyles !== undefined ? containerStyles : setGlobalStyles?.containerStyles !== undefined ? setGlobalStyles?.containerStyles : styles.container;

  containerStyles = {
    flexDirection: 'row',
    ...containerStyles,
    zIndex: style?.zIndex !== undefined ? style.zIndex - 6: 0
  }

  let toggleButton = showPasswordContainerStyles !== undefined ? showPasswordContainerStyles : setGlobalStyles?.showPasswordContainerStyles !== undefined ? setGlobalStyles.showPasswordContainerStyles : styles.toggleButton;
  
  toggleButton = {
    ...toggleButton,
    alignSelf: 'center',
  }

  let img = showPasswordImageStyles !== undefined ? showPasswordImageStyles : setGlobalStyles?.showPasswordImageStyles !== undefined ? setGlobalStyles.showPasswordImageStyles : styles.img;

  img = {
    height: 25,
    width:25, 
    ...img,
  }

  const countdown = {
    ...styles.countdown,
    ...setGlobalStyles?.showCountdownStyles,
    ...showCountdownStyles,
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
        {label}
      </Animated.Text>
      {/* {staticLabel && <Text
        // onPress={setFocus}
        style={[
          style,
          {
            zIndex: style?.zIndex !== undefined ? style.zIndex - 4 : 0,
            top: -10,
            backgroundColor: '#fff',
            // width: 44,
            // height:30
          },
        ]}
      >{label}</Text>} */}
      <TextInput
      value={value}
        onSubmitEditing={onSubmitEditing}
        secureTextEntry={
          isPassword !== undefined
            ? isPassword && secureText
            : false
        }
        onFocus={handleFocus}
        onBlur={handleBlur}
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
        placeholder={staticLabel && hint ? hint : ''}
        multiline={multiline}
        onSelectionChange={(
          evt: NativeSyntheticEvent<TextInputSelectionChangeEventData>,
        ) => {
          setSelection(evt.nativeEvent.selection);
          if (onSelectionChange !== undefined) {
            onSelectionChange(evt);
          }
        }}
        onChangeText={(val: string) => {
          if (maskType !== undefined || mask !== undefined) {
            if (maskType !== 'currency' && mask !== undefined) {          
              let unmasked = val.replace(/[^0-9A-Za-z]/g,'');
            
            // pegar as posições dos caracteres especiais.
              let positions = [];
              for(let i =0;i<mask.length;i++){
                if(mask[i].match(/[^0-9A-Za-z]/)){
                  positions.push(i);
                }
              }

              let newValue = ""
              let offset = 0;
              for(let j=0;j<unmasked.length;j++){
                // adicionar caracteres especiais 
                while(mask[j+offset]?.match(/[^0-9A-Za-z]/)){
                  newValue += mask[j+offset]
                  offset++;
                }
                newValue += unmasked[j]
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
              if (
                value !== undefined &&
                value.length < val.length
              ) {
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
                    maxDecimalPlaces !== undefined
                      ? maxDecimalPlaces
                      : 2;

                  if (
                    val.split(decimal)[1] !== undefined &&
                    value.split(decimal)[1] !== undefined &&
                    val.split(decimal)[1].length >
                      value.split(decimal)[1].length &&
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
        }}
        style={input}
      />
      {isPassword && (
        <TouchableOpacity style={toggleButton} onPress={_toggleVisibility}>
          <Image
            source={imgSource}
            resizeMode="contain"
            style={img}
          />
        </TouchableOpacity>
      )}
      {showCountdown && maxLength && (
        <Text style={countdown}>
          {maxLength - (value ? value.length : 0)}{' '}
          {countdownLabel}
        </Text>
      )}
    </View>
  );
};
export { setGlobalStyles };
export default forwardRef(FloatingLabelInput);
