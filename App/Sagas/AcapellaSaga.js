import { take, call, put } from 'redux-saga/effects'
import Types from '../Actions/Types'
import Actions from '../Actions/Creators'

export default (api) => {
  function * worker (msg, msgVoice) {
    const response = yield call(api.getAudioMsg, msg, msgVoice)
    console.info('response: ', response)
    if (response.ok) {
      yield put(Actions.receivedAcapellaMessage(response.data))
    } else {
      yield put(Actions.receivedAcapellaError({ error: response.problem }))
    }
  }

  function * watcher () {
    while (true) {
      const action = yield take(Types.GET_MSG_AUDIO)
      const { msg, msgVoice } = action
      yield call(worker, msg, msgVoice)
    }
  }

  return {
    watcher,
    worker
  }
}
