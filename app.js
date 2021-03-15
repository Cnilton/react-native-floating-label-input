/** Code for index.tsx for testing locally */

/*
import {AppRegistry} from 'react-native';
import App from './app';
// import {name as appName} from './app.json';

AppRegistry.registerComponent('react_native_floating_label_input', () => App);
*/


import FloatingLabelInput from './src';
import React, {useState} from 'react'
import {Text} from 'react-native'

export default function App(){
    const [val, setVal] = useState('')
    return (<><Text>Teste</Text><FloatingLabelInput label="valor" value={val} onChangeText={(vauel)=>setVal(vauel)} /></>)
}