import React, { PropTypes } from 'react'
import {
  ScrollView,
  View,
  Text
} from 'react-native'
import Styles from './Styles/SettingsStyle'
import { connect } from 'react-redux'

class SettingsScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    return (
      <ScrollView
        contentContainerStyle={{justifyContent: 'center'}}
        style={[Styles.container, {height: this.state.visibleHeight}]}>
        <View style={Styles.row}>
          <Text style={Styles.rowLabel}>Settings Component</Text>
        </View>
      </ScrollView>
    )
  }
}
export default connect(null, null)(SettingsScreen)
