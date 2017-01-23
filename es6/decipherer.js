import {createDecipheriv, createHash} from 'crypto'
import httpError from './error'

const fetchUrl = require('./fetch')

const signatureRawData = (rawData, sessionKey) => {
  const data = `${rawData}${sessionKey}`
  return createHash('sha1').update(data).digest('hex')
}

const decryptUserData = (encryptedData, iv, sessionKey) => {
  const buffers = {
    data: new Buffer(encryptedData, 'base64'),
    key: new Buffer(sessionKey, 'base64'),
    iv: new Buffer(iv, 'base64')
  }
  
  return new Promise((resolve, reject) => {
    try {
      let decipher = createDecipheriv('aes-128-cbc', buffers.key, buffers.iv)
      decipher.setAutoPadding(true)

      let decoded = decipher.update(buffers.data, 'binary', 'utf8')
      decoded += decipher.final('utf8')

      resolve(JSON.parse(decoded))
    }catch(err){
      reject(err)
    }
  }).catch(err => {
    throw(httpError(500, 'decrypt user data failed'))
  })
}

const getSessionKey = (appId, appSecret, code) => {
  let url = 'https://api.weixin.qq.com/sns/jscode2session'
  url += `?appid=${appId}&secret=${appSecret}&js_code=${code}`
  url += '&grant_type=authorization_code'

  return fetchUrl(url).then(response => {
    return {openId: response.openid, sessionKey: response.session_key}
  }).catch(err => {
    throw(httpError(400, 'jscode2session failed'))
  })
}

const decipherer = (appId, appSecret) => (params) => {
  const {code, rawData, signature, encryptedData, iv} = params
  return getSessionKey(appId, appSecret, code)
    .then(({openId, sessionKey}) => {
      if(!openId || !sessionKey){
        return Promise.reject(httpError(400, 'invalid openid or session_key'))
      }

      if(signature !== signatureRawData(rawData, sessionKey)){
        return Promise.reject(httpError(400, 'invalid signature'))
      }

      return Promise.all([
        openId, sessionKey, decryptUserData(encryptedData, iv, sessionKey)
      ])
    })
    .then(([openId, sessionKey, userInfo]) => {
      return {openId, sessionKey, userInfo}
    })
}

export default decipherer
