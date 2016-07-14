import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Post extends React.Component {
	constructor(props) {
		super(props);
		this.comment = props.comment;
	}
	render() {
		return (
			<li className="list-group-item">{this.comment}</li>
		);
	}
}

export default class Stream extends React.Component {
	constructor(props) {
		super(props);
		this.comments = props.comments;
	}
	render() {
		var rows = [];
		for(var startI = this.comments.length-1, i = startI; i >= 0; i--) {
			rows.push(<Post key={this.comments[i].id} comment={this.comments[i].text} />);
		}
		return (
			<div className="stream">
				<ul className="list-group">
					<ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
						{rows}
					</ReactCSSTransitionGroup>
				</ul>
			</div>
		);
	}
}