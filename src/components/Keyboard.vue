<template>

     <div class='keyboard' >
          <div class='kb-row' >
               <key char='Q' class='alpha' ref='Q_KEY'/>
               <key char='W' class='alpha' ref='W_KEY'/>
               <key char='E' class='alpha' ref='E_KEY'/>
               <key char='R' class='alpha' ref='R_KEY'/>
               <key char='T' class='alpha' ref='T_KEY'/>
               <key char='Y' class='alpha' ref='Y_KEY'/>
               <key char='U' class='alpha' ref='U_KEY'/>
               <key char='I' class='alpha' ref='I_KEY'/>
               <key char='O' class='alpha' ref='O_KEY'/>
               <key char='P' class='alpha' ref='P_KEY'/>
          </div>
          <div class='kb-row' >
               <key char='A' class='alpha' ref='A_KEY'/>
               <key char='S' class='alpha' ref='S_KEY'/>
               <key char='D' class='alpha' ref='D_KEY'/>
               <key char='F' class='alpha' ref='F_KEY'/>
               <key char='G' class='alpha' ref='G_KEY'/>
               <key char='H' class='alpha' ref='H_KEY'/>
               <key char='J' class='alpha' ref='J_KEY'/>
               <key char='K' class='alpha' ref='K_KEY'/>
               <key char='L' class='alpha' ref='L_KEY'/>
          </div>
          <div class='kb-row' >
               <key char='DELETE' ref='DELETE_KEY' control_key label='DELETE'/>
               <key char='Z' class='alpha' ref='Z_KEY'/>
               <key char='X' class='alpha' ref='X_KEY'/>
               <key char='C' class='alpha' ref='C_KEY'/>
               <key char='V' class='alpha' ref='V_KEY' />
               <key char='B' class='alpha' ref='B_KEY'/>
               <key char='N' class='alpha' ref='N_KEY'/>
               <key char='M' class='alpha' ref='M_KEY'/>
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
import { MatchCodes, IClassifiedKeyRefs, KeyCodes,  } from '@/types';

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
                let result: IClassifiedKeyRefs = { all:[] , alpha:[], nonalpha:[]};
                Object.keys(this.$refs).filter( k => k.endsWith('_KEY')).forEach ( k=>{
                    let keyObj = this.$refs[k];
                    if(!keyObj) {
                        console.error(`got undefined $ref[${k}]`);
                    } else {
                        result.all.push(k);
                        if ((keyObj as InstanceType<typeof Key>).$el?.hasAttribute('control_key')) {
                            result.nonalpha.push(k);
                        } else {
                            result.alpha.push(k);
                        }
                    }
                });
                console.log(result);
                return result;
            },
     },
     methods: {
        broadcastReload(){
            EventBus.emitTriggerWordLoadEvent();
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
                    keyList = [];
                    console.error(`keyboard::setKeyColor{} unknown class key ${key}`);
            }
            keyList.forEach( (k) => {(this.$refs[k] as InstanceType<typeof Key>)?.setKeyColor(color);} );
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
