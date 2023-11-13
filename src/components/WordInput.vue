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
     import { EventBus,  } from '@/EventBus'
     import { calcLetterColor } from '@/utils/Game';
     import { useStateStore } from '@/Store';
     import { CustomEventNames, KeyCodes, } from '@/types';
     
     export default Vue.extend({
          name: 'word-input',

          data() 
          {
               return {
                    EventBus,
               };
          },

          components: { Keyboard },

          inject: [],
//          emits : {'guess-validated':null,'update:target':null, 'message':null, } as any,
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
               ...mapState(useStateStore, ['guessLen', ]),
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
                                   word = word.substring(0, len - 1 )
                                   this.statusMsg( `Sorry, ${word} is not in my dictionary!` );
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
               {

               },
          },
          created(){
          },     
          beforeMount(){
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
       /*
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
     */
     
     
     
     
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
      