import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import {
  Alert,
  Image,
  Keyboard,
  LayoutAnimation,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native'
import Actions from '../Actions/Creators'
import Styles from './Styles/LoginScreenStyle'
import { Images, Metrics } from '../Themes'
import { firebase, firebaseDB } from '../Config/FirebaseConfig'
import I18n from '../I18n/I18n.js'
const firebaseAuth = firebase.auth()
class LoginScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      email: 'bob@bob.com',
      password: 'tobiah',
      visibleHeight: Metrics.screenHeight,
      topLogo: { width: Metrics.screenWidth },
      location: this.props.location,
      lasPosition: null
    }
    this.watchID = null
  }
  componentWillMount () {
    navigator.geolocation.getCurrentPosition((position) => {
      let location = JSON.stringify(position)
      console.info('location: ', location)
      this.setState({ location })
    }, (err) => console.info('Could not Fetch location: ', err))
    this.watchID = navigator.geolocation.getCurrentPosition((position) => {
      let lastPosition = JSON.stringify(position)
      this.setState({ lastPosition })
    })
    this.keyboardDidShow = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow)
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide)
  }
  componentWillUnmount () {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
    navigator.geolocation.clearWatch(this.watchID)
  }
  keyboardDidShow = (e) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    let newSize = Metrics.screenHeight - e.endCoordinates.height
    this.setState({
      visibleHeight: newSize,
      topLogo: { width: 100, height: 70 }
    })
  }
  keyboardDidhide = (e) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    this.setState({
      visibleHeight: Metrics.screenHeight,
      topLogo: { width: Metrics.screenWidth }
    })
  }
  render () {
    console.info('location: \n', JSON.parse(this.state.location))
    console.info('lastPosition: \n', JSON.parse(this.state.lastPosition))
    const { email, password } = this.this.state
    const { attempting } = this.props
    const editable = !attempting
    const textInputStyle = editable ? Styles.textInput : Styles.textInputReadonly
    return (
      
    )
  }
}
LoginScreen.propTypes = {
  dispatch: PropTypes.func,
  attempting: PropTypes.bool,
  close: PropTypes.func,
  loginAttempt: PropTypes.func,
  loginSuccess: PropTypes.func,
  loginFailure: PropTypes.func,
  receivedUser: PropTypes.func,
  receivedActiveUsers: PropTypes.func
}
