import './App.css';

import Logo from './assets/images/logo.svg';

import React, { Component } from 'react';
import HeaderNav from './components/BaseComponents/HeaderNav/HeaderNav';
import { Link, Switch, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from './store/actions/actions';
import { AnimatedSwitch } from 'react-router-transition';

import Auth from './containers/Auth/Auth';
import Logout from './containers/Auth/Logout';
import AddTranslation from './containers/AddTranslation/AddTranslation';
import MyTranslations from './containers/MyTranslations/MyTranslations';
import Home from './containers/Home/Home';
import ChooseCorrect from './containers/Training/ChooseCorrect/ChooseCorrect';
import InputTranslations from './containers/Training/InputTranslations/InputTranslations';
import HamburgerBtn from './components/BaseComponents/HeaderNav/HamburgerBtn/HamburgerBtn';
import Overlay from './components/BaseComponents/Overlay/Overlay';
import Message from './components/BaseComponents/Message/Message';

class App extends Component {

  componentWillMount() {
    this.props.checkAuth();
  }

  mobileMenuToggle = (target) => {
    target.classList.toggle('is-active');
    document.querySelector('body').classList.toggle('mobile-menu-opened');
  }

  closeMenuOnOverlayClick = (target) => {
    document.querySelector('body').classList.remove('mobile-menu-opened');
    document.querySelector('.hamburger').classList.remove('is-active');
  }

  render() {
    return (
      <div className="App">
        <header className="header">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center">
              <div className="header-logo">
                <Link to="/" title="Remember the words">
                  <img src={ Logo } alt="Remember the words"/>
                  RTW
                </Link>
              </div>
              <HeaderNav click={this.closeMenuOnOverlayClick} />
              <HamburgerBtn click={this.mobileMenuToggle} />
            </div>
          </div>
        </header>
        <main className="content">
           {Object.keys(this.props.message).length ? <Message type={this.props.message.type} message={this.props.message.text} /> : null }
          <div className="container">
            <AnimatedSwitch
              atEnter={{ opacity: 0 }}
              atLeave={{ opacity: 0 }}
              atActive={{ opacity: 1 }}
              className="switch-wrapper"
            >
                <Route exact path='/' component={Home}/>
                <Route path='/auth' component={Auth}/>
                <Route path='/add-translation' component={AddTranslation}/>
                <Route path='/logout' component={Logout}/>
                <Route path='/my-translations' component={MyTranslations}/>
                <Route path='/choose-correct' component={ChooseCorrect}/>
                <Route path='/input-translation' component={InputTranslations}/>
            </AnimatedSwitch>
          </div>
        </main>
        <footer className="footer">

        </footer>
        <Overlay click={this.closeMenuOnOverlayClick} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    message: state.message
  }
}

const mapDispatchToProps = dispatch => {
  return {
    checkAuth: () => dispatch(actions.checkAuth())
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
