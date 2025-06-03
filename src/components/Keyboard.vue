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
               <key char='DELETE'  control_key label='DELETE'/>
               <key char='Z'/>
               <key char='X'/>
               <key char='C'/>
               <key char='V'/>
               <key char='B'/>
               <key char='N'/>
               <key char='M'/>
               <key char='ENTER'  control_key label='ENTER'/>
         </div>
         <div class='kb-row' >
               <key class="reset-key" char='RESET'  control_key label='PLAY AGAIN' @click="broadcastReset();" />
         </div>
     </div>
     
</template>

<script lang='ts'>
/* eslint-disable no-unused-vars */

import Vue  from 'vue'
import Key from './Key.vue'
import { KeyPressEventArgs, }  from '@/types'
import EventBus from '../EventBus'
import { EventNames } from '@/types2';

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
        broadcastReset(){
            EventBus.emit(EventNames.LOAD_WORD, {});
        }
     },

     mounted() {
     },

     beforeDestroy() 
     {
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
