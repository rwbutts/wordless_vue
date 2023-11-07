"use strict";

var _interopRequireDefault = require("/home/osboxes/code/wordle/wordle/node_modules/@babel/runtime/helpers/interopRequireDefault.js").default;

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setKBMode = setKBMode;
exports.KeyCode = exports.KBModes = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("/home/osboxes/code/wordle/wordle/node_modules/@babel/runtime/helpers/esm/toConsumableArray.js"));

require("core-js/modules/es.error.cause.js");

require("core-js/modules/es.array.concat.js");

var _Events = require("@/Events.js");

var _Misc = require("@utils/Misc.js");

var KBModes = {
  PREINIT_NONE: 0,
  // until word is loaded: all keys, even reset disabled
  ALPHA_ONLY: 1,
  // empty word: only letters, no enter/del/reset 
  ALPHA_DEL: 2,
  // partial word: only letters and delete
  ENTER_DEL: 3,
  // full word: only enter, or delete
  RESET_ONLY: 4,
  // game over: all keys except reset are disabled
  NO_CHANGE: 5 // game over: all keys except reset are disabled

};
/**
* @enum {string|string[]}
*/

exports.KBModes = KBModes;
var KeyCode = {
  ENTER: "ENTER",
  DELETE: "BACKSPACE",
  LETTER: "LETTER",
  ALL: "ALL",
  NONALPHA: ['ENTER', 'BACKSPACE'],
  RESET: 'RESET'
};
exports.KeyCode = KeyCode;

function setKBMode(mode, clearcolor) {
  var _SetKeyStyleEventArgs;

  var cfg;

  switch (mode) {
    case KBModes.NO_CHANGE:
      cfg = [[], []];
      break;

    case KBModes.ENTER_DEL:
      cfg = [[KeyCode.ALL], [KeyCode.ENTER, KeyCode.DELETE]];
      break;

    case KBModes.ALPHA_ONLY:
      cfg = [[KeyCode.ALL], [KeyCode.LETTER]];
      break;

    case KBModes.PREINIT_NONE:
      cfg = [[KeyCode.ALL], []];
      break;

    case KBModes.RESET_ONLY:
      cfg = [[KeyCode.ALL], [KeyCode.RESET]];
      break;

    case KBModes.ALPHA_DEL:
      cfg = [[KeyCode.ALL], [KeyCode.LETTER, KeyCode.DELETE]];
      break;

    default:
      throw new Error('unmatched switch  value');
  }

  var colorArg = clearcolor ? {
    ALL: _Misc.ColorCode.DEFAULT
  } : {};

  _Events.EventBase.emit((_SetKeyStyleEventArgs = SetKeyStyleEventArgs).create.apply(_SetKeyStyleEventArgs, (0, _toConsumableArray2.default)(cfg).concat([colorArg])), CustomEventNames.SETKEYSTYLE);
}

;