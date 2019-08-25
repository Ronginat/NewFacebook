import React, { Component } from 'react';
import './Post.scss';
import { FaRegThumbsUp } from "react-icons/fa";
import Images from './Images';
import Comments from './Comments';
import axios from 'axios';
import { FaLock } from "react-icons/fa";
import { FaLockOpen } from "react-icons/fa";
import { baseUrl } from '../utils/consts';

class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: props.username,
        };
    }

    likeClicked = () => {
        const loginUrl = `posts/like.php?username=${this.state.username}&id=${this.props.post.id}`;
        axios({
            url: loginUrl,
            baseURL: baseUrl,
            method: 'GET',
        })
            .then(res => res.data)
            .then(data => {
                this.props.profileMode ? this.props.getProfile(this.props.post.author) : this.props.getFeed();
            })
            .catch((e) => {
                if (e.response !== undefined
                    && e.response.data !== undefined
                    && e.response.data.message !== undefined) {
                    alert(e.response.data.message);
                }
            });
    }

    changePostPermission = () => {
        const loginUrl = `posts/update.php?username=${this.state.username}&id=${this.props.post.id}`;
        axios({
            url: loginUrl,
            baseURL: baseUrl,
            method: 'GET',
        })
            .then(res => res.data)
            .then(data => {
                this.props.profileMode ? this.props.getProfile(this.props.post.author) : this.props.getFeed();
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
            <div className="post">
                <div className="author">
                    <div onClick={this.props.disableScreen ? () => {} : () => this.props.getProfile(this.props.post.author)}>{this.props.post.author}</div>
                    {this.props.post.author === this.state.username &&
                        <div onClick={this.props.disableScreen ? () => {} : this.changePostPermission}>
                            {this.props.post.private ? <FaLock /> : <FaLockOpen />}
                        </div>}
                </div>
                <div className="postDate">
                    {this.props.post.date}
                </div>
                <div className="content">
                    {this.props.post.content}
                </div>
                {JSON.parse(this.props.post.image).length > 0 &&
                    <div className="imgWrapper">
                        <Images imgs={JSON.parse(this.props.post.image)} disableScreen={this.props.disableScreen} changeScreenAbility={this.props.changeScreenAbility} />
                    </div>}
                <div className="likes">
                    <div className="likeNumber">
                        <FaRegThumbsUp style={{ color: '#385898', marginRight: '4px' }} />
                        {this.props.post.likes}
                    </div>
                    <div style={{ width: '99%', borderBottom: '1px solid #dddfe2' }} />
                    <div className="likeButton">
                        <button className={this.props.post.meLike === true ? "pushed" : ""} onClick={this.props.disableScreen ? () => {} : this.likeClicked}>
                            Like
                            <FaRegThumbsUp style={{ marginLeft: '4px' }} />
                        </button>
                    </div>
                </div>
                <div className="commentsWrapper">
                    <Comments
                        comments={JSON.parse(this.props.post.comments)}
                        username={this.state.username}
                        post={this.props.post}
                        getProfile={this.props.getProfile}
                        disableScreen={this.props.disableScreen}
                        getFeed={this.props.getFeed}
                        profileMode={this.props.profileMode}
                    />
                </div>
            </div>
        );
    }
}

export default Post;