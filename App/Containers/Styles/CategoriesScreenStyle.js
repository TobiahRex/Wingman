import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors } from '../../Themes'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  button: {
    width: 120,
    height: 120,
    marginBottom: 70
  },
  container: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Metrics.navBarHeight,
    backgroundColor: Colors.background
  },
  row: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    margin: Metrics.baseMargin,
    backgroundColor: Colors.fire,
    borderRadius: Metrics.smallMargin
  },
  boldLabel: {
    fontWeight: 'bold',
    alignSelf: 'center',
    color: Colors.snow,
    textAlign: 'center',
    marginBottom: Metrics.smallMargin
  },
  label: {
    alignSelf: 'center',
    color: Colors.snow,
    textAlign: 'center'
  },
  listContent: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  imageStyle: {
    marginTop: 10,
    height: 70,
    width: 70,
    borderRadius: 50
  }
})
