import React from 'react';

export default class User extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<input className="form-control input-lg" type="text" placeholder="Alias..." />
		);
	}
}
