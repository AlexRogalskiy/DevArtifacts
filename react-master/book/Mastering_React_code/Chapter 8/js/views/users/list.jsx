"use strict";

import React     from 'react';
import Reflux    from 'reflux';
import { Link }  from 'react-router';
import UserStore from 'appRoot/stores/users';
import UserView  from 'appRoot/components/users/view';
 
export default React.createClass({
	mixins: [
		Reflux.connect(UserStore, 'users')
	],
	render: function () {
		return (
			<ul className="user-list">
				{this.state.users ? 
					this.state.users.map(function (v) {
						return (
							<li key={v.id}>
								<Link to={`/users/${v.id}`}>
									<UserView userId={v.id} small={true} />
								</Link>
							</li>
						);
					}) : []
				}
			</ul>
		);
	}
});
 
