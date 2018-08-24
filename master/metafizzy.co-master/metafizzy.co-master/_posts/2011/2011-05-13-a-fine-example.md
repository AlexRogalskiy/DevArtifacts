---

title: A fine example
category: blog
layout: blog

---

Recently, some of my favorite people have taken the time to point out how Isotope is a fine example of developing for the best of what's available.

## [Trigger CSS3 Animations with jQuery](http://awardwinningfjords.com/2011/05/06/trigger-css3-animations-with-jquery.html) by Thomas&nbsp;Reynolds

Thomas was awesome enough to properly explain one of the coolest features of Isotope -- how it handles CSS3 transforms within jQuery. Implementing transforms via JavaScript is a bit kludgy, as all the various functions -- `translate(10px, 20px)` and `scale(0.5)` -- get passed in as one string. This can be problematic when you only want to change one of those functional notations, and leave the other in tact. Isotope utilizes the [CSS hooks introduced in jQuery 1.4.3](http://api.jquery.com/jQuery.cssHooks/) to keep track of the transforms. This article details how you can use this feature to your own advantage.

## [Bring your apps to life with CSS](http://nimbu.in/unplugged/#slide40) by Divya Manian

I'm a big fan of [Divya](http://nimbupani.com/)'s because she draws a clear line when it comes to best practices. So I was all the more delighted to find Isotope get a mention in a recent talk.

## [HTML5, CSS3, and DOM Performance](http://www.youtube.com/watch?v=q_O9_C2ZjoA#t=9m53s) by Paul Irish

<iframe width="480" height="390" src="http://www.youtube.com/embed/q_O9_C2ZjoA?rel=0" frameborder="0" allowfullscreen="allowfullscreen"> </iframe>

Isotope portion starts at 9:53

Paul uses Isotope to talk about hardware acceleration. Getting the plugin to use hardware acceleration was no easy task, as I needed to develop all the stuff that Thomas talks about. 

It's fantastic to see Isotope get this sort of recognition. I find it encouraging that each of the above mentions discuss not just Isotope's features, but how it has a series of fallbacks and intelligence built into it to enable its features in the best manner possible.