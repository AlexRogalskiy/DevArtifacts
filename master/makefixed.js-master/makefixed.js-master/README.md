#makefixed.js

### What's up?

MakeFixed.js is a quick way to dynamically set up elements to be fixed during scroll.

  - Lightweight! Less than 2.4KB;
  - Allow callback functions;
  - jQuery required.

---

[View the demo](https://guimadaleno.github.io/demos/makefixed.js/demo.html)

---

### Installation

- Install via [Bower](http://bower.io) ```bower install --save makefixed```
- Download via [GitHub](https://github.com/guimadaleno/makefixed.js/archive/master.zip)

---

### How to use?

##### Quick way

```javascript
$('.fixed').makeFixed();
```

##### Custom way

In this example, we have several elements using the class .fixed
But we gonna work on a specific element when fixed, id #photo.

```javascript
$('.fixed').makeFixed
({
	onFixed: function (el)
	{
		if ($(el).attr('id') == 'photo')
		{
			$(el).children().css
			({
				width: '500px'
			});
		}
	},
	onUnFixed: function (el)
	{
		if ($(el).attr('id') == 'photo')
		{
			$(el).children().css
			({
				width: '450px'
			});
		}
	}
});
```

---

### Help?
Tweet me: [@guimadaleno](http://twitter.com/guimadaleno)

---

### License
GNU GPL

Enjoy \o
