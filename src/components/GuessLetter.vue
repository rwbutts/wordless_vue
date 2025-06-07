<template>

    <div class='guess-letter' :class="{[letterProp.color]: true}">
        <div class='front'>
            {{ letterProp.letter }}
        </div>
        <div class='back '>
            {{ letterProp.letter }}
        </div>
    </div>

</template>

<script lang='ts'>
"use strict";
// @ts-check
import { MatchCodes, LetterColorPair } from '../types';
import SharedState, { } from '../SharedState'

// @ts-check

import Vue, { } from 'vue'

export default Vue.extend({
    name: 'guess-letter',

    data() {
        return {
            colorClass: MatchCodes.DEFAULT,
            letter: '',
            enabled: false,
            haveFocus: false,
        };
    },
    props: {
        'letterProp': {
            type: LetterColorPair,
            required: true,
        },
        'myColumnProp': {
            type: Number,
            required: true,
        },
        'myRowProp': {
            type: Number,
            required: true,
        },
    },
    computed: {
        SS: SharedState,
        // focus() {
        //     return this.SS.cursorColumn === this.my_column_prop && this.SS.cursorRow === this.my_row_prop;
        // },
    },
});

</script>

<style scoped>
.guess-letter {
    display: inline-block;
    position: absolute;
    height: 100%;
    width: 100%;

}
</style>

<style scoped>
/* opposing sides of the wrapper content */
.back,
.front {
    position: absolute;
    backface-visibility: hidden;
    height: 100%;
    width: 100%;
}

.back {
    transform: rotateY(180deg);
}
</style>

<style>
.guess-letter.miss .back {
    background-color: var(--color-miss);
}

.guess-letter.correct .back {
    background-color: var(--color-correct);
}

.guess-letter.elsewhere .back {
    background-color: var(--color-elsewhere);
}
</style>