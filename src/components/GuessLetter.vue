<template>

    <div class='guess-letter' :class="{ [letterColor]: true }">
        <div class='front'>
            {{ letterProp }}
        </div>
        <div class='back '>
            {{ letterProp }}
        </div>
    </div>

</template>

<script lang='ts'>
"use strict";
// @ts-check
import { MatchCodes,  } from '../types';

import Vue, { } from 'vue'

export default Vue.extend({
    name: 'guess-letter',

    data() {
        return {
        };
    },
    props: {
        'letterProp': {
            type: String,
            required: true,
        },
        'answerProp': {
            type: String,
            required: true,
        },
        'columnProp': {
            type: Number,
            required: true,
        },
        
    },
    computed: {
        letterColor(): MatchCodes {
            return (this.letterProp === this.answerProp.charAt(this.columnProp )) 
            ? MatchCodes.CORRECT 
            : (this.answerProp.includes(this.letterProp) ? MatchCodes.ELSEWHERE : MatchCodes.MISS);
        }
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