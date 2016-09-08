import React from 'react'
import { connect } from 'react-redux'
import Actions from '../Actions/Creators'
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  WebView
} from 'react-native'
import { Images } from '../Themes'
import styles from './Styles/RecordMessageComponentStyle'

class RecordMessage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      msg: '',
      msgVoice: 'willfromafar22k',
      user_message: this.props.user_message,
      user_message_audio: this.props.user_message_audio,
      recognized: false,
      error: '',
      end: '',
      started: false,
      results: [],
      partialResults: []
    }
  }
  _getWebView = () => {
    if (this.state.user_message_audio) {
      return <WebView
        source={{uri: this.state.user_message_audio}}
        style={{marginTop: 20}}
        mediaPlaybackRequiresUserAction={false} />
    } else {
      return <Text>Empty</Text>
    }
  }
  render () {
    console.log('this.state: ', this.state.results)
    return (
      <ScrollView>
        {this._getWebView}

        <View style={styles.container}>
          <TouchableOpacity onPress={this._startRecognizing}>
            <Image
              style={styles.recordButton}
              source={Images.button}
              />
          </TouchableOpacity>
          <Text style={styles.textColor} >New Message</Text>
        </View>
      </ScrollView>
    )
  }
  _beginEvaluation = () => {
    setTimeout(() => {
      let msgResult = this.state.results[0] || this.partialResults[0] || ''
      this.setState({ msg: msgResult })
      this.props.getAudioMsg(msgResult, this.state.msgVoice)
    }, 5000)
  }
  _onSpeechStart = (e) => {
    this.setState({ started: true })
  }
  _onSpeechRecognized = (e) => {
    this.setState({ recognized: true })
  }
  _onSpeechEnd = (e) => {
    this._beginEvaluation()
    this.setState({ end: true })
  }
  _onSpeechError = (e) => {
    this.setState({ error: e.error })
    Alert.alert('Error', 'Sorry I could not recognize that option')
  }
  _onSpeechResults = (e) => {
    this.setState({ results: e.value })
  }
  _onSpeechPartialResults = (e) => {
    this.setState({ partialResults: e.value })
  }
  _startRecognizing = (e) => {
    this.setState({
      recognized: false,
      error: '',
      end: '',
      started: false,
      results: [],
      partialResults: [],
    })
    const error = Voice.start('en')
    if (error) {
      ToastAndroid.show(error, ToastAndroid.SHORT)
    }
  }
}
const mapStateToProps = (state) => {
  return {
    user_message: state.activeCategory.user_message,
    user_message_audio: state.activeCategory.user_message_audio
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    getAudioMsg: (msg, msgVoice) => dispatch(Actions.getAudioMsg(msg, msgVoice))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(RecordMessage)
