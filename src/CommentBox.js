import React from 'react';

export default class CommentBox extends React.Component {
	constructor(props) {
		super(props);

		//vars
		this._currentValidState = '';

		//props
		this.postCommentCallback = props.postCommentCallback;

		//state
		this.state = {
			charsLeft: 140,
			commentText: ''
		};

		//event handlers
		this._handleTextChange = (e) => this.handleTextChange(e);
		this._postComment = (e) => this.postComment(e);
	}
	handleTextChange(e) {
		this.setState({ 
						charsLeft: (140 - e.target.value.length),
						commentText: e.target.value
					});
	}
	postComment(e) {
		e.preventDefault();

		if (this.state.commentText) {
			this.postCommentCallback(this.state.commentText);
			this.setState({charsLeft: 140, commentText: ''});
		}
	}
	render() {
		return (
		<div className="commentBox">
	    	<form id="postForm" className="form" onSubmit={this._postComment}>
			    <div className="input-group">
					<input type="text" id="commentTextArea" className="form-control input-lg" placeholder="Write something..." maxLength="140" onChange={this._handleTextChange} value={this.state.commentText} />
					<span className="input-group-btn">
						<button className="btn btn-primary btn-lg" type="submit" onClick={this._postComment}><span className="glyphicon glyphicon-share-alt"></span></button>
					</span>
			    </div>
	    	</form>
		    <span className="help-block"><em>{this.state.charsLeft} characters left</em></span>
		</div>);
	}
}
