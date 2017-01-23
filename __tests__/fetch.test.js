const nock = require('nock')
const fetchUrl = require('../es6/fetch')

describe('fetch', () => {
  beforeEach(() => {
    global.fetch = undefined
    expect(global.fetch).toBeUndefined()
  })

  it('should use global.fetch if it was defined', () => {
    global.fetch = jest.fn(() => Promise.resolve({json: () => ({ok: 1})}))
    return fetchUrl('https://example.com/api').then(data => {
      expect(global.fetch).toHaveBeenCalledWith('https://example.com/api', {method: 'GET'})
      expect(data).toEqual({ok: 1})
    })
  })

  it('should be success with native https module', () => {
    let nockScope = nock('https://example.com').get('/api').reply(200, {ok: 1})
    return fetchUrl('https://example.com/api').then((data) => {
      nockScope.done()
      expect(data).toEqual({ok: 1})
    })
  })
})
