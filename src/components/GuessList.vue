<template>
<div class='guess-list' >
     <div v-for="row in 6" class='guess-row row' 
          :class="{ 'current': activeRow === row-1,  
                    'reveal': activeRow > row-1,
                    'correct': (activeRow > row-1 && guessList[row-1] === answer)
                    }" :key='row' >

          <div v-for="col in 5" :key='col' 
               class='letter-container '
               :class="{
                         'current': activeRow===row-1 && cursorCol === col-1 ,
                    }" >
               <guess-letter 
                    :class = "[getBoxColor(row-1,col-1)]" 
                    :character='getBoxLetter(row-1,col-1)'
               />
          </div>
     </div>
</div>
</template>

<script lang='ts'>
"use strict";
// @ts-check

/* eslint-disable no-unused-vars */

import Vue  from 'vue'
import GuessLetter from './GuessLetter.vue';
import { CustomEventNames, GameStates, MatchCodes, KeyCodes, } from '@/types';

import { calcLetterColor } from '@/utils/Game';

export default Vue.extend({
     name: 'guess-list',

     data() 
     {
          return {};
     },

     components: { GuessLetter },

     inject: [],

     props: 
          ['guessList', 'activeRow', 'answer']
     ,     

     computed: {
          cursorCol() {
               return this.currentGuess.length;
          },
          currentGuess() : string {
               return this.guessList[this.activeRow];
          },
     },

     methods: {
          getBoxColor( row: number, col: number ) : string
          {
               return calcLetterColor( this.guessList[row], this.answer, col).color;
          },
          getBoxLetter( row: number, col: number ) : string
          {
               return calcLetterColor( this.guessList[row], this.answer, col).letter;
          },

     },

     created(){
     },     

     beforeMount(){
     },     

     mounted() 
     {
     },
     
     beforeDestroy() 
     {
     },
});
 
</script>

<style>
.guess-letter { 
     position: absolute;
     left:0;
     top:0;
     display: inline-block; 
     width: 100%;
     height: 100%;
     font-size: min( 7vw, 35px );
     font-weight: normal; 
     font-family: Arial, sans-serif;
     transition: transform .75s ;
     transform-style: preserve-3D;
}

</style>

<style scoped>
  
.guess-row {
     display: flex;
     justify-content: center;
}

.letter-container {
     position: relative;
     height: min( 8vw, 40px ); 
     width: min( 8vw, 40px );
     margin: min( .5vw, 5px ) ; 
     perspective: 500px;
     box-sizing: content-box;
     border: 3px solid #EEE;
}


.game-in-progress .guess-row.current > .letter-container { 
     border: 3px solid #888;
}
.game-in-progress .guess-row.current > .letter-container.current { 
     border: 3px solid #888;
     background-color: #fee;
}


.guess-row.previous  .letter-container { 
     border: 3px solid #888;
}

@keyframes shake {
     0% { transform: translate( 1px, 1px ) rotate( 0deg ); }
     10% { transform: translate( -1px, -2px ) rotate( -1deg ); }
     20% { transform: translate( -3px, 0px ) rotate( 1deg ); }
     30% { transform: translate( 3px, 2px ) rotate( 0deg ); }
     40% { transform: translate( 1px, -1px ) rotate( 1deg ); }
     50% { transform: translate( -1px, 2px ) rotate( -1deg ); }
     60% { transform: translate( -3px, 1px ) rotate( 0deg ); }
     70% { transform: translate( 3px, 1px ) rotate( -1deg ); }
     80% { transform: translate( -1px, -1px ) rotate( 1deg ); }
     90% { transform: translate( 1px, 2px ) rotate( 0deg ); }
     100% { transform: translate( 1px, -2px ) rotate( -1deg ); }
}





/* reveal color as default grey, conditionally yellow or green */
.reveal .back  { background-color : #AAA; }
.reveal .back.present { background-color : rgb(238, 222, 152); }
.reveal .back.correct { background-color : rgb(137, 233, 137); }

/* when reveal class added, flip the wrapper div ocer to expose colored div */
.reveal .guess-letter
{
     transform: rotateY( 180deg );
}

.game-won .guess-row.reveal.correct
{
     animation: shake 0.5s;

     animation-iteration-count: 2;
     animation-delay: 2s; 
}


/* flip the columns .5s apart */
.reveal .letter-container:nth-child( 2 ) .guess-letter { transition-delay: .5s; }
.reveal .letter-container:nth-child( 3 ) .guess-letter  { transition-delay: 1s; }
.reveal .letter-container:nth-child( 4 ) .guess-letter  { transition-delay: 1.5s; }
.reveal .letter-container:nth-child( 5 ) .guess-letter  { transition-delay: 2s; }
.reveal .letter-container:nth-child( 6 ) .guess-letter  { transition-delay: 2.5s; }
 

 

  </style>
 