<p align="center"><img src="/src/medias/political-avatar.svg" alt="Political Avatar" width="200"></p>

# 1500 Translator

![Travis](https://img.shields.io/travis/LFeh/1500-translator.svg)
[![license](https://img.shields.io/github/license/LFeh/1500-translator.svg)](./license.md)
[![GitHub contributors](https://img.shields.io/github/contributors/LFeh/1500-translator.svg)](https://github.com/LFeh/1500-translator/graphs/contributors)

> To translate political language for people's language

[View project](https://www.felipefialho.com/1500-translator/)

## Add new words

It is simple, you need to access the `src/library.json`, add the new word and submit a pull request. 

Example:

```json
  "vossa excelencia": "mano"
```

## Getting Started

This project uses Pug, Stylus and Webpack.


```sh
# Clone this repository
$ git clone git@github.com:LFeh/1500-translator.git
$ cd 1500-translator

# install dependencies
$ npm i

# Run the project
$ npm start

```

With the commands above, you have everything to start.

### Post CSS libs

For grid system uses [Autoprefixer](https://github.com/postcss/autoprefixer) to make easy use browser prefixes, [Lost](https://github.com/peterramsing/lost) with some help from, [Rucksack](http://simplaio.github.io/rucksack/) for animations, reset and a lot of great mixins, [Rupture](https://github.com/jenius/rupture) for responsive utilities. And [Font Magician](https://github.com/jonathantneal/postcss-font-magician/) to get the webfonts.

### Code Standards

This project uses my own [Coding Style](https://github.com/LFeh/coding-style) as code reference.

To help you, this project has a `npm run fix` command to fix all eslint errors.

### Tasks

- `npm start`: run all tasks and initialize watch for changes and a server
- `npm run build`: run all production tasks create a `dist` folder to deploy
- `npm run lint`: lint javascript and css
- `npm run fix`: command to fix all eslint errors
- `npm run deploy`: run all tasks to build and deploy on gh-pages

## License

MIT License © Felipe Fialho
