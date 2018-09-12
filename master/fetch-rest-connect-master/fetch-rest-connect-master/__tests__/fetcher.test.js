import ENDPOINT_DATA from './data/foo'
import Fetcher from '../'

const { fetch } = global

describe('Fetcher', () => {
  const ENDPOINT = 'foo'
  const ID = 'cffc024d-6001-4ca4-bfe1-35a17de0df4f'
  const fetcher = new Fetcher({
    apiUrl: '/',
    endpoints: {
      [ENDPOINT]: ENDPOINT,
    },
  })

  fetch.mockResponse(JSON.stringify(ENDPOINT_DATA))

  it('returns method for given data', () => {
    let method = Fetcher.getMethod('GET', {
      foo: 'bar',
    })
    expect(method).toBe('POST')

    method = Fetcher.getMethod('GET', {
      foo: 'bar',
    }, ID)
    expect(method).toBe('PUT')

    method = Fetcher.getMethod('GET')
    expect(method).toBe('GET')
  })

  it('provides a complete url', () => {
    let url = fetcher.getUrl(ENDPOINT)
    expect(url).toBe(`/${ENDPOINT}/`)

    url = fetcher.getUrl(ENDPOINT, ID)
    expect(url).toBe(`/${ENDPOINT}/${ID}/`)

    url = fetcher.getUrl(ENDPOINT, ID, {
      env: 'bar',
    })
    expect(url).toBe(`/${ENDPOINT}/${ID}/?env=bar`)

    url = fetcher.getUrl(ENDPOINT, undefined, {
      env: 'bar',
    })
    expect(url).toBe(`/${ENDPOINT}/?env=bar`)
  })

  it('throws if no action is provided while getting URL', () => {
    expect(() => {
      fetcher.getUrl()
    }).toThrow()
  })

  it('gets data from endpoint', (done) => {
    expect.assertions(1)

    fetcher.fetch(ENDPOINT, ID)
      .then((data) => {
        expect(data).toEqual(ENDPOINT_DATA)
        done()
      })
  })

  it('posts data to api', (done) => {
    fetcher.fetch(ENDPOINT, ID, undefined, {
      foo: 'baz',
    })
      .then((data) => {
        expect(data).toEqual(ENDPOINT_DATA)
        done()
      })
  })

  it('returns error if rejected', (done) => {
    fetch.mockRejectOnce(JSON.stringify(ENDPOINT_DATA))

    fetcher.fetch(ENDPOINT)
      .then((data) => {
        expect(data).toEqual({
          error: true,
          message: ENDPOINT_DATA,
        })
        done()
      })
  })
})
