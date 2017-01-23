'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _error = require('./error');

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var namedParams = ['rawData', 'signature', 'encryptedData', 'iv', 'code'];

var defaultParamsResolver = function defaultParamsResolver(req) {
  var _req$params = req.params,
      params = _req$params === undefined ? {} : _req$params,
      _req$query = req.query,
      query = _req$query === undefined ? {} : _req$query,
      _req$body = req.body,
      body = _req$body === undefined ? {} : _req$body;

  return namedParams.reduce(function (mem, name) {
    var val = body[name] || query[name] || params[name];
    if ('string' === typeof val && val.trim() !== '') {
      mem[name] = val;
    }
    return mem;
  }, {});
};

var validateParams = function validateParams(params) {
  var type = typeof params === 'undefined' ? 'undefined' : _typeof(params);
  if (params === null || type !== 'object' && type !== 'function') {
    return false;
  }

  var rawData = params.rawData,
      signature = params.signature,
      encryptedData = params.encryptedData,
      iv = params.iv,
      code = params.code;

  return Boolean(code && signature && encryptedData && rawData && iv);
};

var authParamsResolver = function authParamsResolver(req, resolver) {
  if ('function' !== typeof resolver) {
    resolver = defaultParamsResolver;
  }
  return new Promise(function (resolve, reject) {
    var params = resolver(req);
    validateParams(params) ? resolve(params) : reject((0, _error2.default)(400, 'invalid auth params'));
  });
};

exports.default = authParamsResolver;
module.exports = exports['default'];