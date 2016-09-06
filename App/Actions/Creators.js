import Types from './Types'

const receivedUser = (user, settings, location) =>
({ type: Types.USER_RECEIVED, user, settings, location })

const receivedActiveUsers = (users) =>
({ type: Types.ACTIVE_USERS_RECEIVED, users })

const authChange = (username, email, uid, photo) =>
({ type: Types.AUTH_CHANGE, username, email, uid, photo })

const registerAttempt = () =>
({ type: Types.REGISTER_ATTEMPT })

const registerSuccess = () =>
({ type: Types.REGISTER_SUCCESS })

const registerFailure = () =>
({ type: Types.REGISTER_FAILURE })

const startup = () => ({ type: Types.STARTUP })

/**
 Makes available all the action creators we've created.
 */
export default {
  startup,

  receivedUser,
  receivedActiveUsers,
  authChange,

  registerAttempt,
  registerSuccess,
  registerFailure,

  loginAttempt,
  loginFailure,
  loginSuccess,

  setActiveCategory,

  getAudioMsg,
  receivedAcapellaMessage,
  receivedAcapellaError
}
