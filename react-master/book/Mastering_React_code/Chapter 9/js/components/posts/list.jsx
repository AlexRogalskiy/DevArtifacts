"use strict";

import React       from 'react';
import ReactDOM    from 'react-dom';
import Config      from 'appRoot/appConfig';
import PostStore   from 'appRoot/stores/posts';
import SearchStore from 'appRoot/stores/search';
import PostView    from 'appRoot/views/posts/view';
import Loader      from 'appRoot/components/loader';
 
export default React.createClass({
	getInitialState: function () {
		return {
			page: 1,
			posts: []
		};
	},
	componentWillMount: function () {
		this.searchUnsubscribe = SearchStore.listen(this.onSearch);
		this.getNextPage();
	},
	componentDidMount: function () {
		var ele = ReactDOM.findDOMNode(this).parentNode
		,   style
		;
		while (ele) {
			style = window.getComputedStyle(ele);

			if (style.overflow.length ||
				style.overflowY.length || 
				/body/i.test(ele.nodeName)
			) {
				this.scrollParent = ele;
				break;
			} else {
				ele = ele.parentNode;
			}	
		}
		this.scrollParent.addEventListener('scroll', this.onScroll);
	},
	componentWillUnmount: function () {
		this.searchUnsubscribe();
		this.scrollParent.removeEventListener('scroll', this.onScroll);
	},
	onSearch: function (search) {
		this.setState({
			page: 1,
			posts: [],
			search: search
		});
		this.getNextPage();
	},
	onScroll: function (e) {
		var scrollEle  = this.scrollParent
		,   scrollDiff = Math.abs(scrollEle.scrollHeight - (scrollEle.scrollTop + scrollEle.clientHeight))
		;

		if (!this.state.loading && !this.state.hitmax && scrollDiff < 100) {
			this.getNextPage();
		}
	},
	getNextPage: function () {
		this.setState({
			loading: true
		});

		PostStore.getPostsByPage(
			this.state.page, 
			Object.assign({}, this.state.search ? {q: this.state.search} : {}, this.props)
		).then(function (results) {
			var data = results.results;

			// make sure we put the data in the correct location in the array
			// if many results resolved at once trust the request data for start and end
			// instead of some internal state
			Array.prototype.splice.apply(this.state.posts, [results.start, results.end].concat(data));

			// user may navigate away - changing state would cause a warning
			// so, check if we're mounted when this promise resolves
			this.isMounted() && this.setState({
				loading: false,
				hitmax: data.length === 0 || data.length < Config.pageSize,
				page: this.state.page+1
			});
		}.bind(this), function (err) {});
	},
	render: function () {
		var postsUI = this.state.posts.map(function (post) {
			return <PostView key={post.id} post={post} mode="summary"/>;
		});

		return (
			<div className="post-list">
				<ul>
					{postsUI}
				</ul>
				{this.state.hitmax && !this.state.loading ? 
					(
						<div className="total-posts-msg">
							showing { this.state.posts.length } posts
						</div>
					) : ''
				}
				{this.state.loading ? <Loader inline={true} /> : ''}
			</div>
		);
	}
});
 
