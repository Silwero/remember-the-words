import './App.css';

import Logo from './assets/images/logo.svg';
import { routes } from './Routing/Routing';

import React, { Component } from 'react';
import HeaderNav from './components/BaseComponents/HeaderNav/HeaderNav';
import { Link, Switch, Route, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from './store/actions/actions';
import { TransitionGroup, CSSTransition } from "react-transition-group";

import HamburgerBtn from './components/BaseComponents/HeaderNav/HamburgerBtn/HamburgerBtn';
import Overlay from './components/BaseComponents/Overlay/Overlay';
import Message from './components/BaseComponents/Message/Message';
import Loader from './components/Loader/Loader';
// import Canvas from './components/Canvas/Canvas';

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
    const routing = routes.map(el => {
      if(this.props.isAuth) {
        return (el.authOnly || !el.unAuthOnly) ? <Route key={el.path} exact={el.exact} path={el.path} component={el.component}/> : null;
      } else {
        return (!el.authOnly) ? <Route key={el.path} exact={el.exact} path={el.path} component={el.component}/> : null
      }
    });

    routing.push(<Redirect key="redirect" to="/" />);
    console.log(routing);

    let pageClass = '';
    if (this.props.location.pathname === '/choose-correct' || this.props.location.pathname === '/input-translation') {
      pageClass = ' training'
    }

    return (
      <div className={"App" + pageClass}>
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
            <TransitionGroup className="animation-wrapper">
              <CSSTransition key={this.props.location.pathname} classNames="animate" timeout={500}>
                <Switch location={this.props.location}>
                  {routing}
                </Switch>
              </CSSTransition>
            </TransitionGroup>
          </div>
        </main>
        {/*<Canvas />*/}
        {this.props.isLoading ? <Loader /> : null}
        <Overlay click={this.closeMenuOnOverlayClick} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    message: state.message,
    isLoading: state.isLoading,
    isAuth: state.isAuth
  }
}

const mapDispatchToProps = dispatch => {
  return {
    checkAuth: () => dispatch(actions.checkAuth())
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
