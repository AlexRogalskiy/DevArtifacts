"use strict";

import React      from 'react';
import Reflux     from 'reflux';
import Classnames from 'classnames';
import UserStore  from 'appRoot/stores/users';

export default React.createClass({
	mixins: [
		Reflux.connectFilter(UserStore, 'user', function (users) {
			// This syntax is necessary because babel runtime
			// polyfill statically analyzes code and cannot infer
			// the type of users and, by extension, the correct 
			// "find" method
			return Array.find(users, function (user) {
				return user.id === parseInt(this.props.userId, 10);
			}.bind(this)); 
		})
	],
	render: function () {
		var user = this.state.user;

		// you must have a root element!
		return user ? (
			<div className={Classnames({
						'user': true,
						'small': this.props.small
				})}>
				<img className={Classnames({
						'profile-img': true,
						'small': this.props.small
					})} src={user.profileImageData} />
				<div className="user-meta">
					<strong>{user.blogName}</strong>
					<small>
						{user.firstName}&nbsp;{user.lastName}
					</small>
				</div> 
			</div>
		) : <div className="user" />;
	}
});
 
