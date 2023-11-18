<template>
<div id="app" class='disable-tap-zoom' >
     
     <stats :report='statsReport' 
     :isActive.sync='modalActive'  
     />

     <div class='game-container disable-tap-zoom' 
          :class="{
                    [gameState]:true, 
                    ['game-over'] : gameOver,
                    ['modal-active'] : modalActive, 
                    'enable-hard-mode' : hardMode,
                    }"
     >

          <h3 class='title' >Bill's VUE.js Wordless Game</h3>
 
          <guess-list :guessList='guessList' :answer='answer'
                    :activeRow='activeRow' />

          <div class='status-area'>
               <h3 class='status status-game-in-progress'> {{ statusMessage }}</h3> 
               <h3 class='status status-game-lost'>Sorry, the answer is {{answer}}</h3> 
               <h3 class='status status-game-won'>Congratulations, you got it! Please hire me!</h3> 
          </div>

          <word-input v-bind:target.sync='guessList[activeRow]'
               @guess-validated='guessValidated' 
               :validator='validateWord' 
               @message='setStatusMsg'/>


          <div class='footer'>
               <!--
               <span class='correct'>Green</span>: letter is in correct position
               <br><span class='elsewhere'>Yellow</span>: letter is elsewhere in word
               <br><span class='miss'>Grey</span>: letter is not present in the word
               -->
          
               <label class='hard-checkbox small-text' >
                    <input type="checkbox" v-model="hardMode">
                    <b>Hard Mode:</b> when checked, grey letters cannot be reused
               </label>
               <br><br>
               <span class='correct'>Green</span>: correct; 
               <span class='elsewhere'>Yellow</span>: wrong position;
               <span class='miss'>Grey</span>: not in word
               <br>
               <span class='small-text'>The unknown word may be plural</span>
          </div>

     </div>
</div>
</template>

<script lang='ts'>
"use strict";
// @ts-check

import Vue  from 'vue'
import GuessList from '@/components/GuessList.vue'
import WordInput from '@/components/WordInput.vue'
import Stats from '@/components/Stats.vue'
import { mapState, mapActions,  } from 'pinia'
import { useStateStore, } from '@/Store';
import { EventBus, } from '@/EventBus';
import { wordlessApiService, CheckWordAsyncResponseType} from '@/WordlessAPI'
import { CustomEventNames, GameStates, StatsReportGameResult,
     ResetGameEventArgs, } from '@/types';


export default Vue.extend({
     name: 'App',

     data() { 
          return {
               statsReport: {} as StatsReportGameResult,
               modalActive: false,
               hardMode: false,
          };
     },

     components: { 
          'guess-list': GuessList,
          'word-input': WordInput,
          'stats': Stats,
     },

     computed: {
          ...mapState(useStateStore, [ 'answer', 'statusMessage', 'gameState', 
               'guessList','activeRow', 'gameOver', ]),
     },

     methods: {
          ...mapActions(useStateStore,['setGameState','setStatusMsg', 
                'advanceNextRow', 'sendActiveGuessColorsToKB',
                 'setAnswer', ]),

          resetEventHandler( eventArgs  : ResetGameEventArgs) : void
          {
               this.setGameState( GameStates.RUNNING );
               this.setAnswer( eventArgs.answer);
          },

          guessValidated( guess: string ) : void
          {
               this.sendActiveGuessColorsToKB();
               this.advanceNextRow();
               if(guess === this.answer)
               {
                    this.setGameState(GameStates.WON);
                    this.statsReport = { finalState: GameStates.WON, numGuesses: this.activeRow };
               }
               else if (this.activeRow >= 6 )
               {
                    this.setGameState(GameStates.LOST);
                    this.statsReport = { finalState: GameStates.LOST };
               }
               else
                    this.displayMatchingWordCount( this.answer, this.guessList.slice(0, this.activeRow) );
          },

          async displayMatchingWordCount( answer: string, guesses: string[] ): Promise<void>
          {
               let apiResp = await wordlessApiService.getMatchCountAsync( answer, guesses );
               if( !apiResp.success )
               {
                    this.setStatusMsg( `Error retrieving match count: ${apiResp.message}` );
               }
               else
               {
                    this.setStatusMsg( `${apiResp.count} remaining word(s) match the clues above.` );
               }
          },

          async validateWord( word :string ): Promise<CheckWordAsyncResponseType>
          {
               return await wordlessApiService.checkWordAsync( word );
          }
     },

     mounted() {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          EventBus.startListen( this.resetEventHandler as any, CustomEventNames.RESET_COMPONENTS );
     },
     
     beforeDestroy() 
     {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          EventBus.stopListen( this.resetEventHandler as any, CustomEventNames.RESET_COMPONENTS );
     },
});
</script>

