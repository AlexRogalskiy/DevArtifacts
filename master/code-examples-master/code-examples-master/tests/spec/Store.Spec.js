/**
 * Test specification for Store
 *
 * Tests with Jasmine
 */
'use strict';

// Just let the lib know, that we're in a test mode
process.env.__test = {};

var PubSub = require('vanilla-pubsub');
var Store = require('../Store');

// Extend functionallity
var extend = function (object1, object2) {
  var i;

  for (i in object2) {
     if (object2.hasOwnProperty(i)) {
       object1[i] = object2[i];
     }
  }

  return object1;
};

describe('Store', function () {

  beforeEach(function () {

    // Clear storage
    Store._Store.storage = {};

    // Some test items to reuse
    this.testItems = [{
      id: '1',
      foo: 'foo'
    }, {
      id: '2',
      foo: 'bar'
    }, {
      id: '3',
      foo: 'baz'
    }];
  });

  it('has access to internal methods', function () {
    expect(Store._Store).toBeDefined();
  });

  /**
   * Public methods
   */
  describe('Public', function () {
    it('creates entries', function () {
      var item;
      var createdItem = Store.create('foo', [{}, {}]);

      item = Store._Store.storage.foo;

      // Check return value
      expect(createdItem instanceof Object).toEqual(true);
      expect(createdItem).toEqual(item);

      expect(item instanceof Array).toEqual(true);
      expect(item.length).toEqual(2);
    });

    it('finds entries', function () {
      var item;

      Store.create('foo', [this.testItems[0]]);

      item = Store.get('foo', '1');

      expect(item).toBeDefined();
      expect(item.index).toEqual(0);
      expect(item.foo).toEqual('foo');

      item = Store.get('foo', '2');

      expect(item).toEqual(null);

    });

    it('updates entries', function () {
      var items;
      var createdItems;

      createdItems = Store.create('foo', [this.testItems[0], {}]);

      items = Store._Store.storage.foo;

      expect(items instanceof Array).toEqual(true);
      expect(items.length).toEqual(2);
      expect(createdItems[0].bar).not.toBeDefined();

      Store.update('foo', extend(this.testItems[0], {
        bar: 'bar'
      }));

      items = Store._Store.storage.foo;

      expect(items instanceof Array).toEqual(true);
      expect(items.length).toEqual(2);
      expect(items[0].bar).toBeDefined();
      expect(items[0].bar).toEqual('bar');
    });

    it('removes entries', function () {
      var items;
      Store.create('foo', [
        this.testItems[0],
        this.testItems[1],
        this.testItems[2]
      ]);

      items = Store._Store.storage.foo;

      expect(items instanceof Array).toEqual(true);
      expect(items.length).toEqual(3);

      Store.remove('foo', '1');

      items = Store._Store.storage.foo;

      expect(items instanceof Array).toEqual(true);
      expect(items.length).toEqual(2);
      expect(items[0].id).not.toEqual('1');

      Store.remove('foo', ['2', '3']);

      items = Store._Store.storage.foo;

      expect(items instanceof Array).toEqual(true);
      expect(items.length).toEqual(0);
    });

    it('gets full storage', function () {
      var createdItems = Store.create('foo', [
        this.testItems[0],
        this.testItems[1],
        this.testItems[2]
      ]);

      var storage = Store.getAll();

      expect(storage).toEqual({
        foo: createdItems
      });
    });

    it('gets all elements by one category', function () {
      var createdItems = Store.create('foo', [
        this.testItems[0],
        this.testItems[1],
        this.testItems[2]
      ]);

      var storage = Store.getAllByCategory('foo');

      expect(storage).toEqual(createdItems);
    });

    it('cleans (removes all elements) from one category', function () {
      Store.create('foo', this.testItems[0]);
      Store.clean('foo');
      expect(Store._Store.storage.foo).toEqual([]);
    });

    it('sets new store for category', function () {
      Store.create('foo', this.testItems[0]);
      expect(Store._Store.storage.foo).toEqual([this.testItems[0]]);

      Store.restore('foo', this.testItems);
      expect(Store._Store.storage.foo.length).toEqual(this.testItems.length);
      expect(Store._Store.storage.foo).toEqual(this.testItems);
    });

    /**
     * Events
     */
    describe('Events', function () {
      beforeEach(function () {
        this.test = function () {};
        spyOn(this, 'test');
      });

      it('fires event upon creation', function () {
        PubSub.subscribe('Test.create', this.test);
        Store.create('Test', {});

        expect(this.test).toHaveBeenCalled();
      });

      it('fires event upon update', function () {
        Store.create('Test', this.testItems[0]);
        PubSub.subscribe('Test.update', this.test);

        Store.update('Test', extend({ test: 'test' }, this.testItems[0]));

        expect(this.test).toHaveBeenCalled();
      });

      it('fires event upon removal', function () {
        Store.create('Test', this.testItems[0]);
        PubSub.subscribe('Test.remove', this.test);

        Store.remove('Test', this.testItems[0].id);

        expect(this.test).toHaveBeenCalled();
      });

      it('fires event upon clean', function () {
        Store.create('Test', this.testItems[0]);
        PubSub.subscribe('Test.clean', this.test);

        Store.clean('Test');

        expect(this.test).toHaveBeenCalled();
      });

      it('fires event upon restore', function () {
        Store.create('Test', this.testItems[0]);
        PubSub.subscribe('Test.restore', this.test);

        Store.restore('Test', this.testItems);

        expect(this.test).toHaveBeenCalled();
      });
    });

  });

  describe('Internal', function () {

    /**
     * Create
     */
    it('creates category if there is none', function () {
      var item = Store._Store.storage.foo;

      expect(item).toBeUndefined();

      Store.create('foo', this.testItems[0]);

      item = Store._Store.storage.foo;

      expect(item).toBeDefined();
      expect(item instanceof Array).toEqual(true);
    });

    it('creates single entry', function () {
      var item;

      Store.create('foo', this.testItems[0]);

      item = Store._Store.storage.foo;

      expect(item instanceof Array).toEqual(true);
      expect(item.length).toEqual(1);
      expect(item[0].id).toEqual('1');
    });

    it('creates item which has an index', function () {
      var item;

      Store.create('foo', this.testItems[0]);

      item = Store._Store.storage.foo;

      expect(item[0].index).toBeDefined();
      expect(item[0].index).toEqual(0);
    });

    it('creates multiple entries', function () {
      var item;

      Store.create('foo', [this.testItems[0], this.testItems[1]]);

      item = Store._Store.storage.foo;

      expect(item.length).toEqual(2);
      expect(item[0].id).toEqual('1');
      expect(item[1].id).toEqual('2');
    });
  });
});
