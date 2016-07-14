import React from 'react';
import ReactDOM from 'react-dom';
import CommentBox from './CommentBox';
import Stream from './Stream';

class TwatterApp extends React.Component {
	constructor(props) {
		super(props);

		//props

		//state
		this.state = {
			comments: [{id:1, text:"hello"}, {id:2, text:"bye"}]
		}

		//event handlers
		this._postCommentCallback = (c) => this.postComment(c);
	}
	postComment(comment) {
		var newComments = this.state.comments;
		newComments.push({id: this.state.comments.length+1, text: comment});
		this.setState({comments: newComments});
	}
	render() {
		return (
			<div>
				<CommentBox postCommentCallback={this._postCommentCallback} />
				<Stream comments={this.state.comments} />
			</div>
		);
	}
}

ReactDOM.render(
	<TwatterApp />,
	content
);

