"use strict";
// @ts-check

import { MatchCodes, LetterColor, } from '@/types';

export function calcLetterColor( guess:string, answer:string, column:number ): LetterColor
{
     if( !guess || !answer )
     {
          return { letter:'', color: MatchCodes.DEFAULT };
     }

     const answerChar = answer.substring( column, column + 1 );
     const guessChar = guess.substring( column, column + 1 );
     
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
