import React, {PropTypes} from 'react'
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
  LayoutAnimation,
  Alert
} from 'react-native'
import { connect } from 'react-redux'
import Styles from './Styles/LoginScreenStyle'
import Actions from '../Actions/Creators'
import {Images, Metrics} from '../Themes'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { firebase, firebaseDB } from '../Config/FirebaseConfig'
import I18n from '../I18n/I18n.js'
const firebaseAuth = firebase.auth()
class LoginScreen extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    attempting: PropTypes.bool,
    close: PropTypes.func,
    loginAttempt: PropTypes.func,
    loginSuccess: PropTypes.func,
    loginFailure: PropTypes.func,
    receivedUser: PropTypes.func,
    receivedActiveUsers: PropTypes.func
  }
  constructor (props) {
    super(props)
    this.state = {
      email: 'bob@bob.com',
      password: 'tobiah',
      visibleHeight: Metrics.screenHeight,
      topLogo: { width: Metrics.screenWidth },
      location: this.props.location,
      lastPosition: null
    }
    this.watchID = null
  }
  componentWillMount () {
    navigator.geolocation.getCurrentPosition((position) => {
      let location = JSON.stringify(position)
      console.info('location: ', location)
      this.setState({ location })
    }, (err) => console.info('Could not Fetch location: ', err))
    this.watchID = navigator.geolocation.watchPosition((position) => {
      let lastPosition = JSON.stringify(position)
      this.setState({ lastPosition })
    })
    // Using keyboardWillShow/Hide looks 1,000 times better, but doesn't work on Android
    // TODO: Revisit this if Android begins to support - https://github.com/facebook/react-native/issues/3468
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow)
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide)
  }
  componentWillUnmount () {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
    navigator.geolocation.clearWatch(this.watchID)
  }
  keyboardDidShow = (e) => {
    // Animation types easeInEaseOut/linear/spring
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    let newSize = Metrics.screenHeight - e.endCoordinates.height
    this.setState({
      visibleHeight: newSize,
      topLogo: { width: 100, height: 70 }
    })
  }
  keyboardDidHide = (e) => {
    // Animation types easeInEaseOut/linear/spring
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    this.setState({
      visibleHeight: Metrics.screenHeight,
      topLogo: {width: Metrics.screenWidth}
    })
  }
  render () {
    console.info('location: \n', JSON.parse(this.state.location))
    console.info('lasstposition: \n', JSON.parse(this.state.lastPosition))
    const { email, password } = this.state
    const { attempting } = this.props
    const editable = !attempting
    const textInputStyle = editable ? Styles.textInput : Styles.textInputReadonly
    return (
      <ScrollView
        contentContainerStyle={{justifyContent: 'center'}} style={[Styles.container, {height: this.state.visibleHeight}]}>

        <View style={Styles.form}>
          <View style={Styles.row}>
            <Text style={Styles.rowLabel}>{I18n.t('username')}</Text>
            <TextInput
              ref='username'
              style={textInputStyle}
              value={email}
              editable={editable}
              keyboardType='default'
              returnKeyType='next'
              onChangeText={this._handleChangeEmail}
              underlineColorAndroid='transparent'
              onSubmitEditing={() => this.refs.password.focus()}
              placeholder={I18n.t('username')} />
          </View>

          <View style={Styles.row}>
            <Text style={Styles.rowLabel}>{I18n.t('password')}</Text>
            <TextInput
              ref='password'
              style={textInputStyle}
              value={password}
              editable={editable}
              keyboardType='default'
              returnKeyType='go'
              secureTextEntry
              onChangeText={this._handleChangePassword}
              underlineColorAndroid='transparent'
              placeholder={I18n.t('password')} />
          </View>

          <View style={[Styles.loginRow]}>

            <TouchableOpacity style={Styles.loginButtonWrapper} onPress={this._handlePressLogin}>
              <View style={Styles.loginButton}>
                <Text style={Styles.loginText}>{I18n.t('signIn')}</Text>
              </View>
            </TouchableOpacity>
            <Text>   </Text>
            <TouchableOpacity style={Styles.loginButtonWrapper} onPress={this.props.close}>
              <View style={Styles.loginButton}>
                <Text style={Styles.loginText}>{I18n.t('cancel')}</Text>
              </View>
            </TouchableOpacity>

          </View>
        </View>

      </ScrollView>
    )
  }
  _handleChangeEmail = (text) => {
    this.setState({ email: text })
  }
  _handleChangePassword = (text) => {
    this.setState({ password: text })
  }
  _handlePressLogin = () => {
    const { email, password } = this.state
    this.props.loginAttempt()

    firebaseAuth.signInWithEmailAndPassword(email, password)
    .then((user) => {
      this.props.loginSuccess()
      let location = JSON.parse(this.state.location || this.state.lastPosition)
      firebaseDB.ref(`active/${user.uid}`).set({
        location,
        login: Date.now(),
        user: user.uid,
      })
    })
    .then(() => {
      let user = firebaseAuth.currentUser
      firebaseDB.ref(`settings/${user.uid}`).once('value', (settingsSnap) => {
        firebaseDB.ref(`users/${user.uid}`).once('value', (profileSnap) => {
          firebaseDB.ref('active').once('value', (activeSnap) => {
            user = profileSnap.val()
            let settings = settingsSnap.val()
            let users = activeSnap.val()
            let location = JSON.parse(this.state.location || this.state.lastPosition)
            this.props.receivedUser(user, settings, location)
            this.props.receivedActiveUsers(users)
            NavigationActions.categories()
          })
        })
      })
    })
    .catch((err) => {
      this.props.loginFailure()
      Alert.alert('Sign In Error', err.message)
    })
  }
}
const mapStateToProps = (state) => {
  return {
    attempting: state.auth.attempting,
    location: state.user.location,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    close: NavigationActions.pop,
    loginAttempt: () => dispatch(Actions.loginAttempt()),
    loginSuccess: () => dispatch(Actions.loginSuccess()),
    loginFailure: () => dispatch(Actions.loginFailure()),
    receivedUser: (user, settings, location) => dispatch(Actions.receivedUser(user, settings, location)),
    receivedActiveUsers: (users) => dispatch(Actions.receivedActiveUsers(users))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
