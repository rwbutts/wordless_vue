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
import { EventBus } from '../EventBus';
// @ts-check

import Vue,{ PropType, }   from 'vue'

export default Vue.extend({
     name: 'guess-letter',

     data() {
               return { 
                colorClass: MatchCodes.DEFAULT,
                enabled: false,
          };
     },
     props: {
          'character_prop': {
               type : String as PropType<string>,
               required : true,
          },
          'answer_prop': {
               type : String,
               required : true,
          },
          'my_column_prop': {
               type : Number,
               required : true,
          },
          'my_row_prop': {
               type : Number,
               required : true,
          },
          'am_active_prop': {
                   type: Boolean as PropType<Boolean>,
                   required : true,
              },
     },
     methods: {
        getColumn(): Number {
            return this.my_column_prop;
        },
    },
     computed : {
        computeColor(){
            if( this.character_prop === "" )
                this.colorClass = MatchCodes.DEFAULT;
            else if(this.answer_prop.charAt(this.my_column_prop) === this.character_prop)
                this.colorClass = MatchCodes.CORRECT;
            else if(this.answer_prop.indexOf(this.character_prop) >= 0 )
                this.colorClass = MatchCodes.ELSEWHERE;
            else
                this.colorClass = MatchCodes.MISS;
        },
     },
     mounted() {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.$emit('mounted', this );
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
  