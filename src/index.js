import React from 'react';
import ReactDOM from 'react-dom';
import CommentBox from './CommentBox';
import Stream from './Stream';
import Post from './Post';
import Syncano from 'syncano';

const instanceName = 'dry-sunset-6624', className = 'post', apiKey = '4b58726b15e671ddba0a2d569fff23c4120e9bf9';

class TwatterApp extends React.Component {
	constructor(props) {
		super(props);

		//vars
		this.syncano = Syncano({
			apiKey: apiKey,
			instance: instanceName
		});
		this.sDO = this.syncano.DataObject;

		//state
		this.state = { posts: [] };

		//event handlers
		this._postCommentCallback = (c) => this.postComment(c);
	}
	loadPostsFromServer() {
		this.sDO.please()
			.list({instanceName: instanceName, className: className})
			.orderBy('-created_at')
			.then((res) => {
				var posts = [];
				res.forEach((post) => {
					posts.push(new Post(post.id, post.text, post.author, post.created_at.toString()));
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
			author: 'Anonymous',
			instanceName: instanceName,
			className: className
		}
		this.sDO.please().create(post).then((post) => {
			var posts = this.state.posts;
			posts.unshift(new Post(post.id, post.text, post.author));
			this.setState({posts: posts});
		});
	}
	componentDidMount() {
		this.loadPostsFromServer();
		setInterval(() => this.loadPostsFromServer(), 5000);
	}
	render() {
		console.log('index render: ', this.state.posts);
		return (
			<div>
				<CommentBox postCommentCallback={this._postCommentCallback} />
				<Stream posts={this.state.posts} />
			</div>
		);
	}

}

ReactDOM.render(
	<TwatterApp />,
	content
);

