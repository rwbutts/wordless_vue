"use strict";
// @ts-check

import { CustomEventNames, GameStates, MatchCodes, KeyCodes, } from '@/types';

export function calcLetterColor( guess:string, answer:string, column:number ): CalcLetterColorResponse
{
     if( !guess || !answer)
     {
          return { letter:'', color: MatchCodes.DEFAULT};
     }

     let answerChar = answer.substring(column, column + 1);
     let guessChar = guess.substring(column, column + 1);
     
     let matchCode : string;
     if( guessChar === answerChar )
          matchCode = MatchCodes.CORRECT;
     else if (answer.indexOf(guessChar) >= 0)
          matchCode = MatchCodes.ELSEWHERE;
     else
          matchCode = MatchCodes.MISS;

     return { letter: guessChar, color: matchCode};
}
