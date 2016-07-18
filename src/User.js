import React from 'react';

export default class User extends React.Component {
	constructor(props) {
		super(props);

		//props
		this.aliasChangeCallback = props.aliasChangeCallback;

		//event handlers
		this._aliasChange = (e) => this.handleAliasChange(e);
	}
	handleAliasChange(e) {
		e.preventDefault();
		this.aliasChangeCallback(e.target.value || 'Anonymous');
	}
	render() {
		return (
			<input className="form-control input-lg text-center center-block alias-input" type="text" placeholder="Alias..." maxLength="50" onChange={this._aliasChange} />
		);
	}
}
