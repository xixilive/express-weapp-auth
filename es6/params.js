import httpError from './error'

const namedParams = [
  'rawData', 'signature', 'encryptedData', 'iv', 'code'
]

const defaultParamsResolver = (req) => {
  const {params = {}, query = {}, body = {}} = req
  return namedParams.reduce((mem, name) => {
    const val = body[name] || query[name] || params[name]
    if('string' === typeof val && val.trim() !== ''){
      mem[name] = val
    }
    return mem
  }, {})
}

const validateParams = (params) => {
  const type = typeof params
  if(params === null || (type !== 'object' && type !== 'function')){
    return false
  }

  const {rawData, signature, encryptedData, iv, code} = params
  return Boolean(code && signature && encryptedData && rawData && iv)
}

const authParamsResolver = (req, resolver) => {
  if('function' !== typeof resolver){
    resolver = defaultParamsResolver
  }
  return new Promise((resolve, reject) => {
    const params = resolver(req)
    validateParams(params) ?
      resolve(params) :
      reject(httpError(400, 'invalid auth params'))
  })
}

export default authParamsResolver
