# Grunt Config

## Installation
In the base of your project folder, run the following command in your terminal.

```
> git submodule add -f --name grunt-config -- https://github.com/andyhqtran/grunt-config grunt
```

## Folder Tree
Example of a project folder.

```
/path/to/project/folder

|-- /src
|  |-- /coffee
|  |-- /jade
|  |  |-- /inc
|  |  |-- /views
|  |  |-- config.json
|  |  `-- layout.jade
|  `-- /scss
|     |-- /modules
|     |-- /partials
|     |-- /vendors
|     `-- main.scss
|-- LICENSE
`-- README.md

directory: 9 file: 5
```

## Jade
#### Views

**Layout**
```jade
doctype html
html(lang="en")
  head
    title Layout

  body
    block content
```

**View.jade**
```jade
  extends ../layout

  block content
    | Content Here
```