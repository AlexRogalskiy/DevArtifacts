/**
 * Test specification for Templates
 *
 * Tests with Jest
 */
import Templates from '../Templates.js'

describe('Templates', () => {
  const template = '<div x-template="test">{{name}}</div>'
  const inject = '<div x-template-inject="test"></div>'

  beforeEach(() => {
    document.body.innerHTML = template + inject
  })

  it('finds all templates', () => {
    const templates = new Templates()

    expect(templates.getTemplates().length).toBe(1)
    expect(templates.getTemplates()[0].innerHTML).toBe('{{name}}')
  })

  it('parses templates', () => {
    const templates = new Templates()

    var template = templates.parse('{{foo}}', {
      foo: 'foo',
    })

    var template2 = templates.parse('{{foo}} {{bar}}', {
      foo: 'foo',
      bar: 'bar',
    })

    expect(template).toBe('foo')
    expect(template2).toBe('foo bar')
  })

  it('generates unique IDs', () => {
    const templates = new Templates()

    expect(templates.generateId().length).toBe(8)
  })

  it('injects templates with data as object', () => {
    const templates = new Templates()

    templates.inject('test', {
      name: 'foo',
    })

    expect(document.querySelector('[x-template-inject="test"]').textContent).toBe('foo')
  })

  it('injects templates with id set', () => {
    const templates = new Templates()

    templates.inject('test', {
      name: 'foo',
      id: 'foobar',
    })

    expect(document.querySelector('[x-template-inject="test"]').textContent).toBe('foo')
  })

  it('injects templates with data as array', () => {
    const templates = new Templates()

    templates.inject('test', [{
      name: 'foo',
    }, {
      name: 'bar',
    }])

    const texts = templates._$('[x-template-inject="test"]').map(element => element.textContent)

    expect(texts.join('')).toBe('foobar')
  })

  it('updates template with data as object', () => {
    const templates = new Templates()

    templates.inject('test', {
      name: 'foo',
      __name: 'foo',
    })

    expect(document.querySelector('[x-template-inject="test"]').textContent).toBe('foo')

    templates.update('test', 'foo', {
      name: 'bar',
      __name: 'foo',
    })

    expect(document.querySelector('[x-template-inject="test"]').textContent).toBe('bar')
  })
})
