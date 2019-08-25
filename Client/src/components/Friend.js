import React, { Component } from 'react';
import './Friend.scss';
import axios from 'axios';
import { baseUrl } from '../utils/consts';

class Friend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: props.username,
        };
        this.checkActualFriends();
    }

    checkActualFriends = () => {
        const loginUrl = `users/details.php?reqUser=${this.state.username}&resUser=${this.props.friend}`;
        axios({
            url: loginUrl,
            baseURL: baseUrl,
            method: 'GET',
        })
            .then(res => res.data)
            .then(data => {
                this.setState({ actualFriends: data.friends, invited: data.invited, inviting: data.inviting })
            })
            .catch((e) => {
                if (e.response !== undefined
                    && e.response.data !== undefined
                    && e.response.data.message !== undefined) {
                    alert(e.response.data.message);
                }
            });
    }

    changePlayStatus = () => {
        const loginUrl = this.state.invited ?
            `game/invite.php?reqUser=${this.props.friend}&resUser=${this.state.username}` :
            `game/invite.php?reqUser=${this.state.username}&resUser=${this.props.friend}`;
        axios({
            url: loginUrl,
            baseURL: baseUrl,
            method: 'GET',
        })
            .then(res => res.data)
            .then(data => {
                this.checkActualFriends();
                if (!this.state.inviting) {
                    window.open(`http://localhost:5000/${this.state.username}`, '_blank');
                }
            })
            .catch((e) => {
                if (e.response !== undefined
                    && e.response.data !== undefined
                    && e.response.data.message !== undefined) {
                    alert(e.response.data.message);
                }
            });
    }

    changeFriendshipStatus = () => {
        const loginUrl = `users/request.php?reqUser=${this.state.username}&resUser=${this.props.friend}`;
        axios({
            url: loginUrl,
            baseURL: baseUrl,
            method: 'GET',
        })
            .then(res => res.data)
            .then(data => {
                // alert(data.message);
                this.checkActualFriends()
            })
            .catch((e) => {
                if (e.response !== undefined
                    && e.response.data !== undefined
                    && e.response.data.message !== undefined) {
                    alert(e.response.data.message);
                }
            });
    }

    getPlayBtnClass = () => {
        if (this.state.invited) {
            return 'playButton';
        } else if (this.state.inviting) {
            return 'cancelButton';
        } else {
            return 'inviteButton';
        }
    }

    getPlayBtnLabel = () => {
        if (this.state.invited) {
            return 'Play';
        } else if (this.state.inviting) {
            return 'Cancel';
        } else {
            return 'Invite';
        }
    }

    render() {
        return (
            <div className="friend">
                <div className="friendName" onClick={() => this.props.getProfile(this.props.friend)}>
                    {this.props.friend}
                </div>
                <div className="friendButtons">
                    <button className={this.state.actualFriends ? "removeFriendButton" : "addFriendButton"} onClick={this.changeFriendshipStatus}>
                        {this.state.actualFriends ? 'Remove Friend' : 'Add Friend'}
                    </button>
                    <button className={this.getPlayBtnClass()} onClick={this.changePlayStatus}>
                        {this.getPlayBtnLabel()}
                    </button>
                </div>
            </div>
        );
    }
}

export default Friend;