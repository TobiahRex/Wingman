import React, { PropTypes } from 'react'
import { View, StatusBar } from 'react-native'
import { Provider } from 'react-redux'
import Actions from './Actions/Creators'
import DebugSettings from './Config/DebugSettings'
import { database } from './Config/FirebaseConfig'
import NavigationRouter from './Navigation/NavigationRouter'
import styles from './Containers/Styles/RootStyle'

// import './Config/PushConfig'



export default class Root extends React.Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  }

  renderApp () {
    console.disableYellowBox = !DebugSettings.yellowBox
    return (
      <Provider store={this.props.store}>
        <View style={styles.applicationView}>
          <StatusBar barStyle='light-content' />
          <NavigationRouter />
        </View>
      </Provider>
    )
  }

  render () {
    return this.renderApp()
  }
}
