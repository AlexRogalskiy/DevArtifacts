# sass-mixins
Useful sass mixins without bs
- all demos are listed here as a collection: http://codepen.io/collection/AKwvjR/

## List of mixins included:


### font-face
- include local fonts easy
- usage `@include font-face('hk_grotesklight', '../fonts/hk-grotesk/hkgrotesk-light-webfont')`

### breakpoint
- for mediquerys with singe argument
- usage: `@include breakpoint(xl){}` or `@include breakpoint(600px, min-width){}` or `@include breakpoint(number or predefined point, max-width(px)/min-width(px)/or any other feature){}`
- define variables for breakpoints before usage
- demo: http://codepen.io/riogrande/pen/jqPJPO

### breakpoints
- for mediquerys with two breakpoint arguments
- usage: `@include breakpoints(400px, 600px){}` or `@include breakpoints(400px, 600px, 'only screen'){}`
- `$media-type` is disabled as default
- demo: http://codepen.io/riogrande/pen/JXYPKY

### box-sizing
- usage: `@include box-sizing;`
- with or without arguments, border-box is default

### clearfix 
- usage: `@include clearfix;`
- no arguments

### transitions
- usage: `@include transitions; or @include transitions(color, .5, ease-out, .1);`
- demo: http://codepen.io/riogrande/pen/WwrdJo

### border-radius-radius
- for the rounded edges
- usage: `@include border-radius-radius; or @include border-radius-radius(5px);`
- demo: http://codepen.io/riogrande/pen/mPVprY

### border-radius-round
- for circling
- usage: `@include border-radius-round; or @include border-radius-round(100%);`
- demo: http://codepen.io/riogrande/pen/mPVprY

### border-radius-custom
- for defining only some rounded corners
- usage: `@include border-radius-custom;` or `@include border-radius-custom(5px, 5px, 0, 0);`
- second example above will give 5px border radius on top left and top right corner
- demo: http://codepen.io/riogrande/pen/mPVprY

### center 
- center anything - with position absolute
- usage: `@include center(vertical/horizontal/both)`
- must have argument
- demo: http://codepen.io/riogrande/pen/VaeyMR

### box-shadow
- usage: `@include box-shadow;` or `@include box-shadow(0, 2px, 2px, #333);`
- demo: http://codepen.io/riogrande/pen/grPoeb

### gradient
- usage: `@include gradient(90, #fff, #333);`
- must have argument
- demo: http://codepen.io/riogrande/pen/XdXVYq

### rotate
- usage: `@include rotate;` or `@include rotate(90);`
- demo: http://codepen.io/riogrande/pen/pygpZr

### opacity
- usage `@include opacity(0.5);`
- must have argument
- demo: http://codepen.io/riogrande/pen/xVMyKr

## Installation
- copy/paste to your project
- include as partial 

## Licence
Do what ever you want 
