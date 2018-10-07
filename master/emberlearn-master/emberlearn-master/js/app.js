// Create our Application
App = Ember.Application.create({});

// Our default route. Just show a list of the links in /r/aww
App.IndexRoute = Ember.Route.extend({
	model: function() {
		return App.RedditLink.findAll('aww');
	}
});

// Create the controller so you can trap the input action and act on it
App.IndexController = Ember.ObjectController.extend( {
	subredditHeader: "aww",
	loadList: function() {
		// Grab the value from the input field
		var value = this.get('subreddit'), that = {};

		if (value) {

			this.set('subredditHeader', value);			
			this.set( 'model',  App.RedditLink.findAll( value ) );

			// Clear out the input field
			this.set('subreddit', '');

		}
	}
})

// Our RedditLink model
App.RedditLink = Ember.Object.extend({

	/*
	It seems reddit will return the string 'default' when there's no thumbnail present.
	This computed property will convert 'default' to null to avoid rendering a broken
	image link.
	*/
	thumbnailUrl: function() {
		var thumbnail = this.get('thumbnail');
		return (thumbnail === 'default') ? null : thumbnail;
	}.property('thumbnail')

});

App.RedditLink.reopenClass({

	/* Use the Reddit JSON API to retrieve a list of links within a subreddit. Returns
	 a promise that will resolve to an array of `App.RedditLink` objects */
	findAll: function(subreddit) {

		var links = Ember.A();
		
		$.getJSON("http://www.reddit.com/r/" + subreddit + "/.json?jsonp=?").then(function(response) {

  			response.data.children.forEach(function (child) {

	    			links.pushObject(App.RedditLink.create(child.data));

	  		});
		
		});

	  	return links;		
	}

});


