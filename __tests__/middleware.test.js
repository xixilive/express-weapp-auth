jest.mock('../es6/fetch', () => {
  return jest.fn(() => Promise.resolve({
    openid: mockdata.userInfo.openId,
    session_key: mockdata['session_key']
  }))
})

const Middleware = require('../es6').middleware
const mockdata = require('./mockdata')
const mockNext = jest.fn()

describe('middleware', () => {
  it('with default config', () => {
    const middleware = Middleware('appId', 'appSecret')
    const req = {body: {...mockdata.params, code: 'code'}}
    return middleware(req, {}, mockNext).then(() => {
      expect(req.weappAuth).toBeDefined()
      expect(req.weappAuth.openId).toEqual(mockdata.userInfo.openId)
      expect(req.weappAuth.sessionKey).toEqual(mockdata.session_key)
      expect(req.weappAuth.userInfo).toEqual(mockdata.userInfo)
      expect(mockNext).toHaveBeenCalledTimes(1)
    })
  })
})
