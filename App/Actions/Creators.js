import Types from './Types'

const receivedUser = (user, seettings, location) =>
({ type: Types.USER_RECEIVED, user, settings, location })

const receivedActiveUsers = (users) =>
({ type: Types.ACTIVE_USERS_RECEIVED, users })

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
