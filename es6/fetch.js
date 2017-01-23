import {https} from 'https'
import httpError from './error'

const get = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const {statusCode} = res
      if(statusCode < 200 || statusCode >= 300){
        res.resume()
        return reject(httpError(statusCode, 'Request failed'))
      }

      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', chunk => rawData += chunk)
      res.on('end', () => {
        try {
          resolve(JSON.parse(rawData))
        } catch (err) {
          reject(httpError(500, 'Request failed'))
        }
      })
    })
  })
}

export default function fetchUrl(url){
  if('function' === typeof fetch){
    return fetch(url, {method: 'GET'}).then(res => res.json())
  }
  return get(url)
}
