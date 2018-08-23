==================
 Fyre
==================
Version 0.7-pre

Introduction
------------

Fyre provides a rendering of the Peter de Jong map, with an interactive
GTK+ frontend and a command line interface for easy and efficient rendering
of high-resolution, high quality images.

This program was previously known as 'de Jong Explorer', but has been
renamed to make way for supporting other chaotic functions.

All the images you can create with this program are based on the simple
Peter de Jong map equations:

   x' = sin(a * y) - cos(b * x)
   y' = sin(c * x) - cos(d * y)

For most values of a,b,c and d the point (x,y) moves chaotically. The
resulting image is a map of the probability that the point lies within
the area represented by each pixel. As you let Fyre render longer it collects
more samples and this probability map and the image becomes more accurate.

The resulting probability map is treated as a High Dynamic Range image.
This software includes some image manipulation features that let you
apply linear interpolation and gamma correction at the full internal
precision, producing a much higher quality image than if you tried to
create the same effects using standard image processing tools.
Additionally, Gaussian blurs can be applied to the image using a
stochastic process that produces much more natural-looking images than
most programs, again without losing any of the image's original precision.


Loading and Saving
------------------

All images saved using the GTK+ frontend or the -o command line option
are standard PNG files containing an extra 'tEXt' chunk with all the
parameters used to create the image. This means the image can be loaded
back in using the -i command line option or the "Parameters -> Load from image"
menu item.

One convenient use of this is to save small low-quality images using the
GUI, then use the -i, -t, -s, and -o options to render very high quality
and/or large images noninteractively.

When using the -o (--output) option, no GUI is presented. Instead, Fyre
just outputs status lines every so often with the current rendering process.
These lines include:

  - percent completion
  - current number of iterations
  - speed in iterations per second
  - current and target peak density values
  - elapsed and estimated remaining time


Animation
---------

Fyre now includes a somewhat experimental animation system. From the main
explorer window, use View -> Animation window to open the animation interface.
Animations are represented as a list of keyframes, with a transition after
each. Keyframes can be manipulated with the buttons at the top of the window.
Transitions consist of a duration, in seconds, and an editable curve. This
curve's presets can be used to transition linearly or ease in and out of
keyframes, but you can also edit the curve for more complex effects.

Each keyframe in the list also shows you the bifurcation diagram between
that keyframe's parameters and the next. Intense black dots or lines in
the bifurcation diagrams are fixed points or limit cycles, which usually
don't look good in animation.

You can preview the animation by dragging the two horizontal seek bars,
or using the 'play' button. The keyframe list can be loaded from and
saved to a custom binary format. Once you have an animation you like,
you can get a higher quality version using File -> Render. The result
will be an uncompressed .AVI file. You can use tools like mencoder or
transcode to compress this file with your favorite codec.

Animations can also be rendered from the command line using the -n and
-o options together.


Dependencies
------------

- GTK+ 2.0
- libglade


Compiling
---------

Nothing fancy, just type 'make'. Currently the i686 architecture is
turned on automatically if your CPU implements mmx, as on modern
ia32 machines this gives a major speed boost. This has been tested on
Athlon XP, Pentium 4, Itanium2 and PowerPC G3 CPUs.

If you have the Intel C compiler installed, you can use this by setting
your CC environment variable to "icc". On a 1500MHz ia64 test, using the
intel compiler compiler resulted in a 25% speed increase.

Authors
--------

David Trowbridge
Micah Dowty
