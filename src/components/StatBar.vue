<template>

<div class='box-bar'>
     <div class='box-caption1'>{{ caption }}</div>
     <div class='box-caption2'>{{ (isNaN(percent) ? '--' : percent) }}&percnt; </div>
     <div v-for="i in 10"  class='box' :class='{filled : i <= barCount}' :key='i'></div>
</div>

</template>

<script lang='ts'>
"use strict";
// @ts-check

import Vue, { PropType }  from 'vue'

export default Vue.extend({
     name: 'statsbar',

     data  () {
          return { 
          };
     },

     props: {
          percent : {
               type : Number as PropType<number>,
               required : true,
          },
          caption : {
               type : String as PropType<string>,
               required : false,
               default : '',
          },
     },

     computed: {
          barCount() : number {
               return Math.floor( ( this.percent + 5) / 10 );
          }
     },
});

</script>

<style scoped>
div { padding: 0; }

.box-bar {
     height: 15px;
     width: 280px; 
     font-size: max( .7vw, 70% );
     display: flex;
     justify-content: flex-start;
     align-items: center;
     margin: 0 0 5px 0;
     position: relative;
}

.box-caption1 {
     height: 100%;
     flex: 0 0 50px;
     padding-top: 2px;
}
.box-caption2 {
     height: 100%;
     flex: 0 0 35px;
     padding-top: 2px;
}

.box {
     height: 100%;
     flex: 1 0 auto;
     border: 1px dotted #aaa;
     margin:0 -1px 0 0;
}

.box.filled {
     border: 1px solid black;
     background-color : rgb(137, 233, 137);
}

.bar-missed-pct .box.filled {
     border: 1px solid black;
     background-color : var(--color-miss);
}
</style>
