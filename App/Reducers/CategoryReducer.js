import Types from '../Actions/Types'
import Immutable from 'seamless-immutable'
import { createReducer } from 'reduxsauce'

export const INITIAL_STATE = Immutable({
  category: null,
  category_messages: null,
  category_users: null,
  user_message: null,
  user_message_audio: null,
  error: null
})

const receivedMessages = (state, action) =>
state.merge({ category_messages: action.messages })

const receivedUsers = (state, action) =>
state.merge({ category_users: action.users })

const receivedActiveCategory = (state, action) =>
state.merge({ category: action.category })

const receivedMsgAudio = (state, action) =>
state.merge({ user_message_audio: action.data.snd_url })

const receivedMsgError = (state, action) =>
state.merge({ error: action.error })

const ACTION_HANDLERS = {
  [Types.CAT_MSGS_RECEIVED]: receivedMessages,
  [Types.CAT_USERS_RECEIVED]: receivedUsers,
  [Types.SET_ACTIVE_CATEGORY]: receivedActiveCategory,
  [Types.RECEIVED_MSG_AUDIO]: receivedMsgAudio,
  [Types.RECEIVED_MSG_ERROR]: receivedMsgError
}

export default createReducer(INITIAL_STATE, ACTION_HANDLERS)
