import decipherer from './decipherer'
import resolveParams from './params'

const middleware = (
  appId, appSecret, paramsResolver, options = {}
) => {
  if('[object Object]' !== Object.prototype.toString.call(paramsResolver)){
    options = paramsResolver
    paramsResolver = null
  }

  const {dataKey = 'weappAuth'} = options || {}

  return (req, res, next) => {
    return resolveParams(req, paramsResolver)
      .then(decipherer(appId, appSecret))
      .then(data => {
        req[dataKey] = data
        next()
      })
      .catch(next)
  }
}

export default middleware