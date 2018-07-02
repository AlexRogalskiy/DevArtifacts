const { pow, abs } = Math
const { log, clear } = console
clear()

const querySel = sel => document.querySelector(sel)
const isFunc = fn => typeof fn === 'function'

function SVGElem (tagName, attrs = {}) {
  this.elem = document.createElementNS(
    'http://www.w3.org/2000/svg', tagName
  )
  this.attrs = attrs
  Reflect.ownKeys(this.attrs).forEach(key => {
    this.elem.setAttribute(key, this.attrs[key])
  })
}
SVGElem.prototype.attr = function (...args) {
  const [key, value] = args
  if (args.length === 1) {
    return this.elem.getAttribute(key)
  }
  this.elem.setAttribute(key, value)
  return this
}

const circ = document.querySelector('#greenC')
const circO = document.querySelector('#greenCOut')
const label = document.querySelector('#label')

const bell = (start, end, height) => {
  const width = end-start
  const quart = width/4
  const half = width/2
  
  const rv = `\n\
     M 0 ${ height } \n\
     C ${ quart } ${ height }, \n\
     ${ quart } 0, ${ half } 0, ${ quart * 3 } 0, \n\
     ${ half + quart } ${ height }, ${ width } ${ height }`
  return rv
}

console.log(bell(50, 750, 200))
SVGElem.prototype.insert = function (qs = 'svg') {
  const parent = querySel(qs)
  if (parent.firstElementChild) {
    parent.insertBefore(this.elem, parent.firstElementChild)  
  }
  else {
    parent.appendChild(this.elem)
  }
}

const fullW = 700
const sections = 8
const gap = 2
const w = (fullW) / sections
for (let i = 0; i < (fullW / w); i++) {
  const width = w - gap
  const height = 302
  const x = (i * (w)) -(gap/2)
  const y = 0
  const r = new SVGElem('rect', {
    height, width, x, y,
    ['clip-path']: 'url(#cut-off-bottom)',
  })
  r.insert('#blinds')
}

