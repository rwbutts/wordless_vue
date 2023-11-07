"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assert = assert;
exports.ColorCodes = void 0;

require("core-js/modules/es.error.cause.js");

function assert(condition) {
  var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}
/**
 * 
* @enum {string}
*/


var ColorCodes = {
  CORRECT: "correct",
  ELSEWHERE: "elsewhere",
  MISS: "miss",
  DEFAULT: "default"
};
exports.ColorCodes = ColorCodes;