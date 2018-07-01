import test from 'ava';
import loader from '../index.js'
import fs from 'fs'

let vueComponent = fs.readFileSync(__dirname + '/fixtures/ComponentDecorated.js', 'utf8')
let vueComponentTpl = fs.readFileSync(__dirname + '/fixtures/ComponentTpl.js', 'utf8')
let notVueComponent = fs.readFileSync(__dirname + '/fixtures/Class.js', 'utf8')

let fakeLoaderContext = {
  cacheable () { },
  minimize: false,
  resourcePath: 'fake.ts',
  emitError (e) {
    throw new Error(e)
  }
}

test('loader parse virtual DOM', t => {
  let content = loader.bind(fakeLoaderContext)(vueComponent)
  t.regex(content, /_c\('div',\[_c\('p'/g)
})

test('loader add HMR code', t => {
  let content = loader.bind(fakeLoaderContext)(vueComponent)
  t.regex(content, /hotApi\.createRecord\('data-v-\w+', App\)/g)
})

test('loader add HMR code on components that uses vue-template-loader', t => {
  let content = loader.bind(fakeLoaderContext)(vueComponentTpl)
  t.regex(content, /hotApi\.createRecord\('data-v-\w+', App\)/g)
})

test('HMR is not added in production', t => {
  let content = loader.bind(Object.assign({}, fakeLoaderContext, {minimize: true}))(vueComponent)
  t.notRegex(content, /hotApi\.createRecord\('data-v-\w+', App\)/g)
  t.regex(content, /_c\('div',\[_c\('p'/g)
})

test('loader does nothing', t => {
  let content = loader.bind(fakeLoaderContext)(notVueComponent)
  t.notRegex(content, /api\.reload\(\'[0-9a-z]+\', App\.options\)/g)
})
