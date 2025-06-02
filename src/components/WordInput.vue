<template>
     <keyboard @key-press='keyEventHandler' ref='keyboard'
     :class="{ 'guess-is-not-empty' : guessLen>0,
               'guess-is-full-word' :  guessLen >= 5,
               'guess-is-not-full-word' : guessLen <5 }"
               @reset='EventBus.emitResetRequestEvent( {} );'/>
</template>
     
<script lang='ts'>
"use strict";
// @ts-check

/* eslint-disable no-unused-vars */

import Vue, { PropType }  from 'vue'
import { mapState,  } from 'pinia'
import Keyboard from './Keyboard.vue';
import EventBus from '@/EventBus'
import { calcLetterColor } from '@/utils/Game';
import { useStateStore } from '@/Store';
import { CustomEventNames, KeyCodes, KeyPressEventArgs, } from '@/types';

export default Vue.extend({
     name: 'word-input',

     data() 
     {
          return {
               EventBus,
               cheatCode : process.env.VUE_APP_CHEAT_CODE ?? '**disabled**',
               currentGuessNumber: 0,
               cursor: 0,
          };
     },

     components: { Keyboard },

     inject: [],
     
     props: 
     {    
          'target': {
               type: String as PropType<string>,
               required : true,
          },
          'validator': {
               type: Function,
               required : true,
          }
     },     

     computed: {
          ...mapState(useStateStore, ['guessLen', 'answer', ]),
     },

     methods: {
          async keyEventHandler( eventArgs :KeyPressEventArgs ) : Promise<void>
          {
               let key = eventArgs.character;
               let resp;

               let wordOrig = this.target || '';
               let word = this.target || '';
               let len = word.length;

               this.statusMsg( '' );
               switch( true )
               {
                    case key === KeyCodes.ENTER && len >= 5:
                         resp = await this.validator( word );
                         if( resp.exists === false )
                         {
                              if( word === this.cheatCode )
                              {
                                   this.statusMsg( `( ${this.answer} is the answer :)` );
                              }
                              else     
                              {
                                   this.statusMsg( `Sorry, ${word} is not in my dictionary!` );
                              }
                              
                              word = word.substring(0, len - 1 );
                         }
                         else if( resp.exists === true )
                         {
                              this.$emit( 'guess-validated', word, calcLetterColor );
                         }  
                         else if( resp.exists === undefined )
                         {
                              this.statusMsg( `Error validating word: ${resp.message}. Try again in a few moments.` );
                         }
                         break;
                    case key === KeyCodes.DELETE && len > 0:
                         word = word.substring( 0, len - 1 )
                         break;
                    case key.length === 1 && key >= 'A' && key <= 'Z' && len < 5:
                         word = word + key;
                         break;
               }

               if( word != wordOrig)
                    this.$emit('update:target', word );

          },
          statusMsg( msg : string ) : void
          {
               this.$emit('message', msg );
          },

          resetEventHandler(  ) : void
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          {

          },
     },

     mounted() {
          EventBus.startListen( this.resetEventHandler, CustomEventNames.RESET_COMPONENTS );
     },

     beforeDestroy() 
     {
          EventBus.stopListen( this.resetEventHandler, CustomEventNames.RESET_COMPONENTS );
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

</style>
      