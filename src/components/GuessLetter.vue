<template>

     <div class='guess-letter '>
          <div class='front'>
               {{ character }}
          </div>
          <div class='back ' >
               {{ character }}
          </div>
     </div>

</template>
  
<script lang='ts'>
"use strict";
// @ts-check

import Vue,{ PropType}   from 'vue'

export default Vue.extend({
     name: 'guess-letter',

     data() {
               return { 
          };
     },

     props: {
          'character': {
               type : String as PropType<string>,
               required : true,
          },
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
  