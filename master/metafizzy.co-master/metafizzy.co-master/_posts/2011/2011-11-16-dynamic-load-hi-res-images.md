---

title: Dynamically load hi-res images with Isotope
category: blog
layout: blog

---

Isotope can make any ol' image gallery especially more compelling. But if you're loading in 20+ images at a time, it makes sense to get the smaller images with manageable filesizes. [Rodrigo Sanchez](http://www.flightstudio1.com/) was curious if there was a way to load in high-resolution, big filesize images after user-interaction, like when the image is clicked.

The solution is to use a little bit of Isotope, but mostly depend on some custom jQuery to handle the logic.

+ Markup uses smaller thumbnail `<img>`, but links to larger hi-res images in `<a>`.
+ When a link to an image is clicked, we'll check if a larger image needs to be in loaded.
+ If so, first we'll add a loading GIF indicator to help users be patient.
+ The large image will be dynamically added with jQuery, using the `href` attribute from the `<a>` as the `src` for the new `<img>`.
+ Isotope's included [imagesLoaded](http://isotope.metafizzy.co/docs/help.html#imagesloaded_plugin) is used to detect when that new image has loaded.
+ After the image has loaded, we hide the small image, and show the large.
+ If an image is clicked and it already has loaded a big image, we just need to show it.
+ To Show/hide images, we'll toggle a class `.large`. Simple CSS styles will handle what gets hidden/shown with that class on or off

<iframe style="width: 100%; height: 460px" src="http://jsfiddle.net/desandro/zhbLL/3/embedded/result,js,css,html" allowfullscreen="allowfullscreen" frameborder="0"> </iframe>

[View fiddle - Isotope - dynamically load images](http://jsfiddle.net/desandro/zhbLL/3/embedded/result,js,css,html,resources/)

Loading these big images into the Isotope layout will typically put them in a different spot from their thumbnails. You can add automatic scrolling with the [jQuery scrollTo plugin](http://demos.flesler.com/jquery/scrollTo/).

+ Get position of the container's top.
+ Set `itemPositionDataEnabled: true` in Isotope's options. See details on [itemPositionDataEnabled](http://isotope.metafizzy.co/docs/options.html#itempositiondataenabled).
+ When clicked, use `$.scrollTo`. The `top` value is calculated from `.data('isotope-item-position').y + containerTop`.

[View fiddle - Isotope - dynamically load images, and scrollTo](http://jsfiddle.net/desandro/zhbLL/2/embedded/result,js,css,html,resources/)
