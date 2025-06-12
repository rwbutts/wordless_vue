"use strict";

import Vue from "vue";
import GameContainer from "@/components/GameContainer.vue";
import EventBus from "@/EventBus";
import VueCompositionAPI from "@vue/composition-api";

Vue.use(VueCompositionAPI);

export const app = new Vue({
    el: "#app",
    render: (h) => h(GameContainer),

    provide: {},

    data: {},

    async mounted() {
        setTimeout(() => EventBus.emitTriggerWordLoadEvent(), 2000);
    },
});
