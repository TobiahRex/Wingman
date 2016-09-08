import React from 'react'
import { Router, Scene } from 'react-native-router-flux'
import { connect } from 'react-redux'
import Styles from './Styles/NavigationContainerStyle'
import NavigationDrawer from './NavigationDrawer'
import NavItems from './NavItems'

// screens identified by the router
import PresentationScreen from '../Containers/PresentationScreen'
import LoginScreen from '../Containers/LoginScreen'
import RegisterScreen from '../Containers/RegisterScreen'
import SettingsScreen from '../Containers/SettingsScreen'
import CategoriesScreen from '../Containers/CategoriesScreen'
import ActiveCategory from '../Containers/CategoryScreen'
/* **************************
* Documentation: https://github.com/aksonov/react-native-router-flux
***************************/

class NavigationRouter extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      category: this.props.category
    }
  }
  render () {
    return (
      <Router>

        <Scene key='drawer' component={NavigationDrawer}>

          <Scene key='drawerChildrenWrapper'
            navigationBarStyle={Styles.navBar}
            titleStyle={Styles.title}
            leftButtonIconStyle={Styles.leftButton} rightButtonTextStyle={Styles.rightButton}>

            <Scene initial
              key='presentationScreen'
              component={PresentationScreen}
              title='WINGMAN'
              renderLeftButton={NavItems.hamburgerButton} />

            <Scene key='login'
              component={LoginScreen}
              title='Login' />

            <Scene key='register'
              component={RegisterScreen}
              title='Register' />

            <Scene key='settings'
              component={SettingsScreen}
              title='Settings' />

            <Scene key='categories'
              component={CategoriesScreen}
              title='Categories' />

            <Scene key='activeCategory'
              component={ActiveCategory}
              title={this.props.category || 'Chat'} />

          </Scene>
        </Scene>
      </Router>
    )
  }
}

const mapStateToProps = (state) => {
  console.log('state.activeCategory: ', state.activeCategory.category)
  return {
    category: state.activeCategory.category
  }
}
const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavigationRouter)
