# grunt-fizzy-docs

Grunt tasks for [Masonry](http://masonry.desandro.com), [Isotope](http://isotope.metafizzy.co), and [Packery](http://packery.docs) docs.

View documentation sources to see this in action.

+ [github.com/desandro/masonry-docs](https://github.com/desandro/masonry-docs)
+ [github.com/metafizzy/isotope-docs](https://github.com/metafizzy/isotope-docs)
+ [github.com/metafizzy/packery-docs](https://github.com/metafizzy/packery-docs)

## int-bower

Integrates bower sources.

+ Adds .js and .css (taken from `main` in `bower.json`) files to `concat` task
+ Adds main files to `copy` task
+ Saves .js and .css files to JSON with `dataDir` option

``` js
grunt.initConfig({
  // global settings
  dataDir: '_tasks/data'
});
```

## template

Generates site HTML with [Handlebars](http://handlebarsjs.com/) templating.

``` js
  grunt.initConfig({
  template: {
    docs: {
      files: {
        // dest: src
        'build/': '_content/**/*.*'
      },
      options: {
        // load all templates from files
        templates: '_templates/*.mustache',
        // default template used
        defaultTemplate: 'page',
        // any other partials you want to hard code
        partialFiles: {
          'submitting-issues': 'bower_components/masonry/CONTRIBUTING.mdown'
        }
      }
    }
  }
});
```

Source files can contain JSON front matter, sort of like [Jekyll's YAML front matter](http://jekyllrb.com/docs/frontmatter/). 

    ---
    {
      "title": "FAQ",
      "nav": [
        "Overlapping",
        "Browser support",
        "Difference between Isotope and Masonry",
        "First item breaks grid"
      ]
    }
    ---

### Templating variables

JSON front matter is then passed in with the `page` variable for templating.

``` html
<h1>{{page.title}}</h1>
<ul class="nav">
  {{#each page.nav}}
    <li><a href="#{{slug this}}">{{this}}</a></li>
  {{/each}}
</ul>
```

Other variables:

+ `basename` - the name of the file. i.e. "index" for "content/index.html"
+ `ref="{{root_path}}layout-modes/masonry` - `--dev` command flag, for `grunt default --dev`
+ `site`
  - `site.js` - all .js files
  - `site.css` - all .css files

Here's how I use those variables. See [desandro/masonry-docs/_templates/page.mustache](https://github.com/desandro/masonry-docs/blob/master/_templates/page.mustache)

``` html
</head>
  {{#if is_dev}}
    <!-- DEV MODE - including each .css file -->
    {{#each site.css}}
      <link rel="stylesheet" href="{{this}}" />
    {{/each}}
  {{else}}
    {{! in production, just include concat CSS }}
    <link rel="stylesheet" href="css/masonry-docs.css" />
  {{/if}}
</head>

{{! unique page name for CSS, data-page to trigger JS }}
<body class="{{basename}}-page" data-page="{{basename}}"> 
```
