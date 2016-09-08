import Types from '../Actions/Types'
import Immutable from 'seamless-immutable'
import { createReducer } from 'reduxsauce'

export const INITIAL_STATE = Immutable({
  uid: null,
  username: null,
  email: null,
  lastLogin: null,
  location: null,
  photoUrl: null,
  settings: null
})

const received = (state, action) =>
state.merge({
  uid: action.user.id,
  username: action.user.username,
  email: action.user.email,
  lastLogin: action.user.lastLogin,
  location: action.location,
  registered: action.user.registered,
  photoUrl: action.user.photoUrl,
  settings: action.settings
})

const logout = (state) =>
state.merge({
  uid: null,
  username: null,
  email: null,
  lastLogin: null,
  location: null,
  photoUrl: null,
  settings: null
})

const ACTION_HANDLERS = {
  [Types.USER_RECEIVED]: received,
  [Types.LOGOUT_SUCCESS]: logout
}

export default createReducer(INITIAL_STATE, ACTION_HANDLERS)
