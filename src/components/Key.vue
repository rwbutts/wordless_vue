<template>

     <BUTTON
          href = '#'
          class = 'key-button'
          @click = "clickHandler"
          :class= "getCSSClasses"
     >
          {{ label ? label : char }}
     </BUTTON>

</template>

<script lang='ts'>
"use strict";
// @ts-check

import Vue, {PropType, }  from 'vue'
import { mapState,  } from 'pinia'
import { useStateStore, } from '@/Store';
import {  MatchCodes, } from '@/types';

export default Vue.extend({
     name: 'key',

     data  () {
          return { 
               keyDown : false,
          };
     },

     props: {
          label : {
               type: String as PropType<string>,
               default: "",
          },

          special_key : {
               type: Boolean as PropType<boolean>,
               default: false,
          },

          // character/mnemonic emitted with key click event
          char : {
               type: String as PropType<string>, 
               required : true,
          },
          
          refMap : {
               type: Object as PropType<Record<string, unknown>>,
               required : true,
          },
     },

     computed: 
     {
          ...mapState( useStateStore, ['KeyColorMap', ] ),
          getCSSClasses() : Record<string, boolean>
          {

               // let colorClass = ( this.KeyColorMap !== null && this.char in this.KeyColorMap ) 
               //                ? this.KeyColorMap[ this.char ]
               //                : MatchCodes.DEFAULT;
               let colorClass = this.KeyColorMap[ this.char ] ?? MatchCodes.DEFAULT;

               let classes = {
                    special_key: this.special_key,
                    [ 'key-' + this.char.toLowerCase() ]: true,
                    [ this.special_key ? 'key-nonalpha' : 'key-alpha' ] : true,
                    [ colorClass ]: true,
                    'key-down': this.keyDown,
               };

               return classes;
          },
      },

     methods: 
     {
          clickHandler( ) : void
          {
               /**                
                * check if disabled in css so keypress-
                * calls are ignored (native click will be 
                * disabled by css setting natively.)
                **/
               if( !this.isCssPointerEventDisabled() )
               {
                    this.keyDown = true;
                    this.$emit( 'click', {character: this.char } );
                    setTimeout( ()=>(this.keyDown = false), 100 );
               }
          },

          isCssPointerEventDisabled() : boolean 
          {
               let styles = window.getComputedStyle( this.$el );
               let val = styles.getPropertyValue( 'pointer-events' );
               return ( val === 'none') ;
          },
     },

     mounted() {
          this.refMap[ this.char ] = this;
     },

});
</script>

<style>
button.key-button,
.modal-active.modal-active.modal-active button.key-button { 
     --key-width : min( 7vw, 30px );
     display: inline-block; 
     border: 2px solid grey;
     border-radius: 5px;
     padding: 0px 4px;
     margin: 0 calc(  var( --key-width ) * .1) ;
     min-width: var( --key-width ); 
     height: calc(  var( --key-width ) * .8 );
     font-size: calc(var( --key-width ) * .5 );
     font-weight: normal;
     color: black;

     opacity: .4; pointer-events: none;
}

button.key-button:active { 
     border: 2px solid black;

}

button.key-button.enabled, 
.game-in-progress .keyboard.guess-is-not-empty .key-backspace,
.game-in-progress .keyboard.guess-is-full-word .key-enter, 
.game-in-progress .keyboard.guess-is-not-full-word .key-alpha,
.game-over .key-reset
{ 
     opacity: 1.0; 
     pointer-events: all; 
}

.key-button.default {  background-color: var(--color-default); }
.key-button.miss {  background-color: var(--color-miss); }
.key-button.elsewhere {  background-color: var(--color-elsewhere); }
.key-button.correct {  background-color: var(--color-correct); }

/* 
     key down immediately makes dark, when down is removed, 
     fade back to normal
*/
.key-button {
     transition: all  .2s 0s;
}

.key-button.key-down {
     color: white;
     background-color: #444;
     transition: all  0s 0s;
}

/*   if expert mode, disable the key if it's a miss.
     duplicate .miss to increase priority of selector 
*/
.enable-hard-mode .key-button.miss.miss { 
     opacity: .4; pointer-events: none; 
}
</style>

<style scoped>
</style>
