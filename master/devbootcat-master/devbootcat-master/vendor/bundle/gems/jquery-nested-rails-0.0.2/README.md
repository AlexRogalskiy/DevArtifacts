# Jquery Nested Rails

jQuery Nested for a complete gap free, multi column grid layout experience.

<br>Demo: [http://suprb.com/apps/nested/](http://suprb.com/apps/nested/)

This gem provides:

* Jquery Nested 1.03 - [Jquery Nested](https://github.com/suprb/Nested)

#### Compare the result

Nested to the left and Grid-A-Licious/Masonry to the right.

!["compare"](https://dl.dropbox.com/u/35476/compare.jpg)

## What is Nested?

Nested is a jQuery plugin which allows you to create multi-column, dynamic grid layouts. How is this done? Nested does three things. It creates a matrix of all elements and creates a multi column grid, similar to other libraries and scripts out there. Then it scans the maxtric for gaps and tries to fill them by reordering the elements. This is exactly how I’ve seen other newer libraries, scripts and modifications behave but if you stop here, the result will sometime leave unwanted gaps as well. That is why I added the last step, an option to resize any element at the bottom of the grid that is bigger (or smaller if you prefer) than the gap to make the grid completely gap-free.

## Installation

Add this line to your application's Gemfile:

For Rails 3+ apps, add the jquery-nested-rails gem to your Gemfile.

    gem 'jquery-nested-rails'

And then execute:

    $ bundle install

Or install it yourself via:

    $ bundle exec rake build
    $ gem install --local pkg/jquery-nested-rails-0.0.1.gem


## Usage

### Generator
Run the generator by following command
```
rails g jquery_nested_rails:install
```
This generator will add the Jquery Nested in your javascript manifiest of asset pipeline. 

If you are using the Rails 3.1 or greater and if you are using the less than rails 3.1 then this generator will add the javascript into your public javascript flder.

### Rails 3.1 or greater

The Jquery Nested files and all dependencies will be added to the asset pipeline and be 
available for you to use. If they're not already in app/assets/javascripts/application.js, 
add these lines:

    //= require jquery.nested


### Rails 3.0 or lesser
```
<%= javascript_include_tag  "jquery.nested" %>
```
Jquery Nested has a dependency on the `jQuery-rails` gem.


## Markup

Use a container element with a group of child items that use the chosen option selector setting (default: `.box`).

```html
<div id="container">
  <div class="box size11"></div>
  <div class="box size12"></div>
  <div class="box size21"></div>
  <div class="box size22"></div>
  ...
</div>
```

Sizing of items are handled by adding `sizeWH` where ` W ` is the number of columns the box shall use and ` H ` is the number of rows the box shall use. E.g ` size15 ` equals ` width: 1 column ` and ` height: 5 rows `

The base column and row size is set by the `minWidth` option.

## Options

### selector

Default : `.box`

```javascript
$("#container").nested({selector: '.box'});
```

### minWidth

Default : `50`

```javascript
$("#container").nested({minWidth: 100});
```

### minColumn
Default : `1`

```javascript
$("#container").nested({minColumn: 1});
```

### gutter
Default : `1`

```javascript
$("#container").nested({gutter: 1});
```

###resizeToFit

Default : `true`

If true, any box bigger than the gap will be resized to fill the gap.

```javascript
$("#container").nested({resizeToFit: true});
```
### resizeToFitOptions

Default option below

#### resizeAny

If true, any box bigger or smaller than the gap will be resized to fill the gap.

Default : `true`

```javascript
$("#container").nested({
  resizeToFit: true,
  resizeToFitOptions: { 
    resizeAny: true
  }
});
```

### animate
Default : `false`

```javascript
$("#container").nested({animate: false});
```

###animationOptions

Default options below

#### speed
A number of milliseconds to render each object (e.g. 200).

Default : `20`

#### duration
A number of milliseconds to run the animation (e.g. 300).

Default : `100`

#### queue
Queued objects or not.

Default : `true`

#### complete
A function to be executed whenever the animation completes.

Default : `function()`

```javascript
$("#container").nested({
  animate: true,
  animationOptions: {
    speed: 100,
    duration: 200,
    queue: true,
    complete: onComplete
  }
});
```
###Some examples

####Example 01
This example uses a custom width and the default gutter `20px`

```javascript
$("#example1").nested({
  minWidth: 20
});
```

####Example 02
This example uses custom width and gutter

```javascript
$("#example2").nested({
  minWidth: 100,
  gutter: 10
});
```

####Example 03
Prepending and appending items

```javascript
$("#example3").nested({
  minWidth: 25,
  gutter: 1,
  animate: true,
  animationOptions: {
    speed: 10,
    duration: 20,
    complete: onComplete
  }
});
```

Prepend and Append buttons
```javascript
$('#prepend').click(function(){
  var boxes = makeBoxes();
  $("#example3").prepend(boxes).nested('prepend', boxes);
});

$('#append').click(function(){
  var boxes = makeBoxes();
  $("#example3").append(boxes).nested('append', boxes);
});
```

## Acknowledgement

To [Jonas Blomdin](http://github.com/jonasblomdin/) for creating Jquery Nested Plugin.

## Licence

The MIT License

Copyright (c) 2013 Anup Pareek See LICENSE for further details.