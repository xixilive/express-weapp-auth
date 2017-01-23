const mockdata = require('./mockdata')

jest.mock('../es6/fetch', () => {
  return jest.fn(() => Promise.resolve({
    openid: mockdata.userInfo.openId,
    session_key: mockdata['session_key']
  }))
})

const decipherer = require('../es6/decipherer')('appId', 'appSecret')

describe('decipher', () => {
  it('should success to decrypt data', () => {
    return decipherer({...mockdata.params, code: 'code'}).then(data => {
      expect(data.openId).toEqual(mockdata.userInfo.openId)
      expect(data.sessionKey).toEqual(mockdata['session_key'])
      expect(data.userInfo).toEqual(mockdata.userInfo)
    })
  })

  it('should failed to decrypt data given invalid params', () => {
    return decipherer({...mockdata.params, signature: 'illegal_signature', code: 'code'}).then(data => {
      throw(new Error('decrypted'))
    }).catch(err => {
      expect(err.message).toBe('invalid signature')
    })
  })

})
