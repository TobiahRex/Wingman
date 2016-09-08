import { combineReducers } from 'redux'
import auth from './LoginReducer'
import user from './UserReducer'
import activeUsers from './ActiveUsersReducer'
import activeCategory from './CategoryReducer'
import messages from './MessagesReducer'
// import WeatherReducer from './WeatherReducer'

// glue all the reducers together into 1 root reducer
export default combineReducers({
  auth,
  user,
  activeUsers,
  activeCategory,
  messages
})

// Put reducer keys that you do NOT want stored to persistence here
export const persistentStoreBlacklist = ['auth', 'user', 'activeUsers', 'activeCategory']
// OR put reducer keys that you DO want stored to persistence here (overrides blacklist)
// export const persistentStoreWhitelist = []
