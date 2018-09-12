/**
 * Implementaion of a generic store you can populate with data
 *
 * API Short reference:
 *   Store.create(String category, Array items|Object item);
 *   Store.update(String category, Array items|Object item);
 *   Store.get(String category, String id);
 *   Store.remove(String category, Array items|Object item);
 *   Store.clean(String category);
 */
(function (global) {
  'use strict';

  /**
   * Object extend, check for extend, jQuery.extend and _.extend, otherwise
   * use own implementation
   *
   * @param  {Object} object1 Base object
   * @param  {Object} object2 Object to merge in
   * @return {Object}         Extended object
   */
  var extend = global.extend ||
      (global.jQuery && global.jQuery.extend.bind(this, true)) ||
      (global._ && global._.merge) || function (object1, object2) {
    var i;

    for (i in object2) {
       if (object2.hasOwnProperty(i)) {
          object1[i] = object2[i];
       }
    }

    return object1;
  };

  // Store with methods
  var _Store = {

    /**
     * Internal storage object to save data
     * @type {Object}
     */
    storage: {},

    /**
     * Generate unique IDs
     * Taken from http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
     * and shortened UIDs
     * @return {String} Unique id
     */
    generateUuid: function () {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }

      return s4() + s4() + '-' + s4() + '-' + s4();
    },

    /**
     * Find an item based on a name
     * @param  {Array}       category Category in store to find (first level)
     * @param  {String}      id       ID which you want to find
     * @return {null|Object}          Item which was found or null
     */
    find: function (category, id) {
      var item = null;
      var i = 0;

      if (!_Store.storage[category]) {
        return null;
      }

      if (typeof category !== 'string') {
        throw new Error('Store#find: Category ' + category + ' is not a string.');
      }

      if (typeof id !== 'string') {
        throw new Error('Store#find: ID ' + id + ' is not a string.');
      }

      for (; _Store.storage[category].length > i; i++) {
        if (_Store.storage[category][i].id === id) {
          item = _Store.storage[category][i];
        }
      }

      return item;
    },

    /**
     * Create a new category (child) in store
     * @param  {String}       category Name of category you want to create
     * @return {Object|false}          item, if could be created; false if category is alreay available
     */
    createCategory: function (category) {
      if (!_Store.storage[category]) {
        _Store.storage[category] = [];

        return true;
      }

      return false;
    },

    /**
     * Create a new item in store, update exisiting if that's what we're looking for
     * @param  {String}       category Category to look out for
     * @param  {Array}        items     Items that should be created
     * @return {Object|false}          Created object
     */
    create: function (category, items) {
      if (!_Store.storage[category]) {
        throw new Error('Store: Category ' + category + ' does not exist.');
      }

      // Should be an array
      if (items.constructor !== Array) {
        items = [items];
      }

      items.forEach(function (item) {

        if (!item.id) {
          item.id = _Store.generateUuid();
        }

        if (_Store.find(category, item.id)) {
          return _Store.update(category, item);
        }

        // Set an index on _Store item
        item.index = _Store.storage[category].length;

        _Store.storage[category].push(item);
      });

      return items;
    },

    /**
     * Remove item from store
     * @param  {String}  category Category to look out for
     * @param  {Array}   ids      Name of item that should be removed
     * @return {Boolean}          true, if removal was successful
     */
    remove: function (category, ids) {

      // Ensure that we use an array
      if (ids.constructor !== Array) {
        ids = [ids];
      }

      ids.forEach(function (id) {
        var storedItem = _Store.find(category, id);

        if (storedItem !== null) {
          _Store.storage[category] = _Store.storage[category].filter(function (item) {
            return item.id !== id;
          });
        }
      });

      return true;
    },

    /**
     * Update existing items in store
     * @param  {String}         category Category to look out for
     * @param  {Array|Object}   items    New items
     * @return {Object|Boolean}          True, if update was ok; false if item does not exist
     */
    update: function (category, items) {

      // Ensure that we use an array
      if (items.constructor !== Array) {
        items = [items];
      }

      // If category does not exist, throw
      if (!_Store.storage[category]) {
        throw new Error('Store: Category "' + category + '" does not exist.');
      }

      items.forEach(function (item) {
        var storedItem = _Store.find(category, item.id);

        if (storedItem !== null) {
          _Store.storage[category][storedItem.index] = extend(storedItem, item);

          return true;
        }

        return false;
      });
    },

    /**
     * Overwrite exisiting storage
     * @param  {String}      category Category in store to find (first level)
     * @return {Array|false}          Category data, false if categroy not present
     */
    restore: function (category, store) {
      if (!_Store.storage[category]) {
        return false;
      }

      _Store.storage[category] = store;

      return _Store.storage[category];
    }
  };

  /**
   * API
   * @return {Object}
   */
  var Store = function (PubSub) {

    var api = {

      /**
       * Get item from storage, proxy for private _Store.find
       * @param  {Array}       category Category in store to find (first level)
       * @param  {String}      id       id which you want to find
       * @return {null|Object}          Item which was found or null
       */
      get: function (category, id) {
        return _Store.find(category, id);
      },

      /**
       * Create new items
       * @param  {String}       category Category to look out for
       * @param  {Array|Object} items    Item that should be created
       * @return {Object|false}          Item or false
       */
      create: function (category, items) {
        PubSub.publish(category + '.create');

        _Store.createCategory(category);
        return _Store.create(category, items);
      },

      /**
       * Update items in storage, proxy for private _Store.update
       * @param  {Array}        category Category in store to find (first level)
       * @param  {Array|Object} items    Item you want to find
       * @return {Boolean}               Whether or not update was successfull
       */
      update: function (category, items) {
        PubSub.publish(category + '.update');

        return _Store.update(category, items);
      },

      /**
       * Remove item from storage, proxy for private _Store.remove
       * @param  {Array}   category Category in store to find (first level)
       * @param  {Array}   ids      Name which you want to find
       * @return {Boolean}          Whether or not removal was successfull
       */
      remove: function (category, ids) {
        PubSub.publish(category + '.remove');

        return _Store.remove(category, ids);
      },

      /**
       * Get full storage
       * @return {Object} Set full storage
       */
      getAll: function () {
        return _Store.storage;
      },

      /**
       * Get all elements from a category
       * @param  {Array} category Category in store to find (first level)
       * @return {Array}          All items in category
       */
      getAllByCategory: function (category) {
        return _Store.storage[category];
      },

      /**
       * Clean up a category
       * @param  {Array} category Category in store to find (first level)
       * @return {Array}          Empty category
       */
      clean: function (category) {
        PubSub.publish(category + '.clean');

        return _Store.restore(category, []);
      },


      /**
       * Set new store data for category
       * @param  {Array} category Category in store to find (first level)
       * @return {Array}          Category data
       */
      restore: function (category, store) {
        PubSub.publish(category + '.restore');

        return _Store.restore(category, store);
      }
    };

    // Make internal methods public for testing purposes
    if (process && process.env && process.env.__test) {
      api._Store = _Store;
    }

    return api;
  };

  /*
   * AMD, module loader, global registration
   */

  // Expose loaders that implement the Node module pattern.
  if (typeof module === 'object' && module && typeof module.exports === 'object') {
    var PubSub = require('vanilla-pubsub');

    module.exports = Store(PubSub);

  // Register as an AMD module
  } else if (typeof define === 'function' && define.amd) {
    define('Store', ['PubSub'], function (PubSub) {
      return Store(PubSub);
    });

  // Export into global space
  } else if (typeof global === 'object' && typeof global.document === 'object') {
    global.Store = Store(window.PubSub);
  }
}(this));
