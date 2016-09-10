import React, {PropTypes} from 'react'
import { connect } from 'react-redux'
// import Voice from 'react-native-voice'
import {
  Alert,
  Image,
  ListView,
  NativeModules,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  TouchableHighlight,
  View,
} from 'react-native'
import { Images } from '../Themes'
import { Actions as NavigationActions } from 'react-native-router-flux'
import styles from './Styles/CategoriesScreenStyle'
import Actions from '../Actions/Creators'
import { firebase, firebaseDB } from '../Config/FirebaseConfig'
// For empty lists
import AlertMessage from '../Components/AlertMessageComponent'

console.log('NativeModules: ', NativeModules);
import { AudioRecorder, AudioUtils } from 'react-native-audio'
const firebaseAuth = firebase.auth()

class CategoriesScreen extends React.Component {
  constructor(props) {
    super(props)

    let dataSource = [
      { title: 'Commute',
        key: 'commute',
        image: 'http://www.healthline.com/hlcmsresource/images/News/mental-health/022215-commute-thumb.jpg'
      },
      {
        title: 'Road Rage',
        key: 'rage',
        image: 'http://i.huffpost.com/gen/1482570/images/o-ROAD-RAGE-facebook.jpg'
      },
      {
        title: 'Road Trip',
        key: 'trip',
        image: 'http://getbg.net/upload/full/574017_povorot_polya_gorizont_zarya_nebo_mestnost_doroga__2048x1360_(www.GetBg.net).jpg'
      },
      {
        title: 'Music',
        key: 'music',
        image: 'https://media.licdn.com/mpr/mpr/AAEAAQAAAAAAAAXpAAAAJDE0NWQ1ZmM2LTdkNTgtNGY0NC04MWM4LTg5OTQ2Yzk5NzJjMQ.jpg'
      },
      {
        title: 'Sports',
        key: 'sports',
        image: 'https://zeno-devlab.s3.amazonaws.com/16793/photo/image/1455747797'
      },
      {
        title: 'Technology',
        key: 'tech',
        image: 'http://images.dowjones.com/wp-content/uploads/sites/43/2015/10/11014854/Technology_CareersTeams_406x230.jpg'
      },
      {
        title: 'Nearby Users',
        key: 'nearby',
        image: 'http://media.gettyimages.com/videos/radar-screen-video-id102082578?s=640x640'
      }
    ]

    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

    this.state = {
      dataSource: ds.cloneWithRows(dataSource),
      currentTime: 0.0,
      recording: false,
      stoppedRecording: false,
      stoppedPlaying: false,
      playing: false,
      finished: false
    }
  }
  prepareRecordingPath (audioPath) {
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: 'Low',
      AudioEncoding: 'AAC'
    })
  }
  componentDidMount () {
    let audioPath = AudioUtils.DocumentDirectoryPath + '/test.aac'
    this.prepareRecordingPath(audioPath);
    AudioRecorder.onProgress = (data) => {
      this.setState({ currentTime: Math.floor(data.currentTime) })
    }
    AudioRecorder.onFinish = (data) => {
      this.setState({ finished: data.finished })
      console.log('Finished Recording: ', data.finished);
    }
  }
  _renderButton (title, onPress, active) {
    let style = (active) ? styles.activeButtonText : styles.buttonText
    return (
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={style}>
          {title}
        </Text>
      </TouchableOpacity>
    )
  }
  _pause () {
    if (this.state.recording) {
      AudioREcorder.pauseRecording()
      this.setState({ stoppedRecording: true, recording: false })
    }
    else if (this.state.playing) {
      AudioRecorder.pausePlaying()
      this.setState({ playing: false, stoppedPlaying: true })
    }
  }
  _stop () {
    if (this.state.recording) {
      AudioRecorder.stopRecording()
      this.setState({ stoppedRecording: true, recording: false })
    } else if (this.state.playing) {
      AudioRecorder.stopPlaying()
      this.setState({ playing: false, stoppedPlaying: true })
    }
  }
  _record () {
    if (this.state.stoppedRecording) {
      let audioPath = AudioUtils.DocumentDirectoryPath + '/test.aac'
      this.prepareRecordingPath(audioPath)
    }
    AudioRecorder.startRecording()
    this.setState({ recording: true, playing: false })
  }
  _play () {
    if (this.state.recording) {
      this._stop()
      this.setState({ recording: false })
    }
    AudioRecorder.playRecording()
    this.setState({ playing: true })
  }
  // <ListView
  //   contentContainerStyle={styles.listContent}
  //   dataSource={this.state.dataSource}
  //   renderRow={this._renderRow} />
  //
  // <View style={styles.container}>
  //   <TouchableOpacity onPress={this._startRecognizing}>
  //     <Image
  //       style={styles.button}
  //       source={Images.button}
  //       />
  //   </TouchableOpacity>
  // </View>
  render () {
    return (
      <ScrollView >



        <View style={exampleStyles.container}>
          <View style={exampleStyles.controls}>
            {this._renderButton("RECORD", () => {this._record()}, this.state.recording )}
            {this._renderButton("STOP", () => {this._stop()} )}
            {this._renderButton("PAUSE", () => {this._pause()} )}
            {this._renderButton("PLAY", () => {this._play()}, this.state.playing )}
            <Text style={exampleStyles.progressText}>{this.state.currentTime}s</Text>
          </View>
        </View>

      </ScrollView>
    )
  }
  _renderRow (rowData) {
    return (
      <View style={styles.row}>
        <Image
          source={{ uri: rowData.image }}
          style={styles.imageStyle}
          />
        <Text style={styles.boldLabel}>{rowData.title}</Text>
      </View>
    )
  }
  _beginEvaluation = () => {
    setTimeout(() => {
      let results = this.state.results[0] || this.state.partialResults[0] || 'results are empty'
      results = results.match(/commute|road rage|road trip|music|sports|technology|nearby users/gi)[0]

      switch(results) {
        case 'commute': {
          console.info('Ok Going to Commute')
          this.props.setActiveCategory('Commute')
          NavigationActions.activeCategory()
          break
        }
        case 'road rage': {
          console.info('Ok going to Road Rage')
          this.props.setActiveCategory('Road Rage')
          NavigationActions.activeCategory()
          break
        }
        case 'road trip': {
          console.info('Ok going to Road Trip')
          this.props.setActiveCategory('Road Trip')
          NavigationActions.activeCategory()
          break
        }
        case 'music': {
          console.info('Ok going to Music')
          this.props.setActiveCategory('Music')
          NavigationActions.activeCategory()
          break
        }
        case 'sports': {
          console.info('Ok going to sports')
          this.props.setActiveCategory('Sports')
          NavigationActions.activeCategory()
          break
        }
        case 'technology': {
          console.info('Ok going to technology')
          this.props.setActiveCategory('Technology')
          NavigationActions.activeCategory()
          break
        }
        case 'nearby users': {
          console.info('Ok going to nearby users')
          this.props.setActiveCategory('Nearby Users')
          NavigationActions.activeCategory()
          break
        }
        default: {
          console.error('Could not recognize that option')
          Alert.alert('Error','Sorry I could\'nt understand you. Please try again. ')
          break
        }
      }
    }, 5000)
  }
}
CategoriesScreen.propTypes = {
  setActiveCategory: PropTypes.func,
}
const mapStateToProps = (state) => {
  return {
    // ...redux state to props here
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    setActiveCategory: (category) => dispatch(Actions.setActiveCategory(category))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CategoriesScreen)

// TODO: mapStateToProps - Wingman - Messages - UserCommand
var exampleStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2b608a",
  },
  controls: {
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  progressText: {
    paddingTop: 50,
    fontSize: 50,
    color: "#fff"
  },
  button: {
    padding: 20,
    backgroundColor: "#fff"
  },
  disabledButtonText: {
    color: '#eee'
  },
  buttonText: {
    fontSize: 20,
    color: "#fff"
  },
  activeButtonText: {
    fontSize: 20,
    color: "#B81F00"
  }
})
