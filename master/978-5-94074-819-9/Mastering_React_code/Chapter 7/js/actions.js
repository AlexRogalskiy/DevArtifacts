"use strict";

import Reflux from 'reflux';

export default Reflux.createActions({
	'getPost': {
		asyncResult: true
	},
	'modifyPost': {
		asyncResult: true
	},
	'login': {
		asyncResult: true
	},
	'logOut': {},
	'createUser': {
		asyncResult: true
	},
	'editUser': {
		asyncResult: true
	},
	'search': {},
	'getSessionContext': {} 
});
