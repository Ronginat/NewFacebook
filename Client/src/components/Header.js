import React, { Component } from 'react';
import './Header.scss';
import Friend from './Friend';
import axios from 'axios';
import { baseUrl } from '../utils/consts';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: props.username,
            search: '',
            friends: [],
        };
        this.getAllFriends();
    }

    getAllFriends = () => {
        const loginUrl = `users/search.php?username=`;
        axios({
            url: loginUrl,
            baseURL: baseUrl,
            method: 'GET',
        })
            .then(res => res.data)
            .then(data => {
                this.setState({ friends: data.records })
            })
            .catch((e) => {
                if (e.response !== undefined
                    && e.response.data !== undefined
                    && e.response.data.message !== undefined) {
                    alert(e.response.data.message);
                }
            });
    }

    friendsToShow = () => {
        if (this.state.search === '*') {
            const friendsToSend = [];
            this.state.friends.forEach(friend => {
                if (friend.username !== this.state.username) {
                    friendsToSend.push(friend.username);
                }
            });
            return friendsToSend;
        } else {
            const friendsToSend = [];
            this.state.friends.forEach(friend => {
                if (friend.username !== this.state.username) {
                    const subName = friend.username.substring(0, this.state.search.length);
                    if (subName === this.state.search) {
                        friendsToSend.push(friend.username);
                    }
                }
            });
            return friendsToSend;
        }
    }

    render() {
        return (
            [
                <div key={'header'} className="Header">
                    <div className="navigate">
                        <div className="navigateButton" onClick={this.props.disableScreen ? () => {} : this.props.getFeed}>Home</div>
                        <div className="navigateButton" onClick={this.props.disableScreen ? () => {} : () => this.props.getProfile(this.state.username)}>{this.state.username}</div>
                    </div>
                    <div className="search">
                        <form>
                            <input
                                disabled={this.props.disableScreen}
                                className="input"
                                type="text"
                                placeholder="Search"
                                name="search"
                                required
                                onChange={event => this.setState({ search: event.target.value })}
                            />
                        </form>
                        {this.state.search !== '' &&
                            <div className="friendsList">
                                {this.friendsToShow().map((friend, i) => (
                                    <Friend key={i} username={this.state.username} friend={friend} getProfile={this.props.getProfile} />
                                ))}
                            </div>}
                    </div>
                    <div className="navigateLogOut" onClick={this.props.disableScreen ? () => {} : this.props.logout}>
                        <div>Logout</div>
                    </div>
                </div>,
                <div key={'placeholder'} className="headerPlaceholder" />
            ]
        );
    }
}

export default Header;
