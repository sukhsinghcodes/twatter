import React from 'react';
import ReactDOM from 'react-dom';
import CommentBox from './CommentBox';
import Stream from './Stream';
import Post from './Post';
import User from './User';
import Syncano from 'syncano';

const instanceName = 'dry-sunset-6624', className = 'post', apiKey = '4b58726b15e671ddba0a2d569fff23c4120e9bf9', channelName = 'twatter-stream';

class TwatterApp extends React.Component {
	constructor(props) {
		super(props);

		//vars
		this.syncano = Syncano({
			apiKey: apiKey,
			instance: instanceName
		});
		this.sDO = this.syncano.DataObject;
		this.poll = this.syncano.Channel.please().poll({instanceName: instanceName, name: channelName});

		//state
		this.state = { posts: [], alias: 'Anonymous' };

		//event handlers
		this._postCommentCallback = (c) => this.postComment(c);
		this._aliasChangeCallback = (a) => this.aliasChange(a);
	}
	loadPostsFromServer() {
		this.sDO.please()
			.list({instanceName: instanceName, className: className})
			.orderBy('-created_at')
			.pageSize(50)
			.then((res) => {
				var posts = [];
				res.forEach((post) => {
					posts.push(new Post(post.id, post.text, post.author, post.created_at.toLocaleDateString('en-GB') + ' ' + post.created_at.toLocaleTimeString('en-GB')));
				});
				if (this.state.posts !== posts) {
					this.setState({posts: posts});
				}
			}).catch((err) => {
				console.log(err);
			});
	}	
	postComment(comment) {
		var post = {
			text: comment,
			author: this.state.alias,
			instanceName: instanceName,
			className: className,
			channel: channelName
		}
		this.sDO.please().create(post).then((post) => {
			var posts = this.state.posts;
			posts.unshift(new Post(post.id, post.text, post.author));
			this.setState({posts: posts});
		});
	}
	aliasChange(alias) {
		this.setState({alias: alias});
	}
	componentDidMount() {
		this.loadPostsFromServer();

		this.poll.on('message', (message) => {
			this.loadPostsFromServer();
		});

	}
	render() {
		return (
			<div>
				<User aliasChangeCallback={this._aliasChangeCallback} />
				<CommentBox postCommentCallback={this._postCommentCallback} />
				<Stream posts={this.state.posts} />
			</div>
		);
	}

}

ReactDOM.render(
	<TwatterApp />,
	document.getElementById("content")
);

