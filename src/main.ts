"use strict";

const VERSION = '2.3';

import Vue  from 'vue'
import { wordlessApiService,  } from '@/WordlessAPI';
import App from '@/App.vue'
import { EventBus, } from '@/EventBus';

import { useStateStore } from '@/Store';
import { createPinia, PiniaVuePlugin, mapStores } from 'pinia'
import VueCompositionAPI from '@vue/composition-api'
import { CustomEventNames, GameStates, } from '@/types';


Vue.use(PiniaVuePlugin)
Vue.use(VueCompositionAPI)

const pinia = createPinia()

console.log(`init = -${GameStates.INIT}`);

export const app = new Vue({
     el: '#app',
     render: h => h(App),

     provide: {
     },

     data: {
          VERSION : VERSION,
     },

     computed : {
          ...mapStores( useStateStore, ''),
     },

     methods: {
          async restartApp() 
          {
               this.stateStore.$reset();

               const response = await wordlessApiService.getWordAsync();
               if( response.success )
               {
                    this.stateStore.setStatusMsg(`Guess the 5-letter word in 6 tries. Good luck!`);
                    EventBus.emitResetEvent( { answer: response.word } );
               }
               else
               {
                    this.stateStore.setStatusMsg( `Error loading word - ${response.message}` );
               }
          },
     },

     pinia,

     async mounted()
     {
          EventBus.startListen( () => this.restartApp(), CustomEventNames.RESET_KEY );
          setTimeout( ()=>this.restartApp(), 2000 );
          this.stateStore.setStatusMsg( `V${this.VERSION}: Loading word...` );
     }
});
