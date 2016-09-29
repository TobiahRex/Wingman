import Types from '../Actions/Types'
import Immutable from 'seamless-immutable'
import { createReducer } from 'reduxsauce'

export const INITIAL_STATE = Immutable({
  users: null
})

const received = (state, action) =>
state.merge({ users: action.users })
/*
calling '.merge' is a 'seamless-immutable' feature.
it's purpose is to simply replace the piece of state you pass it and nothing else.
*/

const ACTION_HANDLERS = {
  [Types.ACTIVE_USERS_RECEIVED]: received
}

export default createReducer(INITIAL_STATE, ACTION_HANDLERS)
