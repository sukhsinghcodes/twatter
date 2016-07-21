import React from 'react';
import ReactDOM from 'react-dom';
import CommentBox from './CommentBox';
import Stream from './Stream';
import Post from './Post';
import User from './User';
import Syncano from 'syncano';
import Cookies from 'cookies-js';

import NLP from 'nlp_compromise';

const instanceName = config.instanceName, postClassName = config.postClassName, keywordsClassName = config.keywordsClassName, apiKey = config.apiKey, channelName = config.channelName;


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
		this.lastAlias = Cookies.get('alias');


		//state
		this.state = { 
						posts: [],
						alias: this.lastAlias || '',
					};

		//event handlers
		this._postCommentCallback = (c) => this.postComment(c);
		this._aliasChangeCallback = (a) => this.aliasChange(a);
	}
	loadPostsFromServer() {
		if (this.state.posts.length < this.totalPosts) {
			this.sDO.please()
				.list({instanceName: instanceName, className: postClassName})
				.orderBy('-created_at')
				.pageSize(this.pageSize)
				.then((res) => {
					let posts = [];
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
		let post = {
			text: comment,
			author: this.state.alias || 'Anonymous',
			instanceName: instanceName,
			className: postClassName,
			channel: channelName
		}
		this.sDO.please().create(post).then((p) => {
			Cookies.set('alias', p.author);

			let keywords = [];

			NLP.text(p.text).topics().forEach((item, index) => {
				keywords.push(item.text);
			});
			NLP.text(p.text).terms().forEach((item, index) => {
				if (item.tag === 'HashTag') {
					keywords.push(item.normal);
				}
			});

			console.log(keywords);

			keywords.forEach((item, index) => {
				this.sDO.please().create({
					keyword: item,
					postId: p.id,
					instanceName: instanceName,
					className: keywordsClassName
				}).then((k) => {
					console.log(k.keyword);
				});
			});
		});
	}
	aliasChange(alias) {
		this.setState({alias: alias});
	}
	scrollHandler () {
		let contentHeight = document.body.offsetHeight;
		let y = this.window.scrollY + this.window.innerHeight;
		if (y >= contentHeight) {
			this.window.removeEventListener('scroll', () => this.scrollHandler());
			this.pageSize += 10;
			this.loadPostsFromServer();
		}
	}
	componentDidMount() {
		this.sDO.please()
			.list({instanceName: instanceName, className: postClassName})
			.count()
			.then((res) => {
				this.totalPosts = res.objects_count;
				this.loadPostsFromServer();
			});

		this.poll.on('message', (message) => {
			if (message.action === "create") {
				let posts = this.state.posts;
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
				<User aliasChangeCallback={this._aliasChangeCallback} alias={this.state.alias} />
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

