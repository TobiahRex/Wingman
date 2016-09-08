import Types from '../Actions/Types'
import Immutable from 'seamless-immutable'
import { createReducer } from 'reduxsauce'

export const INITIAL_STATE = Immutable({
  old: null,
  que: null
})

const receivedFiltered = (state, action) =>
state.merge({ que: action.messages })

const receivedOldMessage = (state, action) =>
state.merge({ old: action.message })

export const ACTION_HANDLERS = {
  [Types.receivedFiltered]: receivedFiltered,
  [Types.receivedOldMessage]: receivedOldMessage
}

export default createReducer(INITIAL_STATE, ACTION_HANDLERS)
