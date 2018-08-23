"use strict";

import React    from 'react';
import { Link } from 'react-router';

export default React.createClass({
   render: function () {
		return (
			<header className="app-header">
				<Link to="/"><h1>Re&#923;ction</h1></Link>
				<section className="account-ctrl">
					<Link to="/users/create">Join</Link>
					<Link to="/login">Log In</Link> 
				</section>
			</header> 
		);
	}
});

