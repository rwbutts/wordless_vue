"use strict";
// @ts-check

import { MatchCodes, } from '@/types';

export function calcLetterColor( guess:string, answer:string, column:number ): CalcLetterColorResponse
{
     if( !guess || !answer )
     {
          return { letter:'', color: MatchCodes.DEFAULT };
     }

     let answerChar = answer.substring( column, column + 1 );
     let guessChar = guess.substring( column, column + 1 );
     
     let matchCode : string;

     switch( true )
     {
          case guessChar === answerChar:
               matchCode = MatchCodes.CORRECT;
               break;
          case answer.indexOf(guessChar) >= 0:
               matchCode = MatchCodes.ELSEWHERE;
               break;
          default:
               matchCode = MatchCodes.MISS;
     }

     return { letter: guessChar, color: matchCode };
}
