import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Post extends React.Component {
	constructor(props) {
		super(props);
		this.post = props.post;
	}
	render() {
		return (
			<div className="list-group-item">
				<p className="list-group-item-text">{this.post.text}</p>
				<p className="help-block"><small>{this.post.author} - <em>{this.post.timestamp}</em></small></p>
			</div>
		);
	}
}

export default class Stream extends React.Component {
	constructor(props) {
		super(props);
		this.posts = props.posts;
	}
	render() {
		var rows = [];
		for(var startI = this.posts.length-1, i = startI; i >= 0; i--) {
			rows.push(<Post key={this.posts[i].id} post={this.posts[i]} />);
		}
		return (
			<div className="stream">
				<div className="list-group">
					<ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
						{rows}
					</ReactCSSTransitionGroup>
				</div>
			</div>
		);
	}
}