import React, { Component } from 'react';
import './Comments.scss';
import axios from 'axios';
import { baseUrl } from '../utils/consts';

class Comments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: props.username,
            newComment: ''
        };
    }

    postComment = () => {
        if (this.state.newComment === '') {
            alert('Your Comment is Empty');
            return;
        }
        const loginUrl = `comments/create.php`;
        axios({
            url: loginUrl,
            baseURL: baseUrl,
            method: 'POST',
            data: {
                username: this.state.username,
                post_id: this.props.post.id,
                content: this.state.newComment
            }
        })
            .then(res => res.data)
            .then(data => {
                this.setState({ newComment: '' });
                this.props.profileMode ? this.props.getProfile(this.props.post.author) : this.props.getFeed();
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
            <div className="comments">
                <div style={{ marginTop: '11px', borderBottom: '1px solid #dddfe2', margin: '8px -13px 0 -13px' }} />
                {this.props.comments.map((comment, i) => (
                    <div key={i} className="comment">
                        <div className="bubble">
                            <div className="commentAuthor" onClick={this.props.disableScreen ? () => {} : () => this.props.getProfile(comment.author)}>
                                {comment.author}
                            </div>
                            <div className="commentContent">
                                {comment.content}
                            </div>
                        </div>
                        <div className="commentDate">
                            {comment.date}
                        </div>
                    </div>
                ))}
                <div className="newComment">
                    <textarea className="newCommentText" value={this.state.newComment} type="text" placeholder="Write a Comment..." name="newComment" required onChange={event => this.setState({ newComment: event.target.value })} />
                    <button className="newPostButton" onClick={this.props.disableScreen ? () => {} : this.postComment}>Post</button>
                </div>
            </div>
        );
    }
}

export default Comments;