"use strict";

import React     from 'react';
import UserView  from 'appRoot/components/users/view';
import PostList  from 'appRoot/components/posts/list';
       
export default React.createClass({
   render: function () {
		return (
			<div className="user-view">
				<UserView userId={this.props.params.userId} />
				<hr />
				<PostList user={this.props.params.userId} />
			</div>
		);
	}
});
 
