import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import {
  Alert,
  Keyboard,
  LayoutAnimation,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import Actions from '../Actions/Creators'
import I18n from '../I18n/I18n.js'
import { Metrics } from '../Themes'
import styles from './Styles/LoginScreenStyle'
import { firebase, firebaseDB } from '../Config/FirebaseConfig'

const firebaseAuth = firebase.auth()

class RegisterScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      username: 'Tobiah Rex',
      email: 'bob@bob.com',
      photoUrl: 'http://iconizer.net/files/Impressions/orig/robot.png',
      password: 'tobiah',
      passwordVerify: 'tobiah',
      visibleHeight: Metrics.screenHeight,
      location: this.props.location,
      lasPosition: null
    }
    this.watchID = null
  }
  componentWillMount () {
    navigator.geolocation.getCurrentPosition((position) => {
      let location = JSON.stringify(position)
      this.setState({ location })
    }, (err) => console.info('Could not Fetch location: ', err))
    this.watchID = navigator.geolocation.watchPosition((position) => {
      let lastPosition = JSON.stringify(position)
      this.setState({ lastPosition })
    })
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow)
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide)
  }
  componentWillUnmount () {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }
  keyboardDidShow = (e) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    let newSize = Metrics.screenHeight - e.endCoordinates.height
    this.setState({ visibleHeight: newSize })
  }
  keyboardDidHide = (e) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    this.setState({ visibleHeight: Metrics.screenHeight })
  }
  render () {
    console.info('location: \n', JSON.parse(this.state.location), '\nlastPosition: \n', JSON.parse(this.state.lastPosition))
    const { email, password, passwordVerify, username } = this.state
    const { attempting } = this.props
    const editable = !attempting
    return (
      <ScrollView
        contentContainerStyle={{justifyContent: 'center'}}
        style={[styles.container, {height: this.state.visibleHeight}]}>
        <Text>Register</Text>
        <View style={styles.form}>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>
              Username
            </Text>
            <TextInput
              ref='username'
              placeholder='Han Solo'
              onChangeText={this._setUsername}
              value={username}
              editable={editable}
              keyboardType='default'
              returnKeyType='next'
              onSubmitEditing={() => this.refs.email.focuse()}
              style={styles.textInput}
              />
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>
              Email
            </Text>
            <TextInput
              ref='email'
              placeholder='trex@tobiahrex.com'
              onChangeText={this._setEmail}
              value={email}
              editable={editable}
              keyboardType='default'
              returnKeyType='next'
              onSubmitEditing={() => this.refs.password.focus()}
              style={styles.textInput}
            />
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>
              {I18n.t('password')}
            </Text>
            <TextInput
              ref='password'
              placeholder='Password'
              onChangeText={this._setPassword}
              value={password}
              editable={editable}
              keyboardType='default'
              returnKeyType='next'
              onSubmitEditing={() => this.refs.passwordConfirm.focus()}
              secureTextEntry
              style={styles.textInput}
              />
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>
              Confirm Password
            </Text>

            <TextInput
              ref='passwordConfirm'
              placeholder='Password'
              onChangeText={this._confirmPassword}
              value={passwordVerify}
              editable={editable}
              keyboardType='default'
              returnKeyType='go'
              onSubmitEditing={this._confirmPassword}
              secureTextEntry
              style={styles.textInput}
              />
          </View>

          <View style={styles.loginRow}>
            <TouchableOpacity style={styles.loginButtonWrapper}
              onPress={this._handleRegister}>
              <View style={styles.loginButton}>
                <Text style={styles.loginText}>
                  Register
                </Text>
              </View>
            </TouchableOpacity>
            <Text>   </Text>
            <TouchableOpacity
              style={styles.loginButtonWrapper}
              onPress={this.props.close}>
              <View style={styles.loginButton}>
                <Text style={styles.loginText}>
                  Cancel
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    )
  }
  _setUsername = (text) => this.setState({ username: text })
  _setEmail = (text) => this.setState({ email: text })
  _setPassword = (text) => this.setState({ password: text })
  _confirmPassword = (text) => this.setState({ passwordVerify: text })
  _handleRegister = () => {
    const { email, password, passwordVerify } = this.state

    if (password !== passwordVerify) Alert.alert('Password Error', 'Passwords do not match.')

    this.props.registerAttempt()
    firebaseAuth.createUserWithEmailAndPassword(email, password)
    .then((newUser) => {
      this.props.registerSuccess()
      newUser.updateProfile({ displayName: this.state.username })
    })
    .then(() => {
      let user = firebaseAuth.currentUser
      let location = JSON.parse(this.state.location || this.state.lastPosition)
      firebaseDB.ref(`active/${user.uid}`).set({
        location,
        login: Date.now(),
        user: user.uid
      })
      firebaseDB.ref(`settings/${user.uid}`).set({
        searchDistance: 10,
        distance: 'Mi.',
        favorites: 'empty',
        voice: 'empty'
      })
      firebaseDB.ref(`users/${user.uid}`).set({
        username: this.state.username,
        email: user.email,
        id: user.uid,
        photoUrl: this.state.photoUrl,
        lastLogin: Date.now()
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
            NavigationActions.settings()
          })
        })
      })
    })
    .catch((err) => {
      this.props.registerFailure()
      console.error('firebase Error: ', err.message)
      Alert.alert('Register Error', err.message)
    })
  }
}
RegisterScreen.propTypes = {
  loginScreen: PropTypes.func,
  attempting: PropTypes.bool,
  registerAttempt: PropTypes.func,
  registerSuccess: PropTypes.func,
  registerFailure: PropTypes.func,
  receivedUser: PropTypes.func,
  receivedActiveUsers: PropTypes.func
}
const mapStateToProps = (state) => {
  return {
    attempting: state.auth.attempting,
    location: state.user.location
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    close: NavigationActions.pop,
    registerAttempt: () => dispatch(Actions.registerAttempt()),
    registerSuccess: (newUser) => dispatch(Actions.registerSuccess(newUser)),
    registerFailure: () => dispatch(Actions.registerFailure()),
    receivedUser: (user, settings, location) => dispatch(Actions.receivedUser(user, settings, location)),
    receivedActiveUsers: (users) => dispatch(Actions.receivedActiveUsers(users))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen)
