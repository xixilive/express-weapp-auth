const authParams = require('../es6/params')

describe('resolve auth params', () => {

  const expectParams = (expectation) => (params) => {
    expect(params.code).toBe(expectation.code)
    expect(params.rawData).toBe(expectation.rawData)
    expect(params.signature).toBe(expectation.signature)
    expect(params.encryptedData).toBe(expectation.encryptedData)
    expect(params.iv).toBe(expectation.iv)
  }

  const expectInvalidParams = (invalidParams) => () => {
    return authParams({}, () => invalidParams).then(params => {
      throw(new Error('resolved'))
    }).catch(err => {
      expect(err).toBeDefined()
      expect(err.message).toBe('invalid auth params')
      expect(err.statusCode).toBe(400)
    })
  }

  it('should be resolved with default resolver', () => {
    const req = {
      body: {code: 'code', rawData: 'rawData', signature: 'signature', encryptedData: 'encryptedData', iv: 'iv'},
    }
    return authParams(req).then(expectParams(req.body))
  })

  it('should be resolved with default resolver in specified priority: body, query, and path', () => {
    const req = {
      params: {code: 'code0'},
      query: {code: 'code1'},
      body: {code: 'code2', rawData: 'rawData', signature: 'signature', encryptedData: 'encryptedData', iv: 'iv'},
    }
    return authParams(req).then(expectParams(req.body))
  })

  it('should be resolved with customized resolver', () => {
    const params = {
      code: 'code',
      rawData: 'rawData',
      signature: 'signature',
      encryptedData: 'encryptedData',
      iv: 'iv'
    }
    const paramsResolver = () => params
    return authParams({}, paramsResolver).then(expectParams(params))
  })

  describe('nulla params', () => {
    it('should not be resolved', expectInvalidParams())
    it('should not be resolved', expectInvalidParams(null))
  })

  describe('empty params', () => {
    it('should not be resolved', expectInvalidParams({}))
    it('should not be resolved', expectInvalidParams(() => {}))
  })

  describe('type-error params', () => {
    it('should not be resolved', expectInvalidParams([]))
    it('should not be resolved', expectInvalidParams(''))
  })

})
