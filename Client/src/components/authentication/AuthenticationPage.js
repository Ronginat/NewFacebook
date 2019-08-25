import React, { Component } from 'react';
import './AuthenticationPage.scss';
import Register from './Register/Register';
import Login from './Login/Login';

class AuthenticationPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 'login',
    };
  }

  changeStep = (step) => {
    this.setState({
      step
    })
  }

  getClassName = (btn) => {
    if (btn === this.state.step) {
      return 'pushed';
    } else {
      return '';
    }
  }

  render() {
    let toShow;
    if (this.state.step === 'login') {
      toShow = <Login changeStep={this.changeStep} loginUser={this.props.loginUser} />
    }
    else if (this.state.step === 'register') {
      toShow = <Register changeStep={this.changeStep} />
    }

    return (
      <div className="authentication">
        <button className={this.getClassName('login')} onClick={() => this.changeStep('login')}>Login</button>
        <button className={this.getClassName('register')} onClick={() => this.changeStep('register')}>Register</button>
        <br></br>
        {toShow}
      </div>
    );
  }
}

export default AuthenticationPage;
