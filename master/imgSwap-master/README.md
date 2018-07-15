#imgSwap.js
##Super simple responsive images

Will be working on this readme soon


##Basic Usage
```html

  <img src="img/path/image-sml.jpg" data-swap=true alt="my image" />  
  
  	<script src="js/imgswap.min.js"></script>
 	<script>
		imgSwap.init();
	</script>	

```

##Advanced Usage
```html

  <img src="img/path/image-sml.jpg" data-swap=true alt="my image" />  
  
  	<script src="js/imgswap.min.js"></script>
 	<script>
		imgSwap.init({
		    selector: '[data-swap]', 
		    suffixes: ['sml', 'med', 'lrg'], 
		    breakpoints:[480, 900],
		    throttle: 250
		});
	</script>	

```