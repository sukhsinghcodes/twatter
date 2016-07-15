import React from 'react';
import ReactDOM from 'react-dom';
import CommentBox from './CommentBox';
import Stream from './Stream';
import Post from './Post';
import Syncano from 'syncano';


class TwatterApp extends React.Component {
	constructor(props) {
		super(props);

		//vars
		this.syncano = Syncano({
			apiKey: '4b58726b15e671ddba0a2d569fff23c4120e9bf9',
			instance: 'dry-sunset-6624'
		});
		this.sDO = this.syncano.DataObject;

		//state
		this.state = { posts: [] };

		//event handlers
		this._postCommentCallback = (c) => this.postComment(c);
	}
	loadPostsFromServer() {
		this.sDO.please()
			.list({instanceName: 'dry-sunset-6624', className: 'post'})
			.orderBy('-created_at')
			.then((res) => {
				var posts = [];
				res.forEach((post) => {
					posts.push(new Post(post.id, post.text, post.author, post.created_at.toString()));
				});
				if (this.state.posts !== posts) {
					this.setState({posts: posts});
				}
			});
	}	
	postComment(comment) {
		var post = {
			text: comment,
			author: 'Anonymous'
		}
		this.sDO.please().create(post).then(function(post) {
			console.log("book", book);
			var posts = this.state.posts;
			posts.push(new Post(post.id, post.text, post.author));
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

