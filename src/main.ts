"use strict";

import Vue from 'vue'
import App from '@/App.vue'
import { wordlessApiService,  } from '@/WordlessAPI';
import { EventBus, } from '@/EventBus';
import { useStateStore } from '@/Store';
import { createPinia, PiniaVuePlugin, mapStores, mapActions } from 'pinia'
import VueCompositionAPI from '@vue/composition-api'
import { CustomEventNames, } from '@/types';


Vue.use( PiniaVuePlugin );
Vue.use( VueCompositionAPI );

const pinia = createPinia();

export const app = new Vue({
     el: '#app',
     render: h => h(App),

     provide: {
     },

     data: {
     },

     computed : {
          ...mapStores( useStateStore ),
     },

     methods: {
          ...mapActions( useStateStore,[ 'setAPIVersion','setStatusMsg'] ),

          async restartApp() 
          {
               this.stateStore.$reset();

               const response = await wordlessApiService.getWordAsync();
               if( response.success )
               {
                    this.setStatusMsg( 'Guess the 5-letter word in 6 tries. Good luck!' );
                    this.setAPIVersion( response.apiVersion ?? '');
                    EventBus.emitResetEvent( {answer: response.word as string} );
               }
               else
               {
                    this.setStatusMsg( `Error loading word - ${response.message}. Refresh page to retry.` );
               }
          },
     },

     pinia,

     async mounted()
     {
          EventBus.startListen( () => this.restartApp(), CustomEventNames.RESET_KEY );
          setTimeout( ()=>this.restartApp(), 2000 );
     }
});
