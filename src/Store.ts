"use strict";
// @ts-check

import { defineStore } from 'pinia'
import { calcLetterColor, } from '@/utils/Game';
import { GameStates, MatchCodes, LetterColor, } from '@/types';

export const useStateStore = defineStore( 'state', {
     state: () => ({ 
               answer: "", 
               activeRow: 0,
               gameOver: false,
               guessList: Array(7).fill( '' ) as string[],
               statusMessage: '', 
               gameState: 'game-starting', //GameStates.INIT as string,
               keyColorMap: {} as Record<string,string>,
          }
     ),

     getters: {
          cursorCol: (state) => (state.activeRow <= 5 ? state.guessList[state.activeRow].length : 0),
          guessLen: (state) => (state.activeRow <= 5 ? state.guessList[state.activeRow].length : 0),
          typedGuess: (state) => (state.guessList[state.activeRow]),
     },

     actions: {
          /**
           * Increments the active Guess row, 0-6*.
           * (*Increments past the last guess, which is
           * necessary to trigger 6th, i.e.index=5, row to reveal.)
           * 
           */
          advanceNextRow() {
               this.activeRow++;
          },

          /**
           * Sets the message text (between the Guess list and
           * the keyboard).
           */
          setStatusMsg( msg:string ) {
               this.statusMessage = msg;
          },

          setGameState( state: string ) {
               this.gameState = state;
               if( state===GameStates.WON || state===GameStates.LOST )
               {
                    this.gameOver = true;
               }
          },

          setAnswer( answer:string ) {
               this.answer = answer;
          },

          setKeyColor( letterColor: LetterColor )
          {
               const { letter, color } = letterColor;

               // if key color is green, don't downgrade unless it's a reset
               if( this.keyColorMap[letter] !== MatchCodes.CORRECT
                    || color === MatchCodes.DEFAULT )
               {
                    this.keyColorMap = Object.assign( {}, this.keyColorMap, { [letter]:  color });
               }
          },

          sendActiveGuessColorsToKB()
          {
               const r = this.activeRow;
               for( let col = 0; col < this.guessList[r].length; col++ )
               {
                    const letterColor = calcLetterColor( this.guessList[r], this.answer, col );
                    this.setKeyColor( letterColor );
               }
          },
     }
  });

