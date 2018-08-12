/**
 * mediator
 * A JavaScript mediator pattern experiment.
 *
 * @author Fabien Doiron <fabien.doiron@gmail.com>
 * @copyright Fabien Doiron 2012
 * @license MIT <http://opensource.org/licenses/mit-license.php>
 * @link http://www.github.com/fabien-d/mediator.js
 * @module mediator
 * @version 0.0.1
 */

/*global define*/
(function (global, undefined) {
	"use strict";

	var document = global.document,
	    Mediator;

	Mediator = function () {

		var genID, listen, publish, subscribe, unsubscribe;

		/**
		 * Generate a version 4 UUID - http://en.wikipedia.org/wiki/Universally_unique_identifier
		 *
		 * @param  {Boolean} safe [Optional] Making an html friendly ID
		 * @return {String}
		 */
		genID = function (safe) {
			var reserved = [8, 9, "a", "b"],
			    str      = function () { return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); },
			    uuid     = "";

			if (typeof safe !== "undefined" && typeof safe !== "boolean") throw new Error("safe must be a boolean");

			uuid = (str() + str() + "-" + str() + "-4" + str().substr(0,3) + "-" + reserved[Math.floor(Math.random() * reserved.length)] + str().substr(0,3) + "-" + str() + str() + str()).toLowerCase();
			return (safe) ? "gen-" + uuid.replace(/-/g, "") : uuid;
		};

		/**
		 * Listen
		 * Transform an object into event listeners
		 * 
		 * @param  {Object} obj Events
		 * @return {Object}
		 */
		listen = function (obj) {
			var evt, arr, el;
			if (typeof obj !== "object" || obj instanceof Array) throw new Error("parameter must be an object");

			for (evt in obj) {
				if (obj.hasOwnProperty(evt)) {
					// split event on first whitespace
					arr = evt.trim().split(/^(.*?)\s/);
					if (arr[0] === "") arr = arr.splice(1);
					if (arr.length !== 2) throw new Error("object key must contain an event and element");
					// split selector on first whitespace
					el = document.querySelector(arr[1].trim()) || undefined;
					// attach event
					if (typeof el !== "undefined") {
						if (typeof el.addEventListener === "function") {
							el.addEventListener(arr[0], obj[evt], false);
						} else if (el.attachEvent) {
							el.attachEvent("on" + arr[0], obj[evt]);
						}
					}
				}
			}

			if (typeof arr === "undefined") throw new Error("listen object must contain at least 1 item");
			return this;
		};

		/**
		 * Publish events in subscribers array
		 * 
		 * @param  {String} type Event to publish
		 * @param  {String} id   [Optional] ID of event
		 * @return {Object}
		 */
		publish = function (type, id, args) {
			var subscriptions, unique, channel, subscription;
			// error catching
			if (typeof type !== "string") throw new Error("type must be a string");
			if (id && typeof id !== "string") throw new Error("id must be a string");
			// set variables
			subscriptions = (id && id !== "") ? this.subscribers[type][id] : this.subscribers[type];
			// return early if no subscription exists
			if (typeof subscriptions === "undefined") return false;
			// trigger unique callback
			if (id) subscriptions.callback.call(subscriptions.context, args);
			else {
				// trigger each channel callback
				for (channel in subscriptions) {
					subscription = subscriptions[channel];
					if (subscriptions.hasOwnProperty(channel)) subscription.callback.call(subscription.context, args);
				}
			}
			return this;
		};

		/**
		 * Subscribe events
		 * 
		 * @param  {String}   type    Event name
		 * @param  {Function} fn      Callback
		 * @param  {String}   id      [Optional] Unique ID
		 * @param  {Object}   context [Optional] Context of callback
		 * @return {Object}
		 */
		subscribe = function (type, fn, id, context) {
			var uuid = id || genID(true);
			// error catching
			if (typeof type !== "string") throw new Error("type must be a string");
			if (typeof fn !== "function") throw new Error("fn must be a function");
			if (typeof uuid !== "string") throw new Error("id must be a string");
			// create a new subscriber object
			// subscribers.{TYPE}.{UUID} = { CALLBACK, CONTEXT }
			if (typeof this.subscribers[type] === "undefined") this.subscribers[type] = {};
			if (typeof this.subscribers[type][uuid] === "undefined") this.subscribers[type][uuid] = {};
			this.subscribers[type][uuid] = { callback: fn, context: context || this };

			return this;
		};

		/**
		 * Unsubscribe events
		 *
		 * @param  {Mixed} type Event name or callback function
		 * @return {Object}
		 */
		unsubscribe = function (type) {
			var channel, subscription, c;
			if (typeof type === "undefined") throw new Error("type must be a string or function");
			switch (typeof type) {
			case "string":
				delete this.subscribers[type];
				break;
			case "function":
				// loop though each channel and subscriptions in them
				// to see if the passed function exists, if so remove
				// the current subscription.
				for (c in this.subscribers) {
					if (this.subscribers.hasOwnProperty(c)) {
						channel = this.subscribers[c];
						for (subscription in channel) {
							if (channel.hasOwnProperty(subscription)) {
								if ((channel[subscription].callback === type)) {
									delete channel[subscription];
								}
							}
						}
					}
				}
				break;
			default:
				throw new Error("type must be a string or function");
			}

			return this;
		};

		return {
			genID       : genID,
			listen      : listen,
			publish     : publish,
			subscribers : {},
			subscribe   : subscribe,
			unsubscribe : unsubscribe
		};
	};

	// AMD and window support
	if (typeof define === "function") {
		define([], function () { return new Mediator(); });
	} else {
		if (typeof global.mediator === "undefined") {
			global.mediator = new Mediator();
		}
	}

}(this));