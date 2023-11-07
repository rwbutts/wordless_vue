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

import Vue  from 'vue'

export default Vue.extend({
    name: 'guess-letter',

    data() {
         return { 
         };
    },

    props: ['character', 'color' ],

    methods: {
     },

    mounted() {
     },
    
    beforeDestroy() {
    },
  });
  
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
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
:root {
     --color-correct: rgb(137, 233, 137);
     --color-elsewhere: rgb(238, 222, 152);
     --color-miss: #AAA;
     --color-default: #FFF;
}
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
  