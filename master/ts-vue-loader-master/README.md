## ts-vue-loader

[![Build Status](https://travis-ci.org/Grafikart/ts-vue-loader.svg?branch=master)](https://travis-ci.org/Grafikart/ts-vue-loader)

The goal of this loader is to enable HMR and Virtual Dom for VueJS Component written using .ts and [vue-property-decorator](https://github.com/kaorun343/vue-property-decorator)

If you write your components like this 

```typescript
import { Vue, Component } from 'vue-property-decorator'

@Component({
  template: `<div>Counter : {{ i }}</div>`
})
export default class Count1 extends Vue {
  i: number = 0
  timer?: number

  mounted () {
    this.timer = window.setInterval(() => {
      this.i++
    }, 1000)
  }

  destroyed () {
    if (this.timer) {
      window.clearInterval(this.timer)
    }
  }

}
```

This loader is for you !

### How to install

First you have to install the loader

```bash
npm i -D ts-vue-loader
```

Then add the loader in your webpack configuration

```javascript
// webpack.config.json
  
  {
    test: /\.tsx?$/,
    use: ['ts-vue-loader', 'ts-loader']
  },
```

And it should work. A demo project is available in the [example](https://github.com/Grafikart/ts-vue-loader/tree/master/example) directory.

### What is happening ?

There are two transformations done by this loader : 

- The template string is replaced by a render function (so you don't need to include vue runtime). 
- In dev mode the hot reload code is added to reload the component on save (the state is not kept, and the whole component is reloaded)

```typescript
template: `<div>Counter : {{ i }}</div>`
```

is converted into :

```javascript
render: function () { var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_vm._v("Increment : "+_vm._s(_vm.i))])}
```

and this code is added at the end of your module

```javascript
App.options.__file = '/home/john-doe/vue-ts-loader/example/src/components/App.ts'
if (module.hot) {(function () {
  var hotApi = require('vue-hot-reload-api')
  hotApi.install(require('vue'), false)
  if (!hotApi.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotApi.createRecord('data-v-27f0d292', App)
  } else {
    hotApi.rerender('data-v-27f0d292', App)
  }
})()}
```

### Improvments

The original Vue-loader is able to rerender components without loosing his state. Since it is quite tricky to detect what changed in your code, this loader will reload the whole component on every change. 
A good improvment could be to only trigger a rerender based what changed.
