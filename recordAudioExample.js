/**
* Sample React Native App
* https://github.com/facebook/react-native
*/
import React from 'react'
import {
  NativeModules,
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
 } from 'react-native'
const { RNRecordAudio, AudioPlayerManager } = NativeModules
console.log('NativeModules: ', NativeModules);
console.log('AudioPlayerManager: ', AudioPlayerManager)
class testComp extends React.Component {
  componentDidMount () {
    // no actions in mount
  }
  startRecord = () => {
    console.log('in start')
    RNRecordAudio.startRecord(
      'file.m4a', // fileName
      function errorCallback(results) {
        console.log('JS Error: ' + results['errMsg'])
      },
      function successCallback(results) {
        console.log('JS Success: ' + results['successMsg'])
      }
    )
  }
  stopRecord = () => {
    console.log("in stop")
    RNRecordAudio.stopRecord(
      "file.m4a", // fileName
      function errorCallback(results) {
        console.log('JS Error: ' + results['errMsg'])
      },
      function successCallback(results) {
        console.log('JS Success: ' + results['successMsg'])
      }
    )
  }
  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Check Audio Status - View Xcode Log
        </Text>
        <TouchableHighlight onPress={this.startRecord}>
          <Text style={styles.instructions}>
            Press to Start Recording
          </Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.stopRecord}>
          <Text style={styles.instructions}>
            Press to Stop Recording
          </Text>
        </TouchableHighlight>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
})

// AppRegistry.registerComponent('testComp', () => testComp)
