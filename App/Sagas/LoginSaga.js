import { take, put, call } from 'redux-saga/effects'
import Types from '../Actions/Types'
import Actions from '../Actions/Creators'

// attempts to login
export function * loginAttempt (password) {
  if (password === '') {
    yield put(Actions.loginFailure('EMPTY PASSWORD FIELD'))
  } else {
    yield put(Actions.loginAttempt())
  }
}

// a daemonized version which waits for LOGIN_ATTEMPT signals
export function * watchLoginAttempt () {
  // daemonize
  while (true) {
    // wait for LOGIN_ATTEMPT actions to arrive
    const { password } = yield take(Types.LOGIN_ATTEMPT)
    // call loginAttempt to perform the actual work
    yield call(loginAttempt, password)
  }
}
