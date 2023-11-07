"use strict";


export const MatchCodes : ObjStringMap<string> = {
     DEFAULT: 'default',
     MISS: 'miss',
     ELSEWHERE: 'elsewhere',
     CORRECT: 'correct'
}

export const GameStates: ObjStringMap<string> = {
     INIT : "game-starting",
     WON : "game-won",
     LOST : "game-lost",
     ENDING : "end-in-progress",
     RUNNING : "game-in-progress",
     GAMEOVER : "game-over",
}

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

export class StatsGameReportArgs
{
     finalState: string;
     numGuesses: number|null;

     constructor( finalState:string , numGuesses: number|null = null)
     {
          this.finalState = finalState;
          this.numGuesses = numGuesses;
     }
}

