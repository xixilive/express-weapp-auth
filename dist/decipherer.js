'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _crypto = require('crypto');

var _error = require('./error');

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fetchUrl = require('./fetch');

var signatureRawData = function signatureRawData(rawData, sessionKey) {
  var data = '' + rawData + sessionKey;
  return (0, _crypto.createHash)('sha1').update(data).digest('hex');
};

var decryptUserData = function decryptUserData(encryptedData, iv, sessionKey) {
  var buffers = {
    data: new Buffer(encryptedData, 'base64'),
    key: new Buffer(sessionKey, 'base64'),
    iv: new Buffer(iv, 'base64')
  };

  return new Promise(function (resolve, reject) {
    try {
      var decipher = (0, _crypto.createDecipheriv)('aes-128-cbc', buffers.key, buffers.iv);
      decipher.setAutoPadding(true);

      var decoded = decipher.update(buffers.data, 'binary', 'utf8');
      decoded += decipher.final('utf8');

      resolve(JSON.parse(decoded));
    } catch (err) {
      reject(err);
    }
  }).catch(function (err) {
    throw (0, _error2.default)(500, 'decrypt user data failed');
  });
};

var getSessionKey = function getSessionKey(appId, appSecret, code) {
  var url = 'https://api.weixin.qq.com/sns/jscode2session';
  url += '?appid=' + appId + '&secret=' + appSecret + '&js_code=' + code;
  url += '&grant_type=authorization_code';

  return fetchUrl(url).then(function (response) {
    return { openId: response.openid, sessionKey: response.session_key };
  }).catch(function (err) {
    throw (0, _error2.default)(400, 'jscode2session failed');
  });
};

var decipherer = function decipherer(appId, appSecret) {
  return function (params) {
    var code = params.code,
        rawData = params.rawData,
        signature = params.signature,
        encryptedData = params.encryptedData,
        iv = params.iv;

    return getSessionKey(appId, appSecret, code).then(function (_ref) {
      var openId = _ref.openId,
          sessionKey = _ref.sessionKey;

      if (!openId || !sessionKey) {
        return Promise.reject((0, _error2.default)(400, 'invalid openid or session_key'));
      }

      if (signature !== signatureRawData(rawData, sessionKey)) {
        return Promise.reject((0, _error2.default)(400, 'invalid signature'));
      }

      return Promise.all([openId, sessionKey, decryptUserData(encryptedData, iv, sessionKey)]);
    }).then(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 3),
          openId = _ref3[0],
          sessionKey = _ref3[1],
          userInfo = _ref3[2];

      return { openId: openId, sessionKey: sessionKey, userInfo: userInfo };
    });
  };
};

exports.default = decipherer;
module.exports = exports['default'];