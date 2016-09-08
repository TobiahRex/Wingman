import Types from '../Actions/Types'
import Immutable from 'seamless-immutable'
import { createReducer } from 'reduxsauce'

export const INITIAL_STATE = Immutable({
  username: null,
  errorCode: null,
  attempting: false
})

const registerAttempt = (state) =>
state.merge({
  attempting: true
})

const registerSuccess = (state, action) =>
state.merge({
  active: true,
  attempting: false
})

// login attempts
const attempt = (state, action) =>
state.merge({ attempting: true })

// successful logins
const success = (state, action) =>
state.merge({ attempting: false, errorCode: null, username: action.username })

// login failure
const failure = (state, action) =>
state.merge({ attempting: false, errorCode: action.errorCode })

// logout
const logout = (state, action) =>
state.merge({ username: null })

const change = (state, action) =>
state.merge({
  attempting: false,
  active: action.uid ? true : false
})

// map our types to our handlers
const ACTION_HANDLERS = {
  [Types.REGISTER_ATTEMPT]: registerAttempt,
  [Types.REGISTER_SUCCESS]: registerSuccess,
  [Types.REGISTER_FAILURE]: failure,
  [Types.LOGIN_ATTEMPT]: attempt,
  [Types.LOGIN_SUCCESS]: success,
  [Types.LOGIN_FAILURE]: failure,
  [Types.LOGOUT]: logout,
  [Types.AUTH_CHANGE]: change
}

export default createReducer(INITIAL_STATE, ACTION_HANDLERS)