<style>

:root {
     --status-font-size: 12px;
     --title-font-size: min( 4vw , 25px );
     --footer-font-size: min( 3vw, 15px );
}

@media (min-width: 576px) 
{
     :root {
          --status-font-size: 14px;
     }
}

@media (min-width: 768px) 
{
}

@media (min-width: 992px) 
{
}

@media (min-width: 1200px) 
{
}

@media (min-width: 1400px) 
{
}

:root {
     --color-correct: rgb(137, 233, 137);
     --color-elsewhere: rgb(238, 222, 152);
     --color-miss: #AAA;
     --color-default: #FFF;
     --color-status-err: #822;
     --color-status: #000;
     --color-game-background: white;
     --color-title: rgb(23, 170, 23);
     --color-stats-background: white;
     --color-stats-text: #444;
     --color-modal-game-background: #white;
     --color-viewport-color: #eee;
} 

html { 
     height: 100%; 
     display: flex;
     justify-content: center;
     align-items: flex-start;
     background-color: var(--color-viewport-color);
}

div { box-sizing: border-box; }

/* body { margin: 0; height: 100%; width: 500px;} */
body { margin: 0; height: auto; width: auto;}

#app {
     font-family: Arial, sans-serif;
     color: #2c3e50;
     background-color: var(--color-game-background);
     border: 1px solid #aaa;
     box-shadow: 7px 7px #ddd;
     padding: 5px 10px;
     /*
     border-radius: 5px;
     */

     -webkit-font-smoothing: antialiased;
     -moz-osx-font-smoothing: grayscale;
     touch-action:'manipulation';     /* disable iphone default tap zoom action */

     display: flex;
     justify-content: center; 
     align-items:center;
     text-align: center;

     position: relative;
     width: auto;
     height: auto;
     margin: 5px 0;
}

.disable-tap-zoom  {   
     touch-action: none;     /* disable iphone default tap zoom action */
}

.game-container {
     position: static;
}

.game-container.modal-active {
     pointer-events: none;
}
</style>

<style scoped>
.title {
     font-weight: bold;
     font-size:var(--title-font-size);
     color: var(--color-title);
}

span.correct { background-color: var(--color-correct); }
span.elsewhere { background-color: var(--color-elsewhere); }
span.miss { background-color: var(--color-miss); }

.footer {
     font-size: var(--footer-font-size);
     font-weight: bold;
     margin: auto;
}

.small-text {
     font-weight: normal;
     font-size: smaller;
}

.hard-checkbox input {
     margin-bottom: 0px;
     height: 1.5vh;
     width: 1.5vh;
}

</style>

<style>
.status-area { 
     min-height: 20px;
     margin-top: 10px;
}

.status { 
     font-size: var(--status-font-size);
     display: block;
     transform: scale( 0, 0 );
     /* transition: transform 0s 3s; */
     margin: 0;
     height: 0;
}

.game-container.game-starting .status.status-game-in-progress,
.game-container.game-in-progress .status.status-game-in-progress, 
.game-container.game-won .status.status-game-won, 
.game-container.game-lost .status.status-game-lost 
{
     transform: scale( 1, 1 );
     display: block;
}

/*
.gg { border: 1px solid green!important;}
.gr { border: 1px solid red!important;}
.gb { border: 1px solid blue!important;}
.gy { border: 1px solid yellow!important;}
*/

</style>
