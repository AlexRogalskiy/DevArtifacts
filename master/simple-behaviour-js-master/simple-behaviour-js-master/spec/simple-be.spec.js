describe('Simple behaviour', function() {
  "use strict";
  var SimpleBe = window.SimpleBe;

  it('finds modules', function() {
    var module = $('<div data-module="a-module"></div>');
    $('body').append(module);

    expect(SimpleBe.modules.find().length).toBe(1);
    expect(SimpleBe.modules.find().eq(0).is('[data-module="a-module"]')).toBe(true);
    module.remove();
  });

  it('finds modules in a container', function() {
    var module = $('<div data-module="a-module"></div>'),
        container = $('<div></div>').append(module);

    expect(SimpleBe.modules.find(container).length).toBe(1);
    expect(SimpleBe.modules.find(container).eq(0).data('module')).toBe('a-module');
  });

  it('finds modules that are a container', function() {
    var module = $('<div data-module="a-module"></div>'),
        container = $('<div data-module="container-module"></div>').append(module);

    expect(SimpleBe.modules.find(container).length).toBe(2);
    expect(SimpleBe.modules.find(container).eq(0).data('module')).toBe('container-module');
    expect(SimpleBe.modules.find(container).eq(1).data('module')).toBe('a-module');
  });

  describe('when a module exists', function() {
    var callback;

    beforeEach(function() {
      callback = jasmine.createSpy();
      SimpleBe.Modules.TestAlertModule = function(element) {
        this.start = function() {
          callback(element);
        }
      };
    });

    afterEach(function() {
      delete SimpleBe.Modules.TestAlertModule;
    });

    it('starts modules within a container', function() {
      var module = $('<div data-module="test-alert-module"></div>'),
          container = $('<div></div>').append(module);

      SimpleBe.modules.start(container);
      expect(callback).toHaveBeenCalled();
    });

    it('does not start modules that are already started', function() {
      var module = $('<div data-module="test-alert-module"></div>'),
          container = $('<div></div>').append(module);

      SimpleBe.modules.start(module);
      SimpleBe.modules.start(module);
      expect(callback.calls.count()).toBe(1);
    });

    it('passes the HTML element when initialising a module', function() {
      var module = $('<div data-module="test-alert-module"></div>'),
          container = $('<h1></h1>').append(module);

      SimpleBe.modules.start(container);

      var args = callback.calls.argsFor(0);
      expect(args[0].is('div[data-module="test-alert-module"]')).toBe(true);
    });

    it('starts all modules that are on the page', function() {
      var modules = $(
            '<div data-module="test-alert-module"></div>\
             <strong data-module="test-alert-module"></strong>\
             <span data-module="test-alert-module"></span>'
          );

      $('body').append(modules);
      SimpleBe.modules.start();
      expect(callback.calls.count()).toBe(3);

      modules.remove();
    });
  });
});
