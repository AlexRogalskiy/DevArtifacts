"use strict";

import React    from 'react';
import { Link } from 'react-router';

export default React.createClass({
	render: function () {
		return (
			<header className="app-header">
				app header
				<Link to="/login">Log In</Link>
			</header>
		);
	}
});
 
