import React, { Component } from 'react';
import './MainPage.scss';
import Header from './Header';
import Post from './Post';
import axios from 'axios';
import { baseUrl } from '../utils/consts';

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: props.username,
            disableScreen: false,
            newPost: '',
            isNewPostPublic: true,
            newPostImages: {},
            feed: [],
            profileMode: false,
            profile: []
        };
        this.getFeed();
    }

    getProfile = (profileToShow) => {
        const loginUrl = `posts/profile.php?reqUser=${this.state.username}&resUser=${profileToShow}`;
        axios({
            url: loginUrl,
            baseURL: baseUrl,
            method: 'GET',
        })
            .then(res => res.data)
            .then(data => {
                this.setState({ profileMode: true, profile: data.records })
            })
            .catch((e) => {
                if (e.response !== undefined
                    && e.response.data !== undefined
                    && e.response.data.message !== undefined) {
                    alert(e.response.data.message);
                }
            });
    }

    getFeed = () => {
        const loginUrl = `posts/feed.php?username=${this.state.username}`;
        axios({
            url: loginUrl,
            baseURL: baseUrl,
            method: 'GET',
        })
            .then(res => res.data)
            .then(data => {
                this.setState({ profileMode: false, feed: data.records })
            })
            .catch((e) => {
                if (e.response !== undefined
                    && e.response.data !== undefined
                    && e.response.data.message !== undefined) {
                    alert(e.response.data.message);
                }
            });
    }

    uploadImage = (postId, img) => {
        const uploadUrl = `images/upload.php?id=${postId}`;
        const formData = new FormData();
        formData.append('image', img);
        return axios({
            url: uploadUrl,
            baseURL: baseUrl,
            method: 'POST',
            data: formData,
            headers: { 'content-type': 'multipart/form-data' }
        });
    }

    postPost = () => {
        if (this.state.newPost === '') {
            alert('Your Post is Empty');
            return;
        }
        const loginUrl = `posts/create.php`;
        axios({
            url: loginUrl,
            baseURL: baseUrl,
            method: 'POST',
            data: {
                username: this.state.username,
                private: !this.state.isNewPostPublic,
                content: this.state.newPost
            }
        })
            .then(res => res.data)
            .then(async (data) => {
                this.setState({ newPost: '' })
                if (this.state.newPostImages.length > 0) {
                    for (let i = 0; i < this.state.newPostImages.length; i++) {
                        await this.uploadImage(data.post.id, this.state.newPostImages[i]);
                    }
                }
                this.setState({ newPostImages: {} })
                this.fileInput.value = "";
                this.getFeed();

            })
            .catch(e => {
                if (e.response !== undefined
                    && e.response.data !== undefined
                    && e.response.data.message !== undefined) {
                    alert(e.response.data.message);
                }
            });
    }

    changeScreenAbility = () => {
        const disableScreen = this.state.disableScreen;
        this.setState({ disableScreen: !disableScreen });
    }

    changePublic = () => {
        const current = this.state.isNewPostPublic;
        this.setState({ isNewPostPublic: !current })
    }

    render() {
        const postsToShow = this.state.profileMode ? this.state.profile : this.state.feed;

        return (
            <div className="mainPage">
                <div className="headerWrapper">
                    <Header
                        username={this.state.username}
                        disableScreen={this.state.disableScreen}
                        changeScreenAbility={this.changeScreenAbility}
                        getFeed={this.getFeed}
                        getProfile={this.getProfile}
                        logout={this.props.logout}
                    />
                </div>
                {!this.state.profileMode &&
                    <div className="newPost">
                        <div className="newPostHeader" >Create New Post</div>
                        <div className="newPostBody">
                            <textarea className="newPostText" value={this.state.newPost} type="text" placeholder="What are you thinking about?" name="newPost" required onChange={event => this.setState({ newPost: event.target.value })} />
                            <button className="newPostButton" onClick={this.state.disableScreen ? () => {} : this.postPost}>Post</button>
                            <div className="newPostPermission">
                                <input type="checkbox" checked={this.state.isNewPostPublic} onChange={this.changePublic} />Public
                            </div>
                            <div className="newPostImages">
                                <input type="file" multiple accept="image/jpeg" onChange={event => this.setState({ newPostImages: event.target.files })} ref={ref => this.fileInput = ref} />
                            </div>
                        </div>
                    </div>}
                {postsToShow.map((post, i) => (
                    <div key={i} className="postWrapper">
                        <Post
                            username={this.state.username}
                            disableScreen={this.state.disableScreen}
                            changeScreenAbility={this.changeScreenAbility}
                            post={post}
                            getFeed={this.getFeed}
                            profileMode={this.state.profileMode}
                            getProfile={this.getProfile}
                        />
                    </div>
                ))}
            </div>
        );
    }
}

export default MainPage;


