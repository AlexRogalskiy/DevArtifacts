---
title: Origin
---

An evolution of [dbushell-Origin](https://github.com/dbushell/dbushell-Origin) using [Fractal](http://fractal.build/).

## Helpers

### Markdown Helper

[Markdown helper](https://github.com/helpers/helper-markdown) using [remarkable](https://github.com/jonschlinkert/remarkable) with [typographer](https://github.com/jonschlinkert/remarkable#typographer) option.

```handlebars
\{{ markdown text }}
```
```handlebars
\{{ markdown "paragraph" }}
```

or block helper:

```handlebars
\{{# markdown }}\{{ text }}\{{/ markdown }}
```
```handlebars
\{{# markdown }}paragraph\{{/ markdown }}
```
