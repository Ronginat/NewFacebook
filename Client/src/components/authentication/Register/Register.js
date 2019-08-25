import React, { Component } from 'react';
import './Register.scss';
import axios from 'axios';
import { baseUrl } from '../../../utils/consts';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      verifyPassword: ''
    };
  }

  register = () => {
    if (this.state.password !== this.state.verifyPassword) {
      alert('Check youe password verification');
      return;
    }
    const loginUrl = `users/signup.php`;
    axios({
      url: loginUrl,
      baseURL: baseUrl,
      method: 'POST',
      data: {
        username: this.state.username,
        password: this.state.password
      }
    })
      .then(res => res.data)
      .then(data => {
        this.props.changeStep('login');

      })
      .catch(e => {
        if (e.response !== undefined
          && e.response.data !== undefined
          && e.response.data.message !== undefined) {
          alert(e.response.data.message);
        }
      });
  }

  render() {
    return (
      <div className="Register">
        <h1>Register</h1>
        <div className="form">
          <label>Username</label>
          <input type="text" placeholder="Enter Username" name="username" required onChange={event => this.setState({ username: event.target.value })} />
          <br />
          <label>Password</label>
          <input type="text" placeholder="Enter Password" name="password" required onChange={event => this.setState({ password: event.target.value })} />
          <br />
          <label>Verify Password</label>
          <input type="text" placeholder="Enter Password" name="verifyPassword" required onChange={event => this.setState({ verifyPassword: event.target.value })} />
          <br />
        </div>
        <br />

        <button onClick={() => this.register()}>Register</button>
      </div>
    );
  }
}

export default Register;