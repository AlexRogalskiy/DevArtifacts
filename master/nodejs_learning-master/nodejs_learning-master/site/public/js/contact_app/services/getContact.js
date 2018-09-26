"use strict";

app.factory('ContactSvc', function ($resource) {
	return $resource('/users/:id', { id: '@id' }, {
		'update': { method: 'PUT' }
	})
});
