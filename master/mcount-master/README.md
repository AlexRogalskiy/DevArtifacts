# mcount
[![NPM version](https://badge.fury.io/js/mcount.svg)](http://badge.fury.io/js/mcount) [![Bower version](https://badge.fury.io/bo/mcount.svg)](http://badge.fury.io/bo/mcount)

> Simple, easy, lightweight countdown plugin with moment.js

## Install

- bower `bower install mcount`
- npm `npm install mcount`
- github [mcount](https://github.com/onokumus/mcount/archive/master.zip)

## Setup

#### add data-mcount attribute html file

```html
<span data-mcount="years"></span>
<span data-mcount="months"></span>
<span data-mcount="days"></span>
<span data-mcount="hours"></span>
<span data-mcount="minutes"></span>
<span data-mcount="seconds"></span>
```

#### load moment.js

```html
<script src="moment.js"></script>
```

#### create config file

```javascript
var mcountConfig = {
  end: moment('2019-03-20'),
  start: moment('2015-08-01')
};
```

#### load mcount plugin

```html
<script src="mcount.js"></script>
```

## License

MIT © [onokumus](https://github.com/onokumus)
