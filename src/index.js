import React from 'react';
import ReactDOM from 'react-dom';
import CommentBox from './CommentBox';
import Stream from './Stream';
import Post from './Post';

class TwatterApp extends React.Component {
	constructor(props) {
		super(props);

		//props

		//private vars
		this._seededPosts = this.seedData();
		
		//state
		this.state = {
			posts: this._seededPosts
		}

		//event handlers
		this._postCommentCallback = (c) => this.postComment(c);
	}
	postComment(comment) {
		var newPosts = this.state.posts;
		newPosts.push(new Post(this.state.posts.length+1, comment, undefined));
		this.setState({posts: newPosts});
	}
	render() {
		return (
			<div>
				<CommentBox postCommentCallback={this._postCommentCallback} />
				<Stream posts={this.state.posts} />
			</div>
		);
	}
	seedData() {
		var seedPosts = [];
		seedPosts.push(new Post(1, 'hello', 'John Smith', '01/07/16 01:00 PM'));
		seedPosts.push(new Post(2, 'bye', 'Jane Doe', '01/07/16 01:03 PM'));
		seedPosts.push(new Post(3, 'ok, that\'s fine', 'John Smith', '02/07/16 10:56 AM'));
		return seedPosts;
	}
}

ReactDOM.render(
	<TwatterApp />,
	content
);

