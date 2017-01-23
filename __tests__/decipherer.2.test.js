const mockdata = require('./mockdata')

jest.mock('../es6/fetch', () => {
  return jest.fn(() => Promise.reject({error: 'error'}))
})

const decipherer = require('../es6/decipherer')('appId', 'appSecret')

describe('decipher', () => {

  it('should failed to decrypt data when fetch sessionKey request failed', () => {
    return decipherer({...mockdata.params, code: 'code'}).then(data => {
      throw(new Error('decrypted'))
    }).catch(err => {
      expect(err.message).toBe('jscode2session failed')
    })
  })

})
