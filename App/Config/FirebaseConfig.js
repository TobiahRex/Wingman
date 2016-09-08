import Types from '../Actions/Types'
import Actions from '../Actions/Creators'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { dispatch } from '../../index.ios'
import firebase from 'firebase'
import Geofire from 'geofire'

var config = {
  apiKey: 'AIzaSyD0Nig7XcTpGY5KukFNR1cc3SWm_GvYXHs',
  authDomain: 'raptochat-8b55b.firebaseapp.com',
  databaseURL: 'https://raptochat-8b55b.firebaseio.com',
  storageBucket: 'raptochat-8b55b.appspot.com'
}

firebase.initializeApp(config)
const firebaseDB = firebase.database()

firebaseDB.ref('active').once('value', (snapshot) => {
  const users = snapshot.val()
  dispatch(Actions.receivedActiveUsers(users))
})

const activeUser = firebase.auth().currentUser
if (activeUser) {
  console.warn('User logged in: ', activeUser.uid)
} else {
  console.info('NO users logged in.')
}

firebase.auth().onAuthStateChanged((user) => {
  console.log('authStateCHANGE: ', user)
  if (user) {
    setSettingsListener()
    setUserListener()
    setActiveUserListener()
  } else {
    NavigationActions.presentationScreen()
  }
})

function setSettingsListener () {
  firebaseDB.ref('settings').ref('users').on('child_added', (snapshot) => {
    const userSettings = snapshot.val()
    dispatch({ types: Types.USER_SETTINGS_RECEIVED, userSettings })
  })
}

function setUserListener (userID) {
  const id = userID
  firebaseDB.ref(`users/${id}`).on('child_added', (snapshot) => {
    const userUpdate = snapshot.val()
    dispatch({ types: Types.USER_UPDATES_RECEIVED, userUpdate })
  })
}

function setActiveUserListener () {
  firebaseDB.ref('active').on('value', (snapshot) => {
    const users = snapshot.val()
    dispatch({ type: Types.ACTIVE_USERS_RECIEVED, users })
  })
}
export {
  firebase,
  firebaseDB
}
