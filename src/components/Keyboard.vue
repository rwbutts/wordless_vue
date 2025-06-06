<template>

     <div class='keyboard' >
          <div class='kb-row' >
               <key char='Q' ref='Q_KEY'/>
               <key char='W' ref='W_KEY'/>
               <key char='E' ref='E_KEY'/>
               <key char='R' ref='R_KEY'/>
               <key char='T' ref='T_KEY'/>
               <key char='Y' ref='Y_KEY'/>
               <key char='U' ref='U_KEY'/>
               <key char='I' ref='I_KEY'/>
               <key char='O' ref='O_KEY'/>
               <key char='P' ref='P_KEY'/>
          </div>
          <div class='kb-row' >
               <key char='A' ref='A_KEY'/>
               <key char='S' ref='S_KEY'/>
               <key char='D' ref='D_KEY'/>
               <key char='F' ref='F_KEY'/>
               <key char='G' ref='G_KEY'/>
               <key char='H' ref='H_KEY'/>
               <key char='J' ref='J_KEY'/>
               <key char='K' ref='K_KEY'/>
               <key char='L' ref='L_KEY'/>
          </div>
          <div class='kb-row' >
               <key char='DELETE'  ref='DELETE_KEY' control_key label='DELETE'/>
               <key char='Z' ref='Z_KEY'/>
               <key char='X' ref='X_KEY'/>
               <key char='C' ref='C_KEY'/>
               <key char='V' ref='V_KEY' />
               <key char='B' ref='B_KEY'/>
               <key char='N' ref='N_KEY'/>
               <key char='M' ref='M_KEY'/>
               <key char='ENTER' ref='ENTER_KEY'   control_key label='ENTER'/>
         </div>
         <div class='kb-row' >
               <key  ref='RESET_KEY' char='RESET'  control_key label='PLAY AGAIN' @click="broadcastReload();" />
         </div>
     </div>
     
</template>

<script lang='ts'>
/* eslint-disable no-unused-vars */

import Vue  from 'vue'
import Key from './Key.vue'
import EventBus from '../EventBus'
import { EventNames, MatchCodes, IClassifiedKeyRefs, KeyCodes,  } from '@/types';

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
     computed: {
            allKeyRefs(): IClassifiedKeyRefs {
                let result: IClassifiedKeyRefs = { all:[], alpha:[], nonalpha:[]};
                Object.keys(this.$refs).filter( k => k.startsWith('KEY_')).forEach ( k=>{
                    let keyObj = this.$refs[k];
                    if(!keyObj) {
                        console.error(`got undefined $ref[${k}]`);
                    } else {
                        result.all.push(k);
                        if ((keyObj as any).$el?.hasAttribute('control_key')) {
                            result.nonalpha.push(k);
                        } else {
                            result.alpha.push(k);
                        }
                    }
                });
                return result;
            },
     },
     methods: {
        broadcastReload(){
            EventBus.emit(EventNames.LOAD_WORD, {});
        },
        setKeyColor( key:string|KeyCodes, color : MatchCodes) {
            let keyList: string[];
            switch(true) {
                case key===KeyCodes.ALL:
                    keyList = this.allKeyRefs.all;
                    break;
                case key===KeyCodes.ALPHA:
                    keyList = this.allKeyRefs.alpha;
                    break;
                case key===KeyCodes.NONALPHA:
                    keyList = this.allKeyRefs.nonalpha;
                    break;
                case ['DELETE', 'ENTER', 'RESET'].includes(key) || (key>='A' && key<='Z' && key.length==1):
                    keyList = [key];
                    break;
                default:
                    console.error(`keyboard::setKeyColor{} unknown class key ${key}`);
            }
        },
        setKeyColors( keys:string[], color : MatchCodes) {
            keys.forEach(key => {
                let keyRef = this.$refs['KEY_'+key];
                if(keyRef) {
                    (keyRef as any).setColor( color );
                } else {
                    console.error(`Keyboard::setKeyColor() this.$refs[${'KEY_'+key}] was undefined!`)
                }
            });
        },
        
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
