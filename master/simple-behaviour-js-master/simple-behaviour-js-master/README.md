# Simple behaviour

A module pattern that makes it easy to write re-usable components without having to worry about when to instantiate a module, or what scope to give it.

## Specify behaviour in markup

Javascript modules can be specified in markup using `data-` attributes:

```html
<div data-module="some-module">
  <strong>Some other markup inside the module</strong>
</div>
```

Include jQuery and `SimpleBe.js` then find and start these modules by running:

```javascript
$(document).ready(function(){
  SimpleBe.modules.start()
});
```

This will attempt to find and start all modules in the page. In this example it will look for a module at `SimpleBe.Modules.SomeModule`. The data attribute gets converted to _PascalCase_.

The module will be instantiated and then its `start` method called. The HTML element with the `data-module` attribute is passed as the first argument to the module initialiser. Modules act only within their containing elements.

```javascript
module = new SimpleBe.Modules[type]()
module.start(element)
```

Running `SimpleBe.modules.start()` multiple times will have no additional affect. When a module is started a flag is set on the element using the data attribute `module-started`. `data-module-started` is a reserved attribute.

`SimpleBe.modules.start()` can be called with an element to start modules in dynamically loaded content:

```javascript
var $container = $('.dynamic-content')
SimpleBe.modules.start($container)
```

## Module structure

A module must add its constructor to `SimpleBe.Modules` and it must have a `start` method.
The simplest module looks like:

```javascript
;(function(Modules) {
  'use strict'

  Modules.SomeModule = function($element) {
    this.start = function() {
      // module code
    }
  }
})(window.SimpleBe.Modules)
```

## Writing modules

It helps if modules look and behave in a similar manner.

### Use `js-` prefixed classes for interaction hooks

Make it clear where a javascript module will be applying behaviour:

```html
<div data-module="toggle-thing">
  <a href="/" class="js-toggle">Toggle</a>
  <div class="js-toggle-target">Target</div>
</div>
```

### Declare event listeners at the start

Beginning with a set of event listeners indicates the module’s intentions.

```js
this.start = function() {
  $element.on('click', '.js-toggle', toggle)
  $element.on('click', '.js-cancel', cancel)
}
```

Where possible, assign listeners to the module element to minimise the number of listeners and to allow for flexible markup:

```html
<div data-module="toggle-thing">
  <a href="/" class="js-toggle">This toggles</a>
  <div class="js-toggle-target">
    <p>Some content</p>
    <a href="/" class="js-toggle">This also toggles</a>
  </div>
</div>
```

### Use data-attributes for configuration

Keep modules flexible by moving configuration to data attributes on the module’s element:

```html
<div
  data-module="html-stream"
  data-url="/some/endpoint"
  data-refresh-ms="5000">
  <!-- updates with content from end point -->
</div>
```
