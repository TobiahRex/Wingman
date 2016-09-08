import { take, put, select } from 'redux-saga/effects'
import Types from '../Actions/Types'
import Actions from '../Actions/Creators'
import R from 'ramda'

// process STARTUP actions
export function * watchStartup () {
  yield take(Types.STARTUP)
  // const temp = yield select((state) => state.weather.temperature)
  //
  // if (!R.is(Number, temp)) {
  //   yield put(Actions.requestTemperature('San Francisco'))
  // }
  
}
