/**
 * Mediator Test Setup
 */
module("Mediator", {
	setup : function () {
		var that = this;
		this.i   = 0;
		this.j   = 0;
		that.arg;
		this.fn  = function () { that.i += 1 };
		this.fn2 = function () { that.j += 1 };
		this.fn3 = function (arg) { that.arg = arg; };
		this.fn4 = function (arg) { that.arg2 = arg; };
		// clean subscribers
		mediator.subscribers = {};
	}
});

/**
 * Universally Unique Identifier Method
 * Test to ensure a version 4 UUID
 */
test("Generate a universally unique identifier version 4", function () {
	expect(12);
	var id      = mediator.genID(),
	    safe    = mediator.genID(true),
	    allowed = /[0|1|2|3|4|5|6|7|8|9|a|b|c|d|e|f]/gi;

	deepEqual(typeof id, 'string', "genID should return a string");
	deepEqual(id.length, 36, "universally unique identifier should be 36 characters long");
	deepEqual(id.charAt(14), "4", "universally unique identifier character at position 15 must be 4");
	deepEqual(id.charAt(19).match(/[8|9|a|b]/i) instanceof Array, true, "universally unique identifier character at position 20 must be 8, 9, A, or B");
	deepEqual(id.match(allowed).length, 32, "universally unique identifier has 32 allowed digits");
	deepEqual(id.charAt(8), "-", "universally unique identifier character at position 9 must be -");
	deepEqual(id.charAt(13), "-", "universally unique identifier character at position 14 must be -");
	deepEqual(id.charAt(18), "-", "universally unique identifier character at position 19 must be -");
	deepEqual(id.charAt(23), "-", "universally unique identifier character at position 24 must be -");
	try {
		mediator.genID("test");
	} catch (error) {
		deepEqual(error.message, "safe must be a boolean", "safe parameter error caught");
	}
	deepEqual(safe.match(/^[gen-]/) instanceof Array, true, "first 4 characters of a safe id must be a gen-");
	deepEqual(safe.match(/-/g).length, 1, "safe id must only contain 1 dash");
});

/**
 * Listen Method
 * Testing listen method, proper transformation into events
 */
test("Listen method", function () {
	expect(4);
	try {
		mediator.listen([]);
	} catch (error) {
		deepEqual(error.message, "parameter must be an object", "type parameter error caught");
	}
	try {
		mediator.listen({ "click": function() {} });
	} catch (error) {
		deepEqual(error.message, "object key must contain an event and element", "parameter error caught");
	}
	try {
		mediator.listen({ "click #listen .subelement": function() {} });
		deepEqual(true, true, "obj properly formatted");
	} catch (error) {
		deepEqual(false, true, "obj did not properly get formatted");
	}
	
	deepEqual(mediator.listen({ "click #listen": function () { } }), mediator, "mediator should return itself");
});

/**
 * Publish Method
 * Testing publishing events, unique events
 */
test("Publish method", function () {
	expect(8);
	// subscribe/publish events
	mediator.subscribe("event", this.fn)
	    .subscribe("event", this.fn)
	    .subscribe("event2", this.fn2)
	    .subscribe("event2", this.fn2)
	    .subscribe("event2", this.fn2, "unique")
	    .subscribe("event2", this.fn2, "unique")
	    .subscribe("event3", this.fn3)
	    .subscribe("event4", this.fn4)
	    .publish("event")
	    .publish("event3", "", "lorem")
	    .publish("event4", "", { select : true })
	    .publish("event2", "unique");

	// test error catching
	try {
		mediator.publish();
	} catch (error) {
		deepEqual(error.message, "type must be a string", "type parameter error caught");
	}
	try {
		mediator.publish("nonExistingEvent", {});
	} catch (error) {
		deepEqual(error.message, "id must be a string", "id parameter error caught");
	}
	deepEqual(mediator.publish("event", "test"), false, "calling a non exsting id in an existing channel should return false");
	deepEqual(mediator.publish("nonExistingEvent"), false, "calling a non existing channel should return false");
	deepEqual(this.i, 2, "'publish' function should be called twice");
	deepEqual(this.j, 1, "'publish' function should be called once with unique identifier");
	deepEqual(this.arg, "lorem", "should return the string lorem");
	deepEqual(this.arg2.select, true, "should return true");
});

/**
 * Subscribe Method
 * Testing subscribing to events, unique events and setting the context
 */
test("Subscribe method", function () {
	expect(7);
	// subscribe/publish events
	mediator.subscribe("event", function () {})
	        .subscribe("event", function () {})
	        .subscribe("event2", function () {}, "event2")
	        .subscribe("event2", function () {}, "event2")
	        .subscribe("event3", function () { context = this; }, "", this)
	        .subscribe("event4", function () { context2 = this; })
	        .publish("event3")
	        .publish("event4");

	for (e in mediator.subscribers.event) {
		if (mediator.subscribers.event.hasOwnProperty(e)) this.fn();
	}
	for (e in mediator.subscribers.event2) {
		if (mediator.subscribers.event2.hasOwnProperty(e)) this.fn2();
	}
	
	// test error catching
	try {
		mediator.subscribe();
	} catch (error) {
		deepEqual(error.message, "type must be a string", "type parameter error caught");
	}
	try {
		mediator.subscribe("event");
	} catch (error) {
		deepEqual(error.message, "fn must be a function", "type parameter error caught");
	}
	try {
		mediator.subscribe("event", function () {}, {});
	} catch (error) {
		deepEqual(error.message, "id must be a string", "type parameter error caught");
	}
	deepEqual(this.i, 2, "subscribers 'event' should be 2");
	deepEqual(this.j, 1, "subscribers 'event2' should be 1");
	deepEqual(context, this, "Context should be this");
	deepEqual(context2, mediator, "Context should be mediator");
});

/**
 * Unsubscribe Method
 * Testing the unsubscribe functionality
 */
test("Unsubscribe method", function () {
	expect(4);
	mediator.subscribe("event", function () {})
	    .unsubscribe("event")
	    .subscribe("event2", this.fn, "id")
	    .unsubscribe(this.fn);
	
	// test error catching
	try {
		mediator.unsubscribe();
	} catch (error) {
		deepEqual(error.message, "type must be a string or function", "type parameter error caught");
	}
	try {
		mediator.unsubscribe({});
	} catch (error) {
		deepEqual(error.message, "type must be a string or function", "type parameter error caught");
	}
	// unsubscribe to all events by name
	deepEqual(typeof mediator.subscribers["event"], "undefined", "mediator subscribers.event should be undefined");
	// unsubscribe by function
	deepEqual(typeof mediator.subscribers["event2"]["id"], "undefined", "mediator subscribers.event2 should be undefined");
});

/**
 * API Tests
 * Ensures all public element are accessible
 */
test("Test core API", function () {
	expect(6);
	// methods
	deepEqual(typeof mediator.genID === "function", true, "Should be a function");
	deepEqual(typeof mediator.listen === "function", true, "'mediator.listen' should be a function");
	deepEqual(typeof mediator.publish === "function", true, "'mediator.publish' should be a function");
	deepEqual(typeof mediator.subscribe === "function", true, "'mediator.subscribe' should be a function");
	deepEqual(typeof mediator.unsubscribe === "function", true, "'mediator.unsubscribe' should be a function");
	// properties
	deepEqual(typeof mediator.subscribers === "object", true, "'subscribers' is an object");
});