# Express-weapp-auth

Express middleware to decrypt wechat userInfo data for weapp login scenario.

## Installation

```
# via Github
npm install xixilive/express-weapp-auth --save

# via npm
npm install express-weapp-auth --save
```

## Usage

```js
// basic example
import weappAuthMiddleware from 'express-weapp-auth'

const app = require('express')()
app.post(
  '/session/:code',

  weappAuthMiddleware('appId', 'appSecret'),

  (req, res, next) => {
    const {openId, sessionKey, userInfo} = req.weappAuth
    //your logic here
  }
)

// advance example
app.use(
  '/weapp/session/',

  weappAuthMiddleware('appId', 'appSecret', (req) => {
    return req.body
  }, {dataKey: 'customDataKey'}),
  (req, res, next) => {
    const {openId, sessionKey, userInfo} = req.customDataKey
    //your logic here
  }
)
```

## Middleware

```js
// all arguments
weappAuthMiddleware('appId', 'appSecret' [, paramsResolver, options])

// without optional arguments
weappAuthMiddleware('appId', 'appSecret')

// without options argument
weappAuthMiddleware('appId', 'appSecret' paramsResolver)

// without paramsResolver argument
weappAuthMiddleware('appId', 'appSecret' options)
```

### Arguments

- `appId`: required, weapp app ID

- `appSecret`: required, weapp app secret

- `paramsResolver`: optional, a `function(req){}` to resolve auth-params for request object

- `options`: optional, `{dataKey: 'the key assign to req object to store decrypted data'}`

## ParamsResolver(req)

It will use a built-in default resolver to resolve params for request if there has no function passed to middleware function. and the default function resolves params in a certain priority:

- `req.body` with the highest priority

- `req.query` with middle priority

- `req.params` with the lowest priority

And it expects the resolver function to return an object value with following structure:

```js
{
  code: 'login code',
  rawData: 'rawData',
  signature: 'signature for rawData',
  encryptedData: 'encrypted userInfo',
  iv: 'cipher/decipher vector'
}
```

For more details about this, please visit [微信小程序 API](https://mp.weixin.qq.com/debug/wxadoc/dev/api/)
