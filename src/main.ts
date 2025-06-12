"use strict";

import Vue from "vue";
import GameContainer from "@/components/GameContainer.vue";
import VueCompositionAPI from "@vue/composition-api";

Vue.use(VueCompositionAPI);

export const app = new Vue({
    el: "#app",
    render: (h) => h(GameContainer),

    provide: {},

    data: {},
});
