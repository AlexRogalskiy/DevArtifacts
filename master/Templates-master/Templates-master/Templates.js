/**
 * TEMPLATES
 * Template parsing with Hogan
 *
 * Hogan: http://twitter.github.io/hogan.js/
 * Mustache: http://mustache.github.io/
 *
 * Templates with `x-template` get indexed by their name and injected into the
 * DOM where `x-template-inject` matches the template's name.
 *
 * To inject a specific template you can call
 * `Templates.inject(templatename, data)` while `templatename` is the value of
 * `x-template` and data is the object that holds the data to be passed to
 * the Hogan template.
 */
import Hogan from 'hogan.js'

class Templates {
  _$ (selector, single) {
    const elements = document.querySelectorAll(selector)

    if (single) {
      return elements[0]
    }

    return Array.from(elements)
  }

  /**
   * All templates on a page
   * @return {Array} All templates on a page
   */
  getTemplates() {
    return this._$('[x-template]')
  }

  /**
   * Get a specific template
   * @param  {String} page
   * @return {Array}  Template
   */
  get(page) {
    return this._$(`[x-template~="${page}"]`, true).innerHTML
  }

  /**
   * Parse templates and render them with data
   * @param  {Sting}  template HTML of template
   * @param  {Object} data     Data to inject into template
   * @return {String}          Parsed template
   */
  parse(template, data) {
    const parsedTemplate = Hogan.compile(template)

    return parsedTemplate.render(data)
  }

  /**
   * Generate UUID
   * @return {String}
   */
  generateId() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1) +
           Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1)
  }

  /**
   * Inject templates where they are needed
   * @param  {String}   templateName Name of template
   * @param  {Object}   data         Data to inject into template
   * @param  {Function} callback     Callback function for each element
   * @param  {Boolean}  wrap         Wrap item with div or not
   * @return {void}
   */
  inject(templateName, data, callback = () => {}, wrap = true) {
    const template = this.get(templateName)
    let html = ''

    // If data is not provided as an array
    if (data.constructor !== Array) {
      data = [data];
    }

    let length = data.length

    for (let i = 0; i < length; i++) {
      data[i].__name = data[i].__name || this.generateId()
      data[i].id = `${templateName}__${data[i].__name}`
      data[i]['@key'] = i
      data[i]['@count'] = length

      if (wrap) {
        html += `<div x-template-id="${data[i].id}">`
      }

      html += this.parse(template, data[i])

      if (wrap) {
        html += '</div>';
      }

    }

    this._$(`[x-template-inject~="${templateName}"]`, true).innerHTML = html

    for (let i = 0; i < length; i++) {
      callback(data[i])
    }
  }

  /**
   * Update a given template
   * @param  {String} templateName Name of template
   * @param  {String} name         ID of element to update
   * @param  {Object} data         Data to inject into template
   * @return {void}
   */
  update(templateName, name, data) {
    const template = this.get(templateName);
    const html = this.parse(template, data);

    // Replace element with new element
    this._$(`[x-template-id="${templateName}__${name}"]`, true).innerHTML = html
  }
}

export default Templates