<template>

     <div class='guess-letter :class="{[colorClass]: true}"'>
          <div class='front'>
               {{ character_prop }}
          </div>
          <div class='back ' >
               {{ character_prop }}
          </div>
     </div>

</template>
  
<script lang='ts'>
"use strict";
import { MatchCodes, KBCommandEventArgs, CustomEventNames, KeyCodes } from '@/types';
import { UILetterEvt, EventNames, EvtReceiver,  } from '@/types2';
import SharedState from '@/SharedState'
import  EventBus  from '../EventBus';

// @ts-check

import Vue,{ PropType, }   from 'vue'

export default Vue.extend({
     name: 'guess-letter',

     data() {
               return { 
                colorClass: MatchCodes.DEFAULT,
                letter: '',
                enabled: false,
                haveFocus: false,
          };
     },
     props: {
          'my_column_prop': {
               type : Number,
               required : true,
          },
          'my_row_prop': {
               type : Number,
               required : true,
          },
      },
     methods: {
        getColumn(): Number {
            return this.my_column_prop;
        },
        onUIStyle( evt: UILetterEvt ) {
            if( (evt.col_number===undefined || evt.col_number===this.my_column_prop) && (evt.row_number===undefined || evt.row_number===this.my_row_prop) )
            {
                if( evt.letter !== undefined ) this.letter=evt.letter;
                if( evt.color !== undefined ) this.colorClass=evt.color;
                if( evt.focus !== undefined ) this.haveFocus=evt.focus;
            }
            else{
                if( evt.focus === true ) this.haveFocus=false;
            }
        }
    },
     computed : {
        SharedState
     },
     mounted() {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          EventBus.On({ event: EventNames.UI_STYLE, handler: this.onUIStyle, This:this, } as EvtReceiver );
     },

});
  
</script>
  
<style scoped>
.guess-letter {
     display: inline-block;
     position: absolute;
     height: 100%; 
     width: 100%;

}
</style>

<style scoped>
/* opposing sides of the wrapper content */
.back, .front { 
     position: absolute;
     backface-visibility: hidden;
     height: 100%; 
     width: 100%;
}

.back {
     transform: rotateY( 180deg );
}
</style>

<style>

.guess-letter.miss .back {
     background-color: var(--color-miss);
}

.guess-letter.correct .back {
     background-color: var(--color-correct);
}

.guess-letter.elsewhere .back {
     background-color: var(--color-elsewhere);
}
</style>
  