import React       from 'react';
import { History } from 'react-router';
import BasicInput  from 'appRoot/components/basicInput';
import Actions     from 'appRoot/actions';

export default React.createClass({
	mixins: [
		History
	],
	getInitialState: function () { return {}; },
	logIn: function (e) {
		var detail = {};

		Array.prototype.forEach.call(
			e.target.querySelectorAll('input'),
			function (v) {
				detail[v.getAttribute('name')] = v.value;
			});
		e.preventDefault(); 
		e.stopPropagation(); 

		Actions.login(detail.username, detail.password)
			.then(function () {
				//console.log("SUCCESS", arguments);
				this.history.pushState('', '/');
			}.bind(this))
			['catch'](function () {
				//console.log("ERROR", arguments);
				this.setState({'loginError': 'bad username or password'});
			}.bind(this))
			;
	},
	render: function () {
		return (
			<form className="login-form" onSubmit={this.logIn}>
				<fieldset>
					<legend>Log In</legend>
					<BasicInput name="username" type="text" placeholder="username" />
					<BasicInput name="password" type="password" placeholder="password" />
					{ this.state.loginError && <aside className="error">{this.state.loginError}</aside> }
					<button type="submit">Log In</button>
				</fieldset>
			</form>
		);
	}
});

