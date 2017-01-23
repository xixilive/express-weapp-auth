const mockdata = require('./mockdata')

jest.mock('../es6/fetch', () => {
  return jest.fn(() => Promise.resolve({}))
})

const decipherer = require('../es6/decipherer')('appId', 'appSecret')

describe('decipher', () => {

  it('should failed to decrypt data given invalid session', () => {
    return decipherer({...mockdata.params, code: 'code'}).then(data => {
      throw(new Error('decrypted'))
    }).catch(err => {
      expect(err.message).toBe('invalid openid or session_key')
    })
  })

})
