"use strict";

import Reflux  from 'reflux';
import Actions from 'appRoot/actions';
import Request from 'superagent';
import Config  from 'appRoot/appConfig';

export default Reflux.createStore({
	listenables: Actions,
	endpoint: Config.apiRoot + '/posts',
	posts: [],
	// called when mixin is used to init the component state
	getInitialState: function () { 
		return this.posts;
	},
	init: function () {
		Request
			.get(this.endpoint)
			.end(function (err, res) {
				if (res.ok) {
					this.posts = res.body;
					this.trigger(this.posts);
				} else {
				}
			}.bind(this)); 
	},
	//-- ACTION HANDLERS
	onGetPost: function (id) {
		function req () {
			Request
				.get(this.endpoint)
				.query({
					id: id
				})
				.end(function (err, res) {
					if (res.ok) {
						if (res.body.length > 0) {
							Actions.getPost.completed(res.body[0]);
						} else {
							Actions.getPost.failed('Post (' + id + ') not found');
						}
					} else {
						Actions.getPost.failed(err);
					} 
				});
		}
		Config.loadTimeSimMs ? setTimeout(req.bind(this), Config.loadTimeSimMs) : req();
	},
	onModifyPost: function (post, id) {
		function req () {
			Request
				[id ? 'put' : 'post'](id ? this.endpoint+'/'+id : this.endpoint)
				.send(post)
				.end(function (err, res) {
					if (res.ok) {
						Actions.modifyPost.completed(res);
						// if there's already a post in our local store we need to modify it
						// if not, add this one
						var existingPostIdx = Array.findIndex(this.posts, function (post) {
							return res.body.id == post.id;
						});

						//console.log("POST IDX", existingPostIdx);
						if (existingPostIdx > -1) {
							this.posts[existingPostIdx] = res.body;
						} else {
							this.posts.push(res.body);
						}
					} else {
						Actions.modifyPost.completed();
					}
				}.bind(this));
		}
		Config.loadTimeSimMs ? setTimeout(req.bind(this), Config.loadTimeSimMs) : req();
	}
});
