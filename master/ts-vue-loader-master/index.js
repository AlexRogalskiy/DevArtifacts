const compiler = require('vue-template-compiler')
const hash = require('hash-sum')
const transpile = require('vue-template-es2015-compiler')
const cache = Object.create(null)

module.exports = function (content) {
  this.cacheable()
  let isProduction = this.minimize || process.env.NODE_ENV === 'production'
  let regex = new RegExp(/(\S+) = __decorate\(\[[^\]]+Component\(/gi)
  let matches = regex.exec(content)
  if (matches !== null) {
    // Converts template to render functions
    content = content.replace(new RegExp(/template:\s"([^"\\]*(?:\\.[^"\\]*)*)"/gi), (c1, template) => {
      template = eval(`"${template}"`)
      let compiled = compiler.compile(template)

      // tips
      if (compiled.tips && compiled.tips.length) {
        compiled.tips.forEach(tip => {
          this.emitWarning(tip)
        })
      }

      if (compiled.errors && compiled.errors.length) {
        this.emitError(
          `\n  Error compiling template:\n${pad(template)}\n` +
          compiled.errors.map(e => `  - ${e}`).join('\n') +
          '\n'
        )
      } else {
        const staticRenderFns = compiled.staticRenderFns.map(fn =>
          toFunction(fn)
        )
        code =
          transpile(
            'var render = ' +
            toFunction(compiled.render) +
            '\n' +
            'var staticRenderFns = [' +
            staticRenderFns.join(',') +
            ']') + '\n'
        return code
          .replace('var render = ', 'render: ')
          .replace('var staticRenderFns = ', ', staticRenderFns: ')
      }
    })

    // Injects Hot Reload
    if (!isProduction) {
      let filePath = this.resourcePath
      let moduleId = 'data-v-' + genId(filePath + matches[1])
      content += `/* hot reload */
        ${matches[1]}.options.__file = '${filePath}'
        if (module.hot) {(function () {
          var hotApi = require('vue-hot-reload-api')
          hotApi.install(require('vue'), false)
          if (!hotApi.compatible) return
          module.hot.accept()
          if (!module.hot.data) {
            hotApi.createRecord('${moduleId}', ${matches[1]})
          } else {
            hotApi.reload('${moduleId}', ${matches[1]})
          }
        })()}
      `
    }
  }
  return content
}

function pad (html) {
  return html
    .split(/\r?\n/)
    .map(line => `  ${line}`)
    .join('\n')
}

function genId (file) {
  return cache[file] || (cache[file] = hash(file))
}

function toFunction (code) {
  return (
    'function () { ' + code + '}'
  )
}
