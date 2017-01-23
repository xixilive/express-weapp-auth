'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fetchUrl;

var _error = require('./error');

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var https = require('https');

var get = function get(url) {
  return new Promise(function (resolve, reject) {
    https.get(url, function (res) {
      var statusCode = res.statusCode;

      if (statusCode < 200 || statusCode >= 300) {
        res.resume();
        return reject((0, _error2.default)(statusCode, 'Request failed'));
      }

      res.setEncoding('utf8');
      var rawData = '';
      res.on('data', function (chunk) {
        return rawData += chunk;
      });
      res.on('end', function () {
        try {
          resolve(JSON.parse(rawData));
        } catch (err) {
          reject((0, _error2.default)(500, 'Request failed'));
        }
      });
    });
  });
};

function fetchUrl(url) {
  if ('function' === typeof fetch) {
    return fetch(url, { method: 'GET' }).then(function (res) {
      return res.json();
    });
  }
  return get(url);
}
module.exports = exports['default'];