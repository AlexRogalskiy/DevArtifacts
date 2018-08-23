"use strict";

import React     from 'react';
import Reflux    from 'reflux';
import PostStore from 'appRoot/stores/posts';
import PostView  from 'appRoot/views/posts/view';

export default React.createClass({
	mixins: [
		Reflux.connect(PostStore, 'posts')
	],
	render: function () {
		var posts = this.props.user ? this.state.posts.filter(function (post) {
			return post.user == this.props.user;
		}.bind(this)) : this.state.posts;

		var postsUI = posts.map(function (post) {
			return <PostView key={post.id} post={post} mode="summary"/>;
		});

		return (
			<div className="post-list">
				<ul>
					{postsUI}
				</ul>
			</div>
		);
	}
});
 
