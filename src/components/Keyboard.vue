<template>

    <div class='keyboard'>
        <div class='kb-row'>
            <key char='Q' @key="onKey" />
            <key char='W' @key="onKey" />
            <key char='E' @key="onKey" />
            <key char='R' @key="onKey" />
            <key char='T' @key="onKey" />
            <key char='Y' @key="onKey" />
            <key char='U' @key="onKey" />
            <key char='I' @key="onKey" />
            <key char='O' @key="onKey" />
            <key char='P' @key="onKey" />
        </div>
        <div class='kb-row'>
            <key char='A' @key="onKey" />
            <key char='S' @key="onKey" />
            <key char='D' @key="onKey" />
            <key char='F' @key="onKey" />
            <key char='G' @key="onKey" />
            <key char='H' @key="onKey" />
            <key char='J' @key="onKey" />
            <key char='K' @key="onKey" />
            <key char='L' @key="onKey" />
        </div>
        <div class='kb-row'>
            <key char='DELETE' :controlKey="true" label='DELETE'  @key="onKey"/>
            <key char='Z' @key="onKey" />
            <key char='X' @key="onKey" />
            <key char='C' @key="onKey" />
            <key char='V' @key="onKey" />
            <key char='B' @key="onKey" />
            <key char='N' @key="onKey" />
            <key char='M' @key="onKey" />
            <key char='ENTER' :controlKey="true" label='ENTER' @key="onKey" />
        </div>
        <div class='kb-row'>
            <key char='RESET' :controlKey="true" label='PLAY AGAIN' @key="broadcastReload();" />
        </div>
    </div>

</template>

<script lang='ts'>
/* eslint-disable no-unused-vars */

import Vue from 'vue'
import Key from './Key.vue'
import EventBus from '../EventBus'
import { KBRawKeyClickEvt } from '@/types';

export default Vue.extend({
    name: 'keyboard',

    data() {
        return {
        };
    },
    components: {
        Key
    },
    methods: {
        broadcastReload() {
            EventBus.emitTriggerWordLoadEvent();
        },
        onKey(e: KBRawKeyClickEvt) {
            this.$emit('key', e );
        },
    },
});
</script>

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
