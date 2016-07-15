import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Post extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		console.log('post render: ', this.props.post.timestamp);
		return (
			<div className="list-group-item">
				<p className="list-group-item-text">{this.props.post.text}</p>
				<p className="help-block"><small>{this.props.post.author} - <em>{this.props.post.timestamp}</em></small></p>
			</div>
		);
	}
}

export default class Stream extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		var postNodes = this.props.posts.map((post) => {
			return (<Post key={post.id} post={post} />);
		});
		console.log('stream render: ', postNodes);
		return (
			<div className="stream">
				<div className="list-group">
					<ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
						{postNodes}
					</ReactCSSTransitionGroup>
				</div>
			</div>
		);
	}
}
