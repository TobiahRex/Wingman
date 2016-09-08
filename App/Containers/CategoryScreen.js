import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import {
  ScrollView,
  Text,
  View
} from 'react-native'
import Actions from '../Actions/Creators'
import styles from './Styles/SettingsStyle'
import { Metrics } from '../Themes'
import RecordMessage from './RecordMessageComponent'

class CategoryScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      que: this.props.que,
      old: this.props.old,
      category: this.props.category,
      visibleHeight: Metrics.screenHeight
    }
  }
  render () {
    return (
      <ScrollView
        contentContainerStyle={{justifyContent: 'center'}}
        style={[styles.container, {height: this.state.visibleHeight}]}>
        <Text style={styles.label}>{this.state.category.toUpperCase()}</Text>

        <View style={styles.row}>
          <RecordMessage />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Chat Window</Text>
        </View>
      </ScrollView>
    )
  }
}
CategoryScreen.propTypes = {
  getAudio: PropTypes.func
}
const mapStateToProps = (state) => {
  return {
    que: state.messages.que,
    old: state.messages.old,
    category: state.activeCategory.category,
    category_messages: state.activeCategory.category_messages,
    category_users: state.activeCategory.category_users,
    user_message: state.activeCategory.user_message,
    user_message_audio: state.activeCategory.user_message_audio,
    error: state.activeCategory.error
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    getAudio: (msg, msgVoice) => dispatch(Actions.getMsgAudio(msg, msgVoice))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CategoryScreen)
