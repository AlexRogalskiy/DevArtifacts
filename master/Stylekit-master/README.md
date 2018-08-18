# Stylekit

A modern sass based utility library for rapid front end development

---
Stylekit is specifically made for designers, it takes care of a lot the boring things in the background so that you can focus on the most fun part of css - Styling!

Being methodology agnostic, it fits right in with your preferred style of coding wether its BEM, SMACS, OOCSS or whichever other school of thought you belong to.

It provides a fun way of authoring your stylesheets by abstracting away common boilerplate code and exposing simple api’s in the form of mixins, functions and placeholders.

## Quickstart

Getting started with Stylekit is easy. There are several options available:
- Download the latest release from [here](https://github.com/Ghosh/Stylekit/archive/master.zip)
- Clone the repo: `git clone https://github.com/Ghosh/Stylekit.git`
- Install via bower: `bower install stylekit --save`

### What’s included

```
stylekit/
|-- providers/
|   |-- _color-provider.scss
|   |-- _fontface-provider.scss
|   |-- _grid-provider.scss
|   |-- _typography-provider.scss
|   |-- _z-index-provider.scss
|-- _stylekit.scss
```

`stylekit.scss` is the main entry point to the library. Include this into your main `.scss` and you will be good to go.

### Configuration

Stylekit makes use of Sass maps for configuration. All default configuration options are included in the provider code it self. You can copy this and include it above the main stylekit import to override the default values.

The configuration usually looks like this:

```scss
$colors: (
  neutral: (
    default: #616567,
    darker: #394042,
  ),
  accent: (
    default: #93D4BC,
    secondary: #cb202d,
  ),
  social: (
    twitter: #55acee,
    dribbble: #ea4c89,
    github: #2d2d2a,
    zomato: #cb202d,
  )
);
```

More info in the docs.

**Note:** This is a work in progress. Changes are possible and expected.

## Documentation

Documentation coming soon.

## Improvements and Bugs

Please feel free to open a new issue [here](https://github.com/Ghosh/Stylekit/issues) with your suggestions or any bugs which you may have come across.

## Credits

Stylekit builds upon the concept and techniques shared by members of the community. Thanks to the following for their work:
- [Erskine Designs](http://erskinedesign.com/blog/setting-typographic-scale-with-sass-maps/)
- [Jonathan Suh](http://www.smashingmagazine.com/2015/06/responsive-typography-with-sass-maps/)

---

I’m [@_ighosh](https://twitter.com/_ighosh) on twitter

\m/
