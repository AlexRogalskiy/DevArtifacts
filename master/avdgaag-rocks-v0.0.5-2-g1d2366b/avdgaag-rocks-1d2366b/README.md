# Rocks

This is a tiny library of mixins and styles for developing large-ish
stylesheets with [Sass][].

I extracted these styles from a bunch of larger-than-average projects I have
worked on, as I found I was repeating myself over and over again. There is
nothing groundbreaking in here, just a useful collection of snippets to build
your own stylesheets with.

This library does not aim to help you write CSS, but better stylesheets. It
provides re-usable components and patterns to help you simplify styling common
objects on your page.

The contents of this project are in partly homegrown and partly borrowed from
projects like [Blueprint][], [Compass][] and many others.

**Note**: this is very much a work in progress. Mind the gap.

# Installation 

## Installation for Rails 3.1+ projects

Include Rocks in your Gemfile:

    gem 'rocks'

Let [Bundler][] install it:

	$ bundle install

Make sure your `application.css` file is compiled by Sass by renaming it to
`application.css.scss`. Import the Rocks stylesheets:

    @import "rocks";

Add your own styles and imports below that.

**Note** if you also include [Bourbon][] in your project, make sure put
`@import "bourbon";` _before_ `@import "rocks";`, as per its installation
instructions.

## Installation for non-Rails 3.1+ projects

Unsupported so far. I may write a simple installer script one day that
automatically copies all the stylesheets into a directory of your choosing. For
now, you'll have to do that manually.

If you are using Sass directly, you could try to just add the Rocks gem to
`load_path`, using something like the following:

```ruby
Sass::Engine.new(my_stylesheet,
  :syntax => :scss,
  :load_path => [
    File.join(`bundle show rocks`, 'app', 'assets', 'stylesheets')
  ]
 )
```

This would allow you to `@import 'rocks';` in the `my_stylesheet` file.

# Contents

## Grid

Contains functions and mixins for working with a grid-based layout. The grid is
based on variables `$grid-column-width` and `$grid-margin`. It provides the
following functions:

* `span(n)`: get a width value for `n` number of columns.
* `columns(n)`: get the total width of a number of columns.

The difference between `span` and `columns` is inclusion of `$grid-margin` at
the end.

It contains the following mixins:

* `column($span, $with_margin: true)`: make an element a column, spanning
  `$span` number of columns.
* `container`: container for `column` elements. Simply a relatively positioned
  wrapped with clearfix applied.
* `rcontainer`: container for `rcolumn` elements. Contains negative left
  margin, that counters the left margin of the first `rcolumn` it contains.
* `rcolumn($span)`: same as `column` but with margin applied to the left, so
  you don't need to remove margin from the last column in a group.
* `prepend($span)`: pad an element with `$span` columns to the left.
* `append($span)`: pad an element with `$span` columns to the right.
* `push($span)`: move an element to the right over `$span` columns.
* `pull($span)`: move an element to the left over `$span` columns.

## Layout

Contains simple layout helper mixins:

* `float($dir: 'left')`: float en element left or right, including the
  `display: inline` so often needed for IE.
* `outdent($selector, $amount, $dir: 'left', $with-padding)`: make a child
  element outdented. Useful for a story with some text and an image, where all
  the text should be beside the image.
* `align($dir: 'left', $v: $line, $h: $grid-margin, $mirror: false)`: float an
  element with margins. Useful for left- or right floating images.
* `clearfix`: clears floated elements inside.
* `outset-left($gutter: $grid-margin, $with-padding)`: create an outdent to the
  left, using a negative margin and opposing padding.
* `outset-right($gutter: $grid-margin, $with-padding)`: create an outdent to
  the right, using a negative margin and opposing padding.
* `outset($gutter: $grid-marign, $with-padding: true)`: outdent to both the
  left and right.
* `leading($amount: $line)`: add whitespace before an element.
* `trailing($amount: $line)`: add whitespace after an element.
* `surrounding-lines`: adds a single line-height whitespace before and after
  the element.
