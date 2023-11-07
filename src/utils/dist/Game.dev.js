"use strict";
/**
 * 
* @enum {string}
*/

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calcLetterColor = calcLetterColor;
exports.GameStates = exports.LetterMatchResult = void 0;
var LetterMatchResult = {
  DEFAULT: 'default',
  MISS: 'miss',
  ELSEWHERE: 'elsewhere',
  CORRECT: 'correct'
};
/**
* @enum {string}
*/

exports.LetterMatchResult = LetterMatchResult;
var GameStates = {
  INIT: "game-starting",
  WON: "game-won",
  LOST: "game-lost",
  ENDING: "end-in-progress",
  RUNNING: "game-in-progress",
  GAMEOVER: "game-over"
};
/**
 * @returns {{letter: string, color: LetterMatchResult}} 
 */

exports.GameStates = GameStates;

function calcLetterColor(guess, answer, column) {
  if (!guess || !answer) {
    return {
      letter: '',
      color: LetterMatchResult.DEFAULT
    };
  }

  var answerChar = answer.substring(column, column + 1);
  var guessChar = guess.substring(column, column + 1);
  var matchCode;
  if (guessChar === answerChar) matchCode = LetterMatchResult.CORRECT;else if (answer.indexOf(guessChar) >= 0) matchCode = LetterMatchResult.ELSEWHERE;else matchCode = LetterMatchResult.MISS;
  return {
    letter: guessChar,
    color: matchCode
  };
}