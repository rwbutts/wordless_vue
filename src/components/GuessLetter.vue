<template>

    <div class='guess-letter :class="{[letterColor]: true}"'>
        <div class='front'>
            {{ letter }}
        </div>
        <div class='back '>
            {{ letter }}
        </div>
    </div>

</template>

<script lang='ts'>
"use strict";
// @ts-check
import { MatchCodes, KBCommandEventArgs, CustomEventNames, KeyCodes } from '../types';
import { UILetterEvt, EventNames, EvtHandler, ISharedState, } from '../types2';
import SharedState from '../SharedState'
import EventBus from '../EventBus';

// @ts-check

import Vue, { PropType, } from 'vue'

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
        'letter_prop': {
            type: String,
            required: true,
        },
        'my_column_prop': {
            type: Number,
            required: true,
        },
        'my_row_prop': {
            type: Number,
            required: true,
        },
    },
    methods: {
    },
    computed: {
        SharedState,
        letter(): string {
            return this.SharedState.guesses[this.my_row_prop][this.my_column_prop];
        },
        letterColor(): MatchCodes {
            let s = this.SharedState;
            return this.letter_prop === s.answer.charAt(s.cursorColumn)
                ? MatchCodes.CORRECT
                : (s.answer.includes(this.letter_prop) ? MatchCodes.ELSEWHERE : MatchCodes.MISS);
        },
        focus() {
            let s = this.SharedState;
            return s.cursorColumn === this.my_column_prop && s.guessNumber === this.my_row_prop;
        },
    },
    mounted() {
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