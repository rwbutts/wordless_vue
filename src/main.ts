"use strict";

import Vue from 'vue'
import SharedState, { statusMsg,  } from '@/SharedState'

import App from '@/App.vue'
import EventBus, {  } from '@/EventBus';
import VueCompositionAPI from '@vue/composition-api'


Vue.use( VueCompositionAPI );


export const app = new Vue({
     el: '#app',
     render: h => h(App),

     provide: {
     },

     data: {
     },

     computed : {
        SS:SharedState,
     },

     methods: {
     },

     async mounted()
     {
        statusMsg('Loading ...');
        setTimeout( ()=>EventBus.emitTriggerWordLoadEvent(), 2000 );
     }
});
