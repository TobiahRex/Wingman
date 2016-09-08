import React, {PropTypes} from 'react'
import {
  ScrollView,
  Text,
  Image,
  View,
  Alert
} from 'react-native'
import { Images } from '../Themes'
import { connect } from 'react-redux'
import RoundedButton from '../Components/RoundedButton'
import Actions from '../Actions/Creators'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { firebase, firebaseDB } from '../Config/FirebaseConfig'
const firebaseAuth = firebase.auth()
// Styles
import styles from './Styles/PresentationScreenStyle'

class PresentationScreen extends React.Component {
  static propTypes = {
    loginScreen: PropTypes.func,
    register: PropTypes.func,
    settings: PropTypes.func,
    logoutAttempt: PropTypes.func,
    logoutSuccess: PropTypes.func,
    logoutFailure: PropTypes.func,
    receivedActiveUsers: PropTypes.func,
  }
  logout = () => {
    const activeUser = firebaseAuth.currentUser
    this.props.logoutAttempt()
    firebaseAuth.signOut()
    .then(() => {
      this.props.logoutSuccess()
      firebaseDB.ref(`active/${activeUser.uid}`).remove()
    })
    .then(() => {
      firebaseDB.ref('active').once('value', (activeSnap) => {
        const users = activeSnap.val()
        this.props.receivedActiveUsers(users)
        Alert.alert('Logout Successful', 'You\'ve been successfully logged out.')
      })
    })
    .catch((err) => {
      this.props.logoutFailure()
      console.error('LOGOUT FAIL: ', err.message)
      Alert.alert('Logout Failed', `Could not log you out: ${err.message}`)
    })
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <ScrollView style={styles.container}>
          {/*<Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <View style={styles.centered}>
        <Image source={Images.clearLogo} style={styles.logo} />
        </View>

        <View style={styles.section} >
        <Text style={styles.sectionText} >
        Default screens for development, debugging, and alpha testing
        are available below.
        </Text>
        </View>*/}

        <RoundedButton onPress={this.props.loginScreen}>
          Login
        </RoundedButton>

        <RoundedButton onPress={this.props.register}>
          Register
        </RoundedButton>

        <RoundedButton onPress={this.props.settings}>
          Settings
        </RoundedButton>

        <RoundedButton onPress={this.logout}>
          Logout
        </RoundedButton>

        <RoundedButton onPress={this.props.categories}>
          Categories
        </RoundedButton>

        <RoundedButton onPress={this.props.activeCategory}>
          Category
        </RoundedButton>

      </ScrollView>
    </View>
  )
}
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loginScreen: NavigationActions.login,
    register: NavigationActions.register,
    settings: NavigationActions.settings,
    categories: NavigationActions.categories,
    activeCategory: NavigationActions.activeCategory,
    logoutAttempt: () => dispatch(Actions.logoutAttempt()),
    logoutSuccess: () => dispatch(Actions.logoutSuccess()),
    logoutFailure: () => dispatch(Actions.logoutFailure()),
    receivedActiveUsers: (users) => dispatch(Actions.receivedActiveUsers(users))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PresentationScreen)
