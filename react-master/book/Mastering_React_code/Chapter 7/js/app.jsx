"use strict";

import React     from 'react';
import ReactDom  from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';
import CSS       from '../css/app.less';
import AppHeader from 'appRoot/views/appHeader';
import Login     from 'appRoot/views/login';
import PostList  from 'appRoot/views/posts/list';
import PostView  from 'appRoot/views/posts/view';
import PostEdit  from 'appRoot/views/posts/edit';
import UserList  from 'appRoot/views/users/list';
import UserView  from 'appRoot/views/users/view';
import UserEdit  from 'appRoot/views/users/edit';

// Components must be uppercase - regular DOM is lowercase
// https://facebook.github.io/react/docs/jsx-in-depth.html#html-tags-vs.-react-components
let AppLayout = React.createClass({
   render: function () {
		return (
			<div className="app-container">
				<AppHeader />
				<main>
					{React.cloneElement(this.props.children, this.props)}
				</main>
			</div>
		);
	}
});

let routes = (
    <Route path="/" component={ AppLayout }>
		<IndexRoute component={ PostList } />
        <Route 
			path="posts/:pageNum/?" 
			component={ PostList } 
			ignoreScrollBehavior 
		/>
		<Route
			path="/posts/create"
			component={ PostEdit }
		/>
		<Route 
			path="/posts/:postId/edit"
			component={ PostEdit } 
		/>
        <Route 
			path="posts/:postId"
			component={ PostView } 
		/>
		<Route 
			path="/users" 
			component={ UserList } 
		/>
		<Route
			path="/users/create"
			component={ UserEdit }
		/>
		<Route 
			path="/users/:userId" 
			component={ UserView } 
		/>
		<Route 
			path="/users/:userId/edit" 
			component={ UserEdit }
		/>
		<Route 
			path="/login" 
			component={ Login }
		/>
		<Route path="*" component={ PostList } />
    </Route>
);

ReactDom.render(<Router>{routes}</Router>, document.getElementById('app'));
