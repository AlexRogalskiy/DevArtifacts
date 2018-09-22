"use strict";

import Reflux  from 'reflux';
import Actions from 'appRoot/actions';
import Request from 'superagent';
import Config  from 'appRoot/appConfig';
import Cookie  from 'appRoot/vendor/cookie';
 
export default Reflux.createStore({
	listenables: Actions,
	endpoint: Config.apiRoot + '/users',
	context: { loggedIn: false },
	getInitialState: function () { 
		this.context          = JSON.parse(Cookie.getItem('session')) || {};
		this.context.loggedIn = this.context.loggedIn || false; 
		return this.context; 
	},
	getResponseResolver: function (action) {
		return function (err, res) {
			if (res.ok && res.body instanceof Array && res.body.length > 0) {
				this.context          = res.body[0];
				this.context.loggedIn = true;
				this.context.profileImageData = null;

				this.trigger(this.context);
				action.completed();

				//console.log("SETTING COOKIE", JSON.stringify(this.context), Cookie.setItem);
				Cookie.setItem('session', JSON.stringify(this.context));
			} else {
				action.failed();
			} 
		}.bind(this);
	},
	getSessionInfo: function () {
		return JSON.parse(Cookie.getItem('session'));
	},
	onLogin: function (name, pass) {
		Request
			.get(this.endpoint)
			.query({
				'username': name,
				'password': pass
			})
			.end(this.getResponseResolver(Actions.login))
			;
	},
	onLogOut: function () {
		Cookie.removeItem('session');
		this.context = { loggedIn: false };
		this.trigger(this.context);
		return true;
	}
});
