
<template>
     <div class='keyboard' >
          <div class='kb-row' >
               <key :refMap='refMap' char='Q' @click='keyHandler' />
               <key :refMap='refMap' char='W' @click='keyHandler' />
               <key :refMap='refMap' char='E' @click='keyHandler' />
               <key :refMap='refMap' char='R' @click='keyHandler' />
               <key :refMap='refMap' char='T' @click='keyHandler' />
               <key :refMap='refMap' char='Y' @click='keyHandler' />
               <key :refMap='refMap' char='U' @click='keyHandler' />
               <key :refMap='refMap' char='I' @click='keyHandler' />
               <key :refMap='refMap' char='O' @click='keyHandler' />
               <key :refMap='refMap' char='P' @click='keyHandler' />
          </div>
          <div class='kb-row' >
               <key :refMap='refMap' char='A' @click='keyHandler' />
               <key :refMap='refMap' char='S' @click='keyHandler' />
               <key :refMap='refMap' char='D' @click='keyHandler' />
               <key :refMap='refMap' char='F' @click='keyHandler' />
               <key :refMap='refMap' char='G' @click='keyHandler' />
               <key :refMap='refMap' char='H' @click='keyHandler' />
               <key :refMap='refMap' char='J' @click='keyHandler' />
               <key :refMap='refMap' char='K' @click='keyHandler' />
               <key :refMap='refMap' char='L' @click='keyHandler' />
          </div>
          <div class='kb-row' >
               <key :refMap='refMap' char='BACKSPACE'  special_key label='DELETE' @click='keyHandler' />
               <key :refMap='refMap' char='Z' @click='keyHandler' />
               <key :refMap='refMap' char='X' @click='keyHandler' />
               <key :refMap='refMap' char='C' @click='keyHandler' />
               <key :refMap='refMap' char='V' @click='keyHandler' />
               <key :refMap='refMap' char='B' @click='keyHandler' />
               <key :refMap='refMap' char='N' @click='keyHandler' />
               <key :refMap='refMap' char='M' @click='keyHandler' />
               <key :refMap='refMap' char='ENTER'  special_key label='ENTER' @click='keyHandler' />
         </div>
         <div class='kb-row' >
               <key :refMap='refMap' class="reset-key" char='RESET'  special_key label='PLAY AGAIN' @click="$emit('reset');" />
         </div>
     </div>
</template>

<script lang='ts'>

/* eslint-disable no-unused-vars */

import Vue  from 'vue'
import Key from './Key.vue'

export default Vue.extend({
     name: 'keyboard',

     data() 
     {
          return {
                refMap : {} as Record<string,any>,
          };
     },
    // emit: ['key-press', 'reset' ],
     computed: {
     },

     components: {
          Key
     },

     methods: {
          keyHandler( args: KeyPressEventArgs ) : void 
          {
               this.$emit( 'key-press', args );
          },

          handleRealKey( e : KeyboardEvent ) : void
          {
               let ucKey = ( e.key || '' ).toUpperCase();
               console.log(`key ${ucKey}`);
               if( ucKey in this.refMap )
               {
                    let keyRef = this.refMap[ ucKey ];
                    {
                         keyRef.clickHandler();
                    }
               }
          },
          /**
           * Duplicate copy, but with'this' bound to us
           * otherwise 'this' is window.
           * Declare as junk function so Vue knows its type
           * upon init.
           * We overwrite this in mounted()
           */
          _handleRealKeyThis: ()=>null,
     },

     beforeMount(){
     },

     mounted() {
          this.handleRealKey = this.handleRealKey.bind(this);   
          window.addEventListener( 'keydown', this.handleRealKey );
     },

     beforeDestroy() 
     {
          window.removeEventListener( 'keydown', this._handleRealKeyThis );
     },
     
     created() {
     }
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
     margin-bottom: 4vh;
}
</style>
