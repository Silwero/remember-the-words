import './App.css';

import Logo from './assets/images/logo.svg';

import React, { Component } from 'react';
import HeaderNav from './components/BaseComponents/HeaderNav/HeaderNav';
import { Link, Switch, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from './store/actions/actions';

import Auth from './containers/Auth/Auth';
import Logout from './containers/Auth/Logout';
import AddTranslation from './containers/AddTranslation/AddTranslation';
import MyTranslations from './containers/MyTranslations/MyTranslations';
import Home from './containers/Home/Home';
import ChooseCorrect from './containers/Training/ChooseCorrect/ChooseCorrect';

class App extends Component {
  componentWillMount() {
    this.props.checkAuth();
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
              <HeaderNav />
            </div>
          </div>
        </header>
        <main className="content">
          <div className="container">
            <Switch>
              <Route exact path='/' component={Home}/>
              <Route path='/auth' component={Auth}/>
              <Route path='/add-translation' component={AddTranslation}/>
              <Route path='/logout' component={Logout}/>
              <Route path='/my-translations' component={MyTranslations}/>
              <Route path='/choose-correct' component={ChooseCorrect}/>
            </Switch>
          </div>
        </main>
        <footer className="footer">

        </footer>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    checkAuth: () => dispatch(actions.checkAuth())
  }
}

export default withRouter(connect(null, mapDispatchToProps)(App));
