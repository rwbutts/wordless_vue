"use strict";

import Vue  from 'vue'
import { wordlessAPISvc } from '@/WordlessAPI';
import App from '@/App.vue'
import { ResetGameEventArgs, EventBus, CustomEventNames, } from '@/EventBus';

import { useStateStore } from '@/Store';
import { createPinia, PiniaVuePlugin, mapStores } from 'pinia'
import VueCompositionAPI from '@vue/composition-api'

Vue.use(PiniaVuePlugin)
const pinia = createPinia()
Vue.use(VueCompositionAPI)


Vue.use(pinia);

const VERSION = '2.23';

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

               let response = await wordlessAPISvc.getWordAsync();
               if( response.success )
               {
                    this.stateStore.setStatusMsg(`Guess the 5-letter word in 6 tries. Good luck!`);
                    (new ResetGameEventArgs(response.word)).emit();
               }
               else
               {
                    this.stateStore.setStatusMsg( `Error loading word - ${response.message}` );
               }
          },
     },

     beforeMount() {
     },

     pinia,

     async mounted()
     {
          EventBus.startListen(() => this.restartApp(), CustomEventNames.RESET_KEY );
          setTimeout( ()=>this.restartApp(), 2000);
          this.stateStore.setStatusMsg(`V${this.VERSION}: Loading word...`);
     }
});
//app.$mount('#app');

