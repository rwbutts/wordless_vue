<template>

     <div class='keyboard' >
          <div class='kb-row' >
               <key char='Q'/>
               <key char='W'/>
               <key char='E'/>
               <key char='R'/>
               <key char='T'/>
               <key char='Y'/>
               <key char='U'/>
               <key char='I'/>
               <key char='O'/>
               <key char='P'/>
          </div>
          <div class='kb-row' >
               <key char='A'/>
               <key char='S'/>
               <key char='D'/>
               <key char='F'/>
               <key char='G'/>
               <key char='H'/>
               <key char='J'/>
               <key char='K'/>
               <key char='L'/>
          </div>
          <div class='kb-row' >
               <key char='DELETE' :controlKey="true" label='DELETE'/>
               <key char='Z'/>
               <key char='X'/>
               <key char='C'/>
               <key char='V' />
               <key char='B'/>
               <key char='N'/>
               <key char='M'/>
               <key char='ENTER'  :controlKey="true" label='ENTER'/>
         </div>
         <div class='kb-row' >
               <key  char='RESET'  :controlKey="true" label='PLAY AGAIN' @click="broadcastReload();" />
         </div>
     </div>
     
</template>

<script lang='ts'>
/* eslint-disable no-unused-vars */

import Vue  from 'vue'
import Key from './Key.vue'
import EventBus from '../EventBus'

export default Vue.extend({
     name: 'keyboard',

     data() 
     {
          return {
          };
     },
     components: {
          Key
     },
     methods: {
        broadcastReload(){
            EventBus.emitTriggerWordLoadEvent();
        },
     },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.keyboard .kb-row {
     display: flex;
     justify-content: center;
     margin: 2vh 0 0 0;
}

.keyboard { 
     margin-top: 3vh;
     margin-bottom: 2vh;
}
</style>
