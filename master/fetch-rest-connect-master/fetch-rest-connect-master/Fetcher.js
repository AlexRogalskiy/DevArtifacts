import 'whatwg-fetch'

class Fetcher {
  static getMethod(method = 'GET', data, id) {
    if (data) {
      if (id) {
        return 'PUT'
      }

      return 'POST'
    }

    return method
  }

  static throwError(error) {
    let responseError
    try {
      responseError = JSON.parse(error)
    } catch (e) {
      responseError = error
    }

    return {
      error: true,
      message: responseError,
    }
  }

  constructor(config) {
    this.apiUrl = config.apiUrl

    const endpoints = Object.keys(config.endpoints).map(key => (
      [key, config.endpoints[key]]
    ))

    this.endpoints = new Map(endpoints)
  }

  getUrl(action, id, addinitinalParameters) {
    let url = this.apiUrl

    if (this.endpoints.has(action)) {
      url += `${this.endpoints.get(action)}/`
    } else {
      throw new Error(`Action "${action}" not defined`)
    }

    if (id) {
      url += `${id}/`
    }

    if (typeof addinitinalParameters === 'object') {
      const params = Object.keys(addinitinalParameters)
        .map(param => `${param}=${addinitinalParameters[param]}`)

      url += `?${params.join('&')}`
    }

    return url
  }

  /* eslint-disable */
  request(url, options) {
    return fetch(url, options)
  }
  /* eslint-enable */

  /* public */fetch(action, id, addinitinalParameters, data, method, headers) {
    const url = this.getUrl(action, id, addinitinalParameters)

    const headerConfig = Object.assign({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }, headers)

    const options = {
      headers: new Headers(headerConfig),
      method: method || Fetcher.getMethod(method, data, id),
    }

    if (data) {
      options.body = JSON.stringify(data)
    }

    return this.request(url, options)
      .then((response) => {
        if (!response.ok) {
          return Fetcher.throwError(response.statusText)
        }

        return response.json()
      })
      .catch(Fetcher.throwError)
  }

  /**
   * Aliases
   */
  /* public */getAll(endpoint, addinitinalParameters = {}) {
    return this
      .fetch(endpoint, undefined, addinitinalParameters, undefined, 'GET')
  }

  /* public */get(endpoint, id, addinitinalParameters = {}) {
    return this
      .fetch(endpoint, id, addinitinalParameters, undefined, 'GET')
  }

  /* public */create(endpoint, data, addinitinalParameters = {}) {
    return this
      .fetch(endpoint, undefined, addinitinalParameters, data, 'PUT')
  }

  /* public */update(endpoint, id, data, addinitinalParameters = {}) {
    return this
      .fetch(endpoint, id, addinitinalParameters, data, 'POST')
  }

  /* public */upsert(endpoint, id, data, addinitinalParameters = {}) {
    return this
      .fetch(endpoint, id, addinitinalParameters, data, id ? 'POST' : 'PUT')
  }

  /* public */delete(endpoint, id, addinitinalParameters = {}) {
    return this
      .fetch(endpoint, id, addinitinalParameters, undefined, 'DELETE')
  }
}

export default Fetcher
