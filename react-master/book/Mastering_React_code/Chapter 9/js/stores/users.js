"use strict";

import Reflux         from 'reflux';
import Actions        from 'appRoot/actions';
import Request        from 'superagent';
import Config         from 'appRoot/appConfig';
import SessionContext from 'appRoot/stores/sessionContext';

export default Reflux.createStore({
	listenables: Actions,
	/** Alternative Syntax 
	init: function () {
		// listen to manu
		this.listenToMany([Actions.getPosts]);
		// listen to one
		this.listenTo(Actions.getPosts, this.onGetPosts);
	},
	*/
	users: [],
	endpoint: Config.apiRoot + '/users',
	init: function () {
		Request
			.get(this.endpoint)
			.end(function (err, res) {
				if (res.ok) {
					this.users = res.body;
					this.trigger(this.users);
				} else {
				}
			}.bind(this)); 
	},
	// called when mixin is used to init the component state
	getInitialState: function () { 
		return this.users;
	},
	modifyUser: function (method, details, action) {
		Request
			[method](this.endpoint)
			.send(details)
			.end(function (err, res) {
				if (res.ok) {
					Actions.login(res.body.username, res.password)
						.then(function () {
							action.completed(res.body);
						});
				} else {
					action.failed(err);
				} 
			}.bind(this));
			; 
	},
	onCreateUser: function (details) {
		console.log("create user action", this);
		this.modifyUser('post', details, Actions.createUser);
	},
	onEditUser: function (details) {
		this.modifyUser('put', details, Actions.editUser);
	} 
});
