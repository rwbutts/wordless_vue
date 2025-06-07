<template>
    <div class='guess-row row' :class="{ focus: haveFocus, reveal: reveal }">

        <div v-for="col in 5" :key='col' class='letter-container'
            :class="{ focus: haveFocus && col-1 === SS.cursorColumn }">
            <guess-letter :letterProp="letterRowArrayProp[col -1]" :myColumnProp="col-1"  :myRowProp="myRowProp" />
        </div>
 
        <!--
    <pre>|{{ JSON.stringify(letterRowArrayProp) }}|</pre>
-->    </div>


</template>

<script lang='ts'>
"use strict";
// @ts-check

import Vue, { PropType } from 'vue'
import GuessLetter from './GuessLetter.vue';
import SharedState from '@/SharedState'
import { LetterColorPair } from '@/types';

export default Vue.extend({
    name: 'guess-word',

    data() {
        return {
        };
    },

    components: { GuessLetter },

    props:
    {
        myRowProp: {
            type: Number as PropType<number>,
            required: true,
        },
        letterRowArrayProp: Array,
    //     'letterRowArrayProp': {
    //         type: Array as PropType<Array<LetterColorPair>>,
    //         required: true,
    //     },
     },

    computed: {
        SS:SharedState,
        reveal() {
            return this.SS.cursorRow > this.myRowProp;
        },
        haveFocus() {
            return this.SS.cursorRow === this.myRowProp;
        }
    },
});
</script>

<style>
.guess-letter {
    position: absolute;
    left: 0;
    top: 0;
    display: inline-block;
    width: 100%;
    height: 100%;
    font-size: min(7vw, 35px);
    font-weight: normal;
    font-family: Arial, sans-serif;
    transition: transform .75s;
    transform-style: preserve-3D;
}
</style>

<style scoped>
.guess-row {
    display: flex;
    justify-content: center;
}

.letter-container {
    position: relative;
    height: min(8vw, 40px);
    width: min(8vw, 40px);
    margin: min(.5vw, 5px);
    perspective: 500px;
    box-sizing: content-box;
    border: 3px solid #EEE;
}

.game-in-progress .guess-row.current>.letter-container {
    border: 3px solid #888;

}

.game-in-progress .guess-row.focus>.letter-container.focus {
    border: 3px solid #888;
    background-color: #fee;
}

.guess-row.previous .letter-container {
    border: 3px solid #888;
}

@keyframes shake {
    0% {
        transform: translate(1px, 1px) rotate(0deg);
    }

    10% {
        transform: translate(-1px, -2px) rotate(-2deg);
    }

    20% {
        transform: translate(-3px, 0px) rotate(2deg);
    }

    30% {
        transform: translate(3px, 2px) rotate(0deg);
    }

    40% {
        transform: translate(1px, -1px) rotate(3deg);
    }

    50% {
        transform: translate(-1px, 2px) rotate(-3deg);
    }

    60% {
        transform: translate(-3px, 1px) rotate(0deg);
    }

    70% {
        transform: translate(3px, 1px) rotate(-4deg);
    }

    80% {
        transform: translate(-1px, -1px) rotate(1deg);
    }

    90% {
        transform: translate(1px, 2px) rotate(0deg);
    }

    100% {
        transform: translate(1px, -2px) rotate(-3deg);
    }
}

/* reveal color as default grey, conditionally yellow or green */
.reveal .back {
    background-color: var(--color-miss);
}

.reveal .back.present {
    background-color: var(--color-elsewhere);
}

.reveal .back.correct {
    background-color: var(--color-correct);
}

/* when reveal class added, flip the wrapper div ocer to expose colored div */
.reveal .guess-letter {
    transform: rotateY(180deg);
}

.game-won .guess-row.reveal.correct {
    animation: shake 0.5s;
    animation-iteration-count: 2;
    animation-delay: 2s;
}

/* flip the columns .5s apart */
.reveal .letter-container:nth-child(2) .guess-letter {
    transition-delay: .5s;
}

.reveal .letter-container:nth-child(3) .guess-letter {
    transition-delay: 1s;
}

.reveal .letter-container:nth-child(4) .guess-letter {
    transition-delay: 1.5s;
}

.reveal .letter-container:nth-child(5) .guess-letter {
    transition-delay: 2s;
}

.reveal .letter-container:nth-child(6) .guess-letter {
    transition-delay: 2.5s;
}
</style>