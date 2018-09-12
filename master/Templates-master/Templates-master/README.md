# Templates - vanilla-templates

Template parsing with Hogan

[![Build Status](https://api.travis-ci.org/drublic/Templates.svg)](http://travis-ci.org/drublic/Templates)

You can read more about Hogan and Mustache here:

* Hogan: http://twitter.github.io/hogan.js/
* Mustache: http://mustache.github.io/

## Install

You can install Templates via npm

    `npm install --save vanilla-templates`

## Usage

Elements with the attribute `x-template` get indexed by their name and
injected into the DOM where the attribute `x-template-inject` matches the
template's name.

To inject a specific template you can call
`Templates.inject(templatename, data)` while `templatename` is the value of
`x-template` and `data` is the object or array of objects that holds the data
to be passed to the Hogan template.

## Example

### Inject

Here is an example template:

    <script x-template="foobar">
      <h1>{{title}}</h1>
    </script>

You would need an element where your temptate should be injected with data:

    <div x-template-inject="foobar"></div>

In JS you would now call the template with the according data:

    Templates.inject('foobar', {
      title: 'This was fun!'
    });

This renders in HTML as:

    <div x-template-id="foobar__08a2341b"><h1>This was fun!</h1></div>

and is injected at the point where you defined `x-template-inject="foobar"`.
The ID is generated automatically but you can also define manual IDs by setting
`id` on each object you inject.

    Templates.inject('foobar', {
      title: 'This was fun!',
      id: 'title-element'
    });

The generated ID will be stored on each object.

You can pass a thrid parameter `callback` to `Templates.inject`.

    Templates.inject('foobar', {
      title: 'This was fun!',
      id: 'title-element'
    }, function (data) {
      // Play with `data` for each element
    });

The forth parameter is a boolean value: `wrap`. If set to `false` the div around
each rendered template is not printed.

### Update

If you want to you can now update the data like this:

    Templates.update('foobar', 'title-element' {
      title: 'This is even more fun!',
      id: 'title-element'
    });

### Why?

Most of the time you need some kind of system around building templates and
injecting them. This plugin enables you to do so with a couple of conventions.
