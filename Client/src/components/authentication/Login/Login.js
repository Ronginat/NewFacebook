import React, { Component } from 'react';
import './Login.scss';
import axios from 'axios';
import { baseUrl } from '../../../utils/consts';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  login = () => {
    const loginUrl = `users/login.php?username=${this.state.username}&password=${this.state.password}`;
    axios({
      url: loginUrl,
      baseURL: baseUrl,
      method: 'GET',
    })
      .then(res => res.data)
      .then(data => {
        this.props.loginUser(data.username);
      })
      .catch((e) => {
        if (e.response !== undefined
          && e.response.data !== undefined
          && e.response.data.message !== undefined) {
          alert(e.response.data.message);
        }
      });
  }

  render() {
    return (
      <div className="Login">
        <h1>Login</h1>
        <div className="form">
          <label>Username</label>
          <br />
          <input type="text" placeholder="Enter Username" name="username" required onChange={event => this.setState({ username: event.target.value })} />
          <br />
          <label>Password</label>
          <br />
          <input type="text" placeholder="Enter Password" name="password" required onChange={event => this.setState({ password: event.target.value })} />
          <br />
          <button onClick={this.login}>Login</button>
        </div>
      </div>
    );
  }
}

export default Login;
