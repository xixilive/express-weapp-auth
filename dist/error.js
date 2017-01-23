"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (httpStatus, message) {
  var error = new Error(message);
  error.statusCode = httpStatus;
  return error;
};

module.exports = exports["default"];