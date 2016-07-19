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

		//props
		this.window = props.window;

		//vars
		this.content = document.getElementById("content");
		this.syncano = Syncano({
			apiKey: apiKey,
			instance: instanceName
		});
		this.sDO = this.syncano.DataObject;
		this.poll = this.syncano.Channel.please().poll({instanceName: instanceName, name: channelName});
		this.pageSize = 10;
		this.totalPosts = -1;

		//state
		this.state = { 
						posts: [], 
						alias: 'Anonymous',
						 };

		//event handlers
		this._postCommentCallback = (c) => this.postComment(c);
		this._aliasChangeCallback = (a) => this.aliasChange(a);
	}
	loadPostsFromServer() {
		if (this.state.posts.length < this.totalPosts) {
			this.sDO.please()
				.list({instanceName: instanceName, className: className})
				.orderBy('-created_at')
				.pageSize(this.pageSize)
				.then((res) => {
					var posts = [];
					res.forEach((post) => {
						posts.push(new Post(post.id, post.text, post.author, post.created_at.toLocaleDateString('en-GB') + ' ' + post.created_at.toLocaleTimeString('en-GB')));
					});
					if (this.state.posts !== posts) {
						this.setState({posts: posts});
					}
					this.window.addEventListener('scroll', () => this.scrollHandler());
				}).catch((err) => {
					console.log(err);
				});
		}
	}	
	postComment(comment) {
		var post = {
			text: comment,
			author: this.state.alias,
			instanceName: instanceName,
			className: className,
			channel: channelName
		}
		this.sDO.please().create(post).then();
	}
	aliasChange(alias) {
		this.setState({alias: alias});
	}
	scrollHandler () {
		var contentHeight = document.body.offsetHeight;
		var y = this.window.scrollY + this.window.innerHeight;
		if (y >= contentHeight) {
			this.window.removeEventListener('scroll', () => this.scrollHandler());
			this.pageSize += 10;
			this.loadPostsFromServer();
		}
	}
	componentDidMount() {
		this.sDO.please()
			.list({instanceName: instanceName, className: className})
			.count()
			.then((res) => {
				this.totalPosts = res.objects_count;
				this.loadPostsFromServer();
			});

		this.poll.on('message', (message) => {
			if (message.action === "create") {
				var posts = this.state.posts;
				posts.unshift(new Post(message.payload.id, message.payload.text, message.payload.author));
				this.setState({posts: posts});
				this.totalPosts ++;
			}
		});
	}
	componentWillUnmount() {
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

(function(window) {
	ReactDOM.render(
		<TwatterApp window={window} />,
		document.getElementById("content")
	);

})(window);

