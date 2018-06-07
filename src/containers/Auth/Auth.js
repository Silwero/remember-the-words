import './Auth.css';

import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { connect } from 'react-redux';

import * as actions from '../../store/actions/actions';

export class Auth extends Component {
  state = {
    text: {
      switchText: 'Login',
      headerText: 'Registeration'
    },
    email: '',
    password: '',
    userName: ''
  }

  changeValue = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  sendAuthData = e => {
    e.preventDefault();

    if (!this.state.email || !this.state.password) return;

    const data = {
      email: this.state.email,
      password: this.state.password,
      returnSecureToken: true,
      history: this.props.history
    }

    if (this.state.text.headerText === 'Registeration') {
      if (!this.state.userName) return;
      data.displayName = this.state.userName;
    }

    this.props.saveUser(data);
  }

  switchAuth = () => {
    if (this.state.text.headerText === "Registeration") {
      this.setState({
        text: {
          switchText: 'Registeration',
          headerText: 'Login'
        }
      });
    } else {
      this.setState({
        text: {
          switchText: 'Login',
          headerText: 'Registeration'
        }
      });
    }
  }

  render() {
    let userName = null;

    if (this.state.text.headerText === 'Registeration') {
      userName = <FormGroup>
            <Label for="userName">Name</Label>
            <Input type="text" autoComplete="off" onInput={this.changeValue} value={this.state.userName} name="userName"  placeholder="Enter your Name" />
          </FormGroup>;
    }

    let auth = null;

    if (!this.props.isAuth) {
      auth = <div className="auth">
        <h1>{this.state.text.headerText}</h1>
        <Form className="centered-form centered-form-sm" onSubmit={this.sendAuthData}>
          {userName}
          <FormGroup>
            <Label for="email">Email</Label>
            <Input type="email" autoComplete="off" onInput={this.changeValue} value={this.state.email} name="email" placeholder="Enter email" />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input type="password" autoComplete="off" onInput={this.changeValue} value={this.state.password} name="password" placeholder="Enter password" />
          </FormGroup>
          <FormGroup>
            <Button block color="primary">Submit</Button>
          </FormGroup>
          <span className="switch-auth hover-line" onClick={this.switchAuth}>Switch to {this.state.text.switchText}</span>
        </Form>
      </div>
    }

    return auth;
  }
}

const mapStateToProps = state => {
  return {
    isAuth: state.isAuth
  }
}

const mapDispatchToProps = dispatch => {
  return {
    saveUser: (data) => dispatch(actions.saveUser(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