* `voutset-top($amount, $border: 0)`: vertically outset an element, adding
  negative margin and positive padding to the top.
* `voutset-bottom($amount, $border: 0)`: vertically outset an element, adding
  negative margin and positive padding to the bottom.
* `voutset($amount, $border: 0)`: vertically outset an element by applying
  negative marings and countering paddings top top and bottom.

All of `leading`, `trailing`, `voutset-top` and `voutset-bottom` can take both
pixel values as arguments, or a unit-less number. When given a unit-less
number, it will be fed to the `lines` function.

When using any of the `voutset` mixins, you can add an optional `$border`
argument to reduce the amount of padding that is applied, leaving room for a
border on element while preserving vertical rhythm.

It also contains a plain class `.clearfix` that you can use in your HTML. It is
meant, however, to be used with `@extend`. When your stylesheet needs a lot of
clearfixes, the end result will contain _a lot_ of duplicated code. Using
`@extend .clearfix` you can define the class once, and simply apply many
selectors to it.

## Links

Provides mixins for common link behaviours:

* `link-hover`: hide underline on normal links, show it on hover and focus.
* `link-colors($link, $visited, $hover, $active)`: set all colors at once.
* `link-colors-lighten($color)`: use `link-colors` to use a single color for
  all links, but lighten the hover, focus and active styles slightly using the
  `lighten` function.
* `link-colors-darken($color)`: like `link-colors-lighten` but using the
  `darken` function instead of `lighten`.
* `link-press`: make a link 'pressable' by offsetting it 1px in its active
  state.
* `link-unstyled($color: $color-text)`: make a link appear as regular text.
* `link-block($target: .target)` make a link work as a block, wrapping multiple
  elements that will be clickable. The (optional) target selector applies
  styles to a child element that should _appear_ as a link, by extending
  `.block-link-target` -- which you should define yourself.

## Lists

Provides basic building blocks for styling lists:

* `list-no-bullets`: removes list bullets.
* `list-plain`: removes bullets and spacing.
* `list-inline`: removes bullets and shows elements inline.
* `list-horizontal($margin: $grid-margin, $dir: 'left')`: floats all chilren to
  a horizontal list.
* `list-dl-table($width, $margin: $grid-margin)`: show a term and its
  definition (dt and dd) on a single line.
* `list-image-bullets($img, $padding: $grid-margin, $x: 0, $y: 0)`: use an
  image as list bullet using the background-image technique.

## Reset

Provides a single `reset` mixin that reset all styles. You probably want to mix
this into your `body` selector, but you could also use it for a local reset in
a specific element.

## Type

Defines the following variables:

* `$line`: the base line height of your site. Used in many different places for
  marigns, paddings and heights to achieve a sensible vertical rhythm. Defaults
  to `20px`.
* `$size-text`: the default text size. Defaults to `14px`.
* `$color-text`: the default text color. Defaults to `#444`.

Defines the following functions:

* `lines($n)`: returns a mutliple of `$lines`.

It defines the following mixins:

* `rhythm(...)`: apply various aspects of vertical rhythm in one go,
  using a combination of arguments. See the inline docs for more
  information.
* `text-icon($img, $padding: $grid-margin, $x: 0, $y:0)`: give an element an
  icon by setting an image to the background and applying some padding.
* `text-replace($img, $x: 0, $y: 0, $w: false, $h: false)`: replace an
  element's text with an image by setting it to the background. You can
  optionally specify width, height and background positioning.

# History

See CHANGELOG.md for a full of changes.

# Credits

**Author**: Arjan van der Gaag  
**URL**: http://arjanvandergaag.nl

# License

See the LICENSE file for more information.

[Sass]: http://sass-lang.com
[Compass]: http://compass-style.org
[Blueprint]: http://blueprintcss.org
[Bourbon]: https://github.com/thoughbot/bourbon
[Bundler]: http://gembundler.com
