<template>

    <div class='guess-letter :class="{[letterColor]: true}"'>
        <div class='front'>
            {{ letter_prop.letter }}
        </div>
        <div class='back '>
            {{ letter_prop.letter }}
        </div>
    </div>

</template>

<script lang='ts'>
"use strict";
// @ts-check
import { MatchCodes, LetterColorPair } from '../types';
import SharedState, { ISharedState, } from '../SharedState'

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
            type: LetterColorPair,
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
        SS: SharedState,
        focus() {
            let SS = this.SS;
            return SS.cursorColumn === this.my_column_prop && SS.cursorRow === this.my_row_prop;
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