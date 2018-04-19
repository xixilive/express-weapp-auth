'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _decipherer = require('./decipherer');

var _decipherer2 = _interopRequireDefault(_decipherer);

var _params = require('./params');

var _params2 = _interopRequireDefault(_params);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var middleware = function middleware(appId, appSecret, paramsResolver) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if ('[object Object]' !== Object.prototype.toString.call(paramsResolver)) {
    options = paramsResolver;
    paramsResolver = null;
  }

  var _ref = options || {},
      _ref$dataKey = _ref.dataKey,
      dataKey = _ref$dataKey === undefined ? 'weappAuth' : _ref$dataKey;

  return function (req, res, next) {
    return (0, _params2.default)(req, paramsResolver).then((0, _decipherer2.default)(appId, appSecret)).then(function (data) {
      req[dataKey] = data;
      next();
    }).catch(next);
  };
};

exports.default = middleware;
module.exports = exports['default'];